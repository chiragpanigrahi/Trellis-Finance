package com.trellisfinance.core.dto.response;

import lombok.*;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private UUID userId;
    private String email;
    private String fullName;
    private String role;
    private UUID organizationId;
}
