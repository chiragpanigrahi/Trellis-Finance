package com.trellisfinance.core.controller;

import com.trellisfinance.core.dto.request.CreateTransactionRequest;
import com.trellisfinance.core.dto.request.ReverseTransactionRequest;
import com.trellisfinance.core.dto.response.PagedTransactionResponse;
import com.trellisfinance.core.dto.response.TransactionResponse;
import com.trellisfinance.core.service.LedgerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions")
public class TransactionController {

    private final LedgerService ledgerService;

    @PostMapping
    @Operation(summary = "Post a new DEBIT or CREDIT to the immutable ledger")
    public ResponseEntity<TransactionResponse> post(@Valid @RequestBody CreateTransactionRequest req) {
        return ResponseEntity.ok(ledgerService.postTransaction(req));
    }

    @PostMapping("/{id}/reverse")
    @Operation(summary = "Reverse an existing transaction (creates an offsetting REVERSAL entry)")
    public ResponseEntity<TransactionResponse> reverse(
            @PathVariable UUID id,
            @RequestBody(required = false) ReverseTransactionRequest req) {
        return ResponseEntity.ok(ledgerService.reverseTransaction(id, req != null ? req.getReason() : null));
    }

    @GetMapping
    @Operation(summary = "Get paginated transactions for an account")
    public ResponseEntity<PagedTransactionResponse> list(
            @RequestParam UUID accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ledgerService.getTransactions(accountId, page, size));
    }
}
