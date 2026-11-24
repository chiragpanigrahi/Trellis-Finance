package com.trellisfinance.core.service;

import com.trellisfinance.core.dto.request.CreateAccountRequest;
import com.trellisfinance.core.dto.request.CreateOrganizationRequest;
import com.trellisfinance.core.dto.response.AccountResponse;
import com.trellisfinance.core.dto.response.OrganizationResponse;
import com.trellisfinance.core.exception.ResourceNotFoundException;
import com.trellisfinance.core.model.Account;
import com.trellisfinance.core.model.OrganizationEntity;
import com.trellisfinance.core.repository.AccountRepository;
import com.trellisfinance.core.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final AccountRepository accountRepository;

    public OrganizationResponse getOrganization(UUID id) {
        OrganizationEntity org = findOrg(id);
        OrganizationResponse resp = toResponse(org);
        resp.setSubsidiaries(
            organizationRepository.findAllByParentOrgId(id).stream()
                .map(this::toResponse).collect(Collectors.toList())
        );
        resp.setAccounts(
            accountRepository.findAllByOrganizationId(id).stream()
                .map(this::toAccountResponse).collect(Collectors.toList())
        );
        return resp;
    }

    public List<OrganizationResponse> getSubsidiaries(UUID parentId) {
        return organizationRepository.findAllByParentOrgId(parentId).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrganizationResponse createSubsidiary(UUID parentId, CreateOrganizationRequest req) {
        findOrg(parentId); // verify parent exists
        OrganizationEntity sub = OrganizationEntity.builder()
            .name(req.getName())
            .baseCurrency(req.getBaseCurrency().toUpperCase())
            .parentOrgId(parentId)
            .description(req.getDescription())
            .build();
        return toResponse(organizationRepository.save(sub));
    }

    @Transactional
    public AccountResponse createAccount(UUID orgId, CreateAccountRequest req) {
        OrganizationEntity org = findOrg(orgId);
        Account account = Account.builder()
            .name(req.getName())
            .accountType(req.getAccountType())
            .currency(req.getCurrency().toUpperCase())
            .currentBalance(req.getInitialBalance() != null ? req.getInitialBalance() : BigDecimal.ZERO)
            .organizationId(orgId)
            .description(req.getDescription())
            .build();
        AccountResponse resp = toAccountResponse(accountRepository.save(account));
        resp.setOrganizationName(org.getName());
        return resp;
    }

    // --- Mappers ---

    private OrganizationEntity findOrg(UUID id) {
        return organizationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Organization", id.toString()));
    }

    private OrganizationResponse toResponse(OrganizationEntity org) {
        return OrganizationResponse.builder()
            .id(org.getId()).name(org.getName())
            .baseCurrency(org.getBaseCurrency())
            .parentOrgId(org.getParentOrgId())
            .description(org.getDescription())
            .createdAt(org.getCreatedAt())
            .build();
    }

    private AccountResponse toAccountResponse(Account a) {
        return AccountResponse.builder()
            .id(a.getId()).name(a.getName())
            .accountType(a.getAccountType())
            .currency(a.getCurrency())
            .currentBalance(a.getCurrentBalance())
            .organizationId(a.getOrganizationId())
            .description(a.getDescription())
            .createdAt(a.getCreatedAt())
            .build();
    }
}
