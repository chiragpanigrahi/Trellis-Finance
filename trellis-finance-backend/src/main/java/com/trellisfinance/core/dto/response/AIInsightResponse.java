package com.trellisfinance.core.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AIInsightResponse {
    private List<SpendingAnomaly> anomalies;
    private List<InvestmentRecommendation> investments;
    private String summary;
    private String generatedAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SpendingAnomaly {
        private String category;
        private String entityName;
        private double percentageIncrease;
        private String severity;         // HIGH | MEDIUM | LOW
        private String description;
        private String recommendation;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class InvestmentRecommendation {
        private String type;             // BONDS | FOREX | MONEY_MARKET
        private String title;
        private double yieldPercentage;
        private String amount;
        private String currency;
        private String description;
        private String riskLevel;        // LOW | MEDIUM | HIGH
        private String action;
    }
}
