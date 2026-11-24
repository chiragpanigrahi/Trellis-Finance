package com.trellisfinance.core.dto.request;

import com.trellisfinance.core.model.Account;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateAccountRequest {
    @NotBlank(message = "Account name is required")
    private String name;

    @NotNull(message = "Account type is required (CHECKING, SAVINGS, CREDIT, INTERNAL)")
    private Account.AccountType accountType;

    @NotBlank(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code")
    private String currency;

    /** Overridden by the path variable in OrganizationController */
    private UUID organizationId;

    private BigDecimal initialBalance;
    private String description;
}
