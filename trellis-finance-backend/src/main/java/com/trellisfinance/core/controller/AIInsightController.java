package com.trellisfinance.core.controller;

import com.trellisfinance.core.dto.response.AIInsightResponse;
import com.trellisfinance.core.service.AIAgentsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Insights")
public class AIInsightController {

    private final AIAgentsService aiAgentsService;

    @GetMapping("/insights")
    @Operation(summary = "AI-powered spending anomaly detection across all entity accounts")
    public ResponseEntity<AIInsightResponse> insights(@RequestParam UUID orgId) {
        return ResponseEntity.ok(aiAgentsService.getSpendingInsights(orgId));
    }

    @GetMapping("/investments")
    @Operation(summary = "AI-powered yield and investment recommendations for idle cash")
    public ResponseEntity<AIInsightResponse> investments(@RequestParam UUID orgId) {
        return ResponseEntity.ok(aiAgentsService.getInvestmentRecommendations(orgId));
    }
}
