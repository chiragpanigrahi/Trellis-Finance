package com.trellisfinance.core.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI trellisOpenAPI() {
        final String schemeName = "Bearer Authentication";
        return new OpenAPI()
            .info(new Info()
                .title("Trellis Finance API")
                .description("""
                    Enterprise Treasury Management Platform.
                    
                    Multi-currency ledger with real-time FX consolidation, AI-powered spending anomaly detection,
                    and idle-cash investment recommendations.
                    
                    All transaction endpoints require JWT authentication.
                    Use POST /api/auth/login to obtain a token, then click 'Authorize' above.
                    """)
                .version("1.0.0")
                .contact(new Contact()
                    .name("Trellis Finance Engineering")
                    .email("api@trellisfinance.com"))
            )
            .addSecurityItem(new SecurityRequirement().addList(schemeName))
            .components(new Components()
                .addSecuritySchemes(schemeName, new SecurityScheme()
                    .name(schemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                )
            );
    }
}
