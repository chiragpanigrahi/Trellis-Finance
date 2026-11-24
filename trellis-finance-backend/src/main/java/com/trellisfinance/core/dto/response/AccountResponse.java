package com.trellisfinance.core.dto.response;

import com.trellisfinance.core.model.Account;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AccountResponse {
    private UUID id;
    private String name;
    private Account.AccountType accountType;
    private String currency;
    private BigDecimal currentBalance;
    private UUID organizationId;
    private String organizationName;
    private String description;
    private LocalDateTime createdAt;
    /** Balance converted to parent org's base currency */
    private BigDecimal convertedBalance;
    private String baseCurrency;
}
