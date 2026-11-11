package com.smartjob.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // ==========================================
    // JWT SIGNING KEY
    // ==========================================

    private Key getKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }


    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    public String generateToken(
            String email,
            String role,
            Long userId
    ) {

        return Jwts.builder()

                .setSubject(email)

                .claim("role", role)

                .claim("userId", userId)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )

                .signWith(
                        getKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }


    // ==========================================
    // EXTRACT CLAIMS
    // ==========================================

    public Claims extractClaims(String token) {

        return Jwts.parserBuilder()

                .setSigningKey(getKey())

                .build()

                .parseClaimsJws(token)

                .getBody();
    }


    // ==========================================
    // EXTRACT EMAIL
    // ==========================================

    public String extractEmail(String token) {

        return extractClaims(token)
                .getSubject();
    }


    // ==========================================
    // EXTRACT USER ID
    // ==========================================

    public Long extractUserId(String token) {

        return extractClaims(token)
                .get("userId", Long.class);
    }


    // ==========================================
    // EXTRACT ROLE
    // ==========================================

    public String extractRole(String token) {

        return extractClaims(token)
                .get("role", String.class);
    }


    // ==========================================
    // CHECK TOKEN VALIDITY
    // ==========================================

    public boolean isTokenValid(String token) {

        try {

            extractClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }
}