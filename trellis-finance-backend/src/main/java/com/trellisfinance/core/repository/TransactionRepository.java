package com.trellisfinance.core.repository;

import com.trellisfinance.core.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Page<Transaction> findAllByAccountId(UUID accountId, Pageable pageable);

    List<Transaction> findAllByAccountIdOrderByTransactionDateDesc(UUID accountId);

    @Query("SELECT t FROM Transaction t WHERE t.accountId = :accountId " +
           "AND t.transactionDate BETWEEN :from AND :to ORDER BY t.transactionDate DESC")
    List<Transaction> findByAccountIdAndDateRange(
            @Param("accountId") UUID accountId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    /** Spending by category over the last N days across a set of accounts */
    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t " +
           "WHERE t.accountId IN :accountIds " +
           "  AND t.type = com.trellisfinance.core.model.Transaction.TransactionType.DEBIT " +
           "  AND t.transactionDate >= :since " +
           "GROUP BY t.category ORDER BY SUM(t.amount) DESC")
    List<Object[]> findCategorySpending(
            @Param("accountIds") List<UUID> accountIds,
            @Param("since") LocalDate since);

    /** Daily net cash flow (CREDIT minus DEBIT) for charting */
    @Query("SELECT t.transactionDate, " +
           "SUM(CASE WHEN t.type = com.trellisfinance.core.model.Transaction.TransactionType.CREDIT THEN t.amount ELSE 0 END) - " +
           "SUM(CASE WHEN t.type = com.trellisfinance.core.model.Transaction.TransactionType.DEBIT  THEN t.amount ELSE 0 END) " +
           "FROM Transaction t WHERE t.accountId IN :accountIds AND t.transactionDate >= :since " +
           "GROUP BY t.transactionDate ORDER BY t.transactionDate")
    List<Object[]> findDailyCashFlow(
            @Param("accountIds") List<UUID> accountIds,
            @Param("since") LocalDate since);

    long countByTransactionDate(LocalDate date);
}
