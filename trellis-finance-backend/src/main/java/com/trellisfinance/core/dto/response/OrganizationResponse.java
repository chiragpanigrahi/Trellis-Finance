package com.trellisfinance.core.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrganizationResponse {
    private UUID id;
    private String name;
    private String baseCurrency;
    private UUID parentOrgId;
    private String description;
    private LocalDateTime createdAt;
    private List<OrganizationResponse> subsidiaries;
    private List<AccountResponse> accounts;
}
