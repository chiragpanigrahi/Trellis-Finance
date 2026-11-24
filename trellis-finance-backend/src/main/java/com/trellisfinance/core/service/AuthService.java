package com.trellisfinance.core.service;

import com.trellisfinance.core.dto.request.LoginRequest;
import com.trellisfinance.core.dto.request.RegisterRequest;
import com.trellisfinance.core.dto.response.AuthResponse;
import com.trellisfinance.core.exception.ResourceNotFoundException;
import com.trellisfinance.core.model.OrganizationEntity;
import com.trellisfinance.core.model.UserEntity;
import com.trellisfinance.core.repository.OrganizationRepository;
import com.trellisfinance.core.repository.UserRepository;
import com.trellisfinance.core.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + req.getEmail());
        }

        OrganizationEntity org = organizationRepository.save(
            OrganizationEntity.builder()
                .name(req.getOrganizationName())
                .baseCurrency(req.getBaseCurrency().toUpperCase())
                .build()
        );

        UserEntity user = userRepository.save(
            UserEntity.builder()
                .email(req.getEmail())
                .fullName(req.getFullName())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(UserEntity.UserRole.ADMIN)
                .organizationId(org.getId())
                .build()
        );

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        UserEntity user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(UserEntity user) {
        String token = jwtTokenProvider.generateToken(
            user.getEmail(), user.getId(), user.getRole().name(), user.getOrganizationId()
        );
        return AuthResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .userId(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole().name())
            .organizationId(user.getOrganizationId())
            .build();
    }
}
