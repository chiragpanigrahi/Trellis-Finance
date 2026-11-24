package com.trellisfinance.core.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LedgerSummaryResponse {
    private BigDecimal totalDebits;
    private BigDecimal totalCredits;
    private BigDecimal netCashFlow;
    private Map<String, BigDecimal> categoryBreakdown;
    private long totalTransactions;
    private long transactionsToday;
}
