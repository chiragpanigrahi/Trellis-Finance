package com.trellisfinance.core.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ConsolidatedBalanceResponse {
    private UUID organizationId;
    private String organizationName;
    private String baseCurrency;
    private BigDecimal totalConsolidatedBalance;
    private BigDecimal totalIdleCash;
    private List<EntityBalance> entities;
    private long lastUpdatedEpoch;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class EntityBalance {
        private UUID orgId;
        private String orgName;
        private String localCurrency;
        private BigDecimal localBalance;
        private BigDecimal convertedBalance;
        private double exchangeRate;
        private List<AccountResponse> accounts;
    }
}
