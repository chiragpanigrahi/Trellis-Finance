package com.trellisfinance.core.controller;

import com.trellisfinance.core.dto.request.CreateAccountRequest;
import com.trellisfinance.core.dto.request.CreateOrganizationRequest;
import com.trellisfinance.core.dto.response.AccountResponse;
import com.trellisfinance.core.dto.response.OrganizationResponse;
import com.trellisfinance.core.service.OrganizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orgs")
@RequiredArgsConstructor
@Tag(name = "Organizations")
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping("/{id}")
    @Operation(summary = "Get organization detail including subsidiaries and accounts")
    public ResponseEntity<OrganizationResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(organizationService.getOrganization(id));
    }

    @GetMapping("/{id}/subsidiaries")
    @Operation(summary = "List all subsidiaries under an organization")
    public ResponseEntity<List<OrganizationResponse>> getSubsidiaries(@PathVariable UUID id) {
        return ResponseEntity.ok(organizationService.getSubsidiaries(id));
    }

    @PostMapping("/{id}/subsidiaries")
    @Operation(summary = "Create a subsidiary under an organization")
    public ResponseEntity<OrganizationResponse> createSubsidiary(
            @PathVariable UUID id,
            @Valid @RequestBody CreateOrganizationRequest req) {
        return ResponseEntity.ok(organizationService.createSubsidiary(id, req));
    }

    @PostMapping("/{id}/accounts")
    @Operation(summary = "Create an account under an organization")
    public ResponseEntity<AccountResponse> createAccount(
            @PathVariable UUID id,
            @Valid @RequestBody CreateAccountRequest req) {
        req.setOrganizationId(id);
        return ResponseEntity.ok(organizationService.createAccount(id, req));
    }
}
