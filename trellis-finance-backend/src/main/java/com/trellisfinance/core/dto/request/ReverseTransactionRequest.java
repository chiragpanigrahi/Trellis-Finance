package com.trellisfinance.core.dto.request;

import lombok.Data;

@Data
public class ReverseTransactionRequest {
    /** Human-readable reason for the reversal (stored in reversal description) */
    private String reason;
}
