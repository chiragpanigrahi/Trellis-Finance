package com.trellisfinance.core.controller;

import com.trellisfinance.core.dto.response.ConsolidatedBalanceResponse;
import com.trellisfinance.core.dto.response.LedgerSummaryResponse;
import com.trellisfinance.core.service.LedgerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/ledger")
@RequiredArgsConstructor
@Tag(name = "Ledger")
public class LedgerController {

    private final LedgerService ledgerService;

    @GetMapping("/consolidated")
    @Operation(summary = "Real-time multi-currency consolidated balance across all subsidiaries")
    public ResponseEntity<ConsolidatedBalanceResponse> consolidated(@RequestParam UUID orgId) {
        return ResponseEntity.ok(ledgerService.getConsolidatedBalance(orgId));
    }

    @GetMapping("/summary")
    @Operation(summary = "Ledger summary: total debits, credits, category breakdown for an org")
    public ResponseEntity<LedgerSummaryResponse> summary(@RequestParam UUID orgId) {
        return ResponseEntity.ok(ledgerService.getLedgerSummary(orgId));
    }
}
