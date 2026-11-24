package com.trellisfinance.core.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Must be a valid email address")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Organization name is required")
    private String organizationName;

    @NotBlank(message = "Base currency is required (e.g. USD, EUR, GBP)")
    @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code")
    private String baseCurrency;
}
