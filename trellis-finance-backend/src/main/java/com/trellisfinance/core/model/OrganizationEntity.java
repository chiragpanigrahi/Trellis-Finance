package com.trellisfinance.core.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "organizations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    /** ISO 4217 currency code, e.g. "USD", "EUR", "GBP" */
    @Column(nullable = false, length = 3)
    private String baseCurrency;

    /** Null for top-level (parent) organizations */
    @Column
    private UUID parentOrgId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (baseCurrency != null) baseCurrency = baseCurrency.toUpperCase();
    }
}
