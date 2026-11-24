package com.trellisfinance.core.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.UUID;

@Data
public class CreateOrganizationRequest {
    @NotBlank(message = "Organization name is required")
    private String name;

    @NotBlank(message = "Base currency is required")
    @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code")
    private String baseCurrency;

    /** Omit for top-level orgs; set to create a subsidiary */
    private UUID parentOrgId;

    private String description;
}
