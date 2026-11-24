package com.trellisfinance.core.dto.request;

import com.trellisfinance.core.model.Transaction;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateTransactionRequest {
    @NotNull(message = "Account ID is required")
    private UUID accountId;

    @NotNull(message = "Transaction type is required (DEBIT or CREDIT)")
    private Transaction.TransactionType type;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code")
    private String currency;

    private String category;
    private String description;

    /** Defaults to today if omitted */
    private LocalDate transactionDate;
}
