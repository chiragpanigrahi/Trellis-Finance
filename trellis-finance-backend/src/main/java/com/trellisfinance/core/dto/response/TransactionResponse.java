package com.trellisfinance.core.dto.response;

import com.trellisfinance.core.model.Transaction;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TransactionResponse {
    private UUID id;
    private UUID accountId;
    private String accountName;
    private Transaction.TransactionType type;
    private BigDecimal amount;
    private String currency;
    private String category;
    private String description;
    private UUID referenceId;
    private Transaction.TransactionStatus status;
    private LocalDate transactionDate;
    private LocalDateTime createdAt;
}
