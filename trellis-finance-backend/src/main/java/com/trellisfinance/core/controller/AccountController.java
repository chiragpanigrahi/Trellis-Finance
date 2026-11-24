package com.trellisfinance.core.controller;

import com.trellisfinance.core.dto.response.AccountResponse;
import com.trellisfinance.core.exception.ResourceNotFoundException;
import com.trellisfinance.core.model.Account;
import com.trellisfinance.core.repository.AccountRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Accounts")
public class AccountController {

    private final AccountRepository accountRepository;

    @GetMapping
    @Operation(summary = "List all accounts for an organization")
    public ResponseEntity<List<AccountResponse>> list(@RequestParam UUID organizationId) {
        List<AccountResponse> accounts = accountRepository.findAllByOrganizationId(organizationId)
            .stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single account by ID")
    public ResponseEntity<AccountResponse> get(@PathVariable UUID id) {
        Account a = accountRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Account", id.toString()));
        return ResponseEntity.ok(toResponse(a));
    }

    private AccountResponse toResponse(Account a) {
        return AccountResponse.builder()
            .id(a.getId()).name(a.getName())
            .accountType(a.getAccountType()).currency(a.getCurrency())
            .currentBalance(a.getCurrentBalance())
            .organizationId(a.getOrganizationId())
            .description(a.getDescription()).createdAt(a.getCreatedAt())
            .build();
    }
}
