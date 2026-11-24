package com.trellisfinance.core.service;

import com.trellisfinance.core.dto.request.CreateTransactionRequest;
import com.trellisfinance.core.dto.response.*;
import com.trellisfinance.core.exception.InsufficientFundsException;
import com.trellisfinance.core.exception.ResourceNotFoundException;
import com.trellisfinance.core.model.Account;
import com.trellisfinance.core.model.OrganizationEntity;
import com.trellisfinance.core.model.Transaction;
import com.trellisfinance.core.repository.AccountRepository;
import com.trellisfinance.core.repository.OrganizationRepository;
import com.trellisfinance.core.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LedgerService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final OrganizationRepository organizationRepository;
    private final ExchangeRateService fxService;

    // -------------------------------------------------------------------------
    // Posting
    // -------------------------------------------------------------------------

    @Transactional
    public TransactionResponse postTransaction(CreateTransactionRequest req) {
        Account account = findAccount(req.getAccountId());

        if (req.getType() == Transaction.TransactionType.DEBIT) {
            if (account.getCurrentBalance().compareTo(req.getAmount()) < 0) {
                throw new InsufficientFundsException(
                    "Insufficient funds. Balance: " + account.getCurrency() + " " + account.getCurrentBalance() +
                    ", required: " + req.getAmount());
            }
            account.setCurrentBalance(account.getCurrentBalance().subtract(req.getAmount()));
        } else {
            account.setCurrentBalance(account.getCurrentBalance().add(req.getAmount()));
        }
        accountRepository.save(account);

        Transaction tx = Transaction.builder()
            .accountId(req.getAccountId())
            .type(req.getType())
            .amount(req.getAmount())
            .currency(req.getCurrency().toUpperCase())
            .category(req.getCategory())
            .description(req.getDescription())
            .status(Transaction.TransactionStatus.POSTED)
            .transactionDate(req.getTransactionDate() != null ? req.getTransactionDate() : LocalDate.now())
            .build();

        log.info("Posted {} {} {} on account {}", req.getType(), req.getAmount(), req.getCurrency(), req.getAccountId());
        return toResponse(transactionRepository.save(tx), account.getName());
    }

    @Transactional
    public TransactionResponse reverseTransaction(UUID txId, String reason) {
        Transaction original = transactionRepository.findById(txId)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction", txId.toString()));

        if (original.getStatus() == Transaction.TransactionStatus.REVERSED) {
            throw new IllegalStateException("Transaction " + txId + " is already reversed");
        }

        Account account = findAccount(original.getAccountId());

        // Unwind the balance effect
        if (original.getType() == Transaction.TransactionType.DEBIT) {
            account.setCurrentBalance(account.getCurrentBalance().add(original.getAmount()));
        } else {
            if (account.getCurrentBalance().compareTo(original.getAmount()) < 0) {
                throw new InsufficientFundsException("Cannot reverse CREDIT: insufficient balance for reversal");
            }
            account.setCurrentBalance(account.getCurrentBalance().subtract(original.getAmount()));
        }
        accountRepository.save(account);

        original.setStatus(Transaction.TransactionStatus.REVERSED);
        transactionRepository.save(original);

        Transaction reversal = Transaction.builder()
            .accountId(original.getAccountId())
            .type(Transaction.TransactionType.REVERSAL)
            .amount(original.getAmount())
            .currency(original.getCurrency())
            .category(original.getCategory())
            .description("REVERSAL: " + (reason != null ? reason : original.getDescription()))
            .referenceId(original.getId())
            .status(Transaction.TransactionStatus.POSTED)
            .transactionDate(LocalDate.now())
            .build();

        log.info("Reversed transaction {} on account {}", txId, account.getId());
        return toResponse(transactionRepository.save(reversal), account.getName());
    }

    // -------------------------------------------------------------------------
    // Queries
    // -------------------------------------------------------------------------

    public PagedTransactionResponse getTransactions(UUID accountId, int page, int size) {
        Account account = findAccount(accountId);
        Page<Transaction> txPage = transactionRepository.findAllByAccountId(
            accountId, PageRequest.of(page, size, Sort.by("transactionDate").descending())
        );
        List<TransactionResponse> content = txPage.getContent().stream()
            .map(t -> toResponse(t, account.getName()))
            .collect(Collectors.toList());
        return PagedTransactionResponse.builder()
            .content(content).page(page).size(size)
            .totalElements(txPage.getTotalElements())
            .totalPages(txPage.getTotalPages())
            .last(txPage.isLast())
            .build();
    }

    // -------------------------------------------------------------------------
    // Core Engine: Global Liquidity Consolidation
    // -------------------------------------------------------------------------

    public ConsolidatedBalanceResponse getConsolidatedBalance(UUID rootOrgId) {
        OrganizationEntity root = organizationRepository.findById(rootOrgId)
            .orElseThrow(() -> new ResourceNotFoundException("Organization", rootOrgId.toString()));

        String base = root.getBaseCurrency();

        List<OrganizationEntity> entities = new ArrayList<>();
        entities.add(root);
        entities.addAll(organizationRepository.findAllByParentOrgId(rootOrgId));

        BigDecimal totalBalance = BigDecimal.ZERO;
        BigDecimal totalIdle    = BigDecimal.ZERO;
        List<ConsolidatedBalanceResponse.EntityBalance> entityBalances = new ArrayList<>();

        for (OrganizationEntity entity : entities) {
            List<Account> accounts = accountRepository.findAllByOrganizationId(entity.getId());

            BigDecimal localTotal = accounts.stream()
                .map(Account::getCurrentBalance).reduce(BigDecimal.ZERO, BigDecimal::add);

            double rate = 1.0;
            BigDecimal converted = localTotal;
            if (!entity.getBaseCurrency().equalsIgnoreCase(base)) {
                BigDecimal r = fxService.getRate(entity.getBaseCurrency(), base);
                rate = r.doubleValue();
                converted = fxService.convert(localTotal, entity.getBaseCurrency(), base);
            }
            totalBalance = totalBalance.add(converted);

            // Idle cash heuristic: checking/savings with > 500k local currency
            BigDecimal idle = accounts.stream()
                .filter(a -> a.getAccountType() == Account.AccountType.CHECKING
                          || a.getAccountType() == Account.AccountType.SAVINGS)
                .map(Account::getCurrentBalance)
                .filter(b -> b.compareTo(new BigDecimal("500000")) > 0)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (!entity.getBaseCurrency().equalsIgnoreCase(base)) {
                idle = fxService.convert(idle, entity.getBaseCurrency(), base);
            }
            totalIdle = totalIdle.add(idle);

            List<AccountResponse> accResponses = accounts.stream()
                .map(a -> AccountResponse.builder()
                    .id(a.getId()).name(a.getName())
                    .accountType(a.getAccountType())
                    .currency(a.getCurrency())
                    .currentBalance(a.getCurrentBalance())
                    .organizationId(a.getOrganizationId())
                    .description(a.getDescription())
                    .createdAt(a.getCreatedAt())
                    .build())
                .collect(Collectors.toList());

            entityBalances.add(ConsolidatedBalanceResponse.EntityBalance.builder()
                .orgId(entity.getId()).orgName(entity.getName())
                .localCurrency(entity.getBaseCurrency())
                .localBalance(localTotal).convertedBalance(converted)
                .exchangeRate(rate).accounts(accResponses)
                .build());
        }

        return ConsolidatedBalanceResponse.builder()
            .organizationId(rootOrgId).organizationName(root.getName())
            .baseCurrency(base)
            .totalConsolidatedBalance(totalBalance)
            .totalIdleCash(totalIdle)
            .entities(entityBalances)
            .lastUpdatedEpoch(Instant.now().toEpochMilli())
            .build();
    }

    public LedgerSummaryResponse getLedgerSummary(UUID orgId) {
        List<Account> accounts = accountRepository.findAllByOrganizationId(orgId);
        List<UUID> accountIds = accounts.stream().map(Account::getId).collect(Collectors.toList());

        long totalTx = accountIds.stream()
            .mapToLong(aid -> transactionRepository.findAllByAccountIdOrderByTransactionDateDesc(aid).size())
            .sum();
        long today = transactionRepository.countByTransactionDate(LocalDate.now());

        Map<String, BigDecimal> breakdown = new HashMap<>();
        LocalDate since = LocalDate.now().minusDays(90);
        List<Object[]> catData = transactionRepository.findCategorySpending(accountIds, since);
        catData.forEach(row -> {
            String cat = (String) row[0];
            BigDecimal amt = (BigDecimal) row[1];
            if (cat != null) breakdown.put(cat, amt);
        });

        BigDecimal totalCredits = accounts.stream().map(Account::getCurrentBalance)
            .filter(b -> b.compareTo(BigDecimal.ZERO) > 0).reduce(BigDecimal.ZERO, BigDecimal::add);

        return LedgerSummaryResponse.builder()
            .totalTransactions(totalTx).transactionsToday(today)
            .totalCredits(totalCredits).totalDebits(BigDecimal.ZERO)
            .netCashFlow(totalCredits).categoryBreakdown(breakdown)
            .build();
    }

    // -------------------------------------------------------------------------

    private Account findAccount(UUID id) {
        return accountRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Account", id.toString()));
    }

    private TransactionResponse toResponse(Transaction t, String accountName) {
        return TransactionResponse.builder()
            .id(t.getId()).accountId(t.getAccountId()).accountName(accountName)
            .type(t.getType()).amount(t.getAmount()).currency(t.getCurrency())
            .category(t.getCategory()).description(t.getDescription())
            .referenceId(t.getReferenceId()).status(t.getStatus())
            .transactionDate(t.getTransactionDate()).createdAt(t.getCreatedAt())
            .build();
    }
}
