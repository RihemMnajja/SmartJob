package com.smartjob.security;

import com.smartjob.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getRequestURI();

        return path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/webjars")
                || path.equals("/swagger-ui.html");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // ==========================================
        // 1. RECUPERER LE HEADER AUTHORIZATION
        // ==========================================

        String authHeader =
                request.getHeader("Authorization");

        // ==========================================
        // 2. VERIFIER LA PRESENCE DU TOKEN
        // ==========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // ==========================================
        // 3. EXTRAIRE LE TOKEN
        // ==========================================

        String token =
                authHeader.substring(7).trim();

        if (token.isBlank()) {

            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("========== JWT DEBUG ==========");
        System.out.println("TOKEN RECEIVED = " + token);

        try {

            // ==========================================
            // 4. VERIFIER LE TOKEN
            // ==========================================

            if (!jwtService.isTokenValid(token)) {

                System.out.println("TOKEN VALID = false");

                SecurityContextHolder.clearContext();

                filterChain.doFilter(request, response);

                return;
            }

            System.out.println("TOKEN VALID = true");

            // ==========================================
            // 5. EXTRAIRE LES INFORMATIONS
            // ==========================================

            Long userId =
                    jwtService.extractUserId(token);

            String email =
                    jwtService.extractEmail(token);

            String role =
                    jwtService.extractRole(token);

            System.out.println("USER ID = " + userId);
            System.out.println("EMAIL = " + email);
            System.out.println("ROLE = " + role);

            // ==========================================
            // 6. VERIFICATION
            // ==========================================

            if (userId == null ||
                    email == null ||
                    email.isBlank() ||
                    role == null ||
                    role.isBlank()) {

                throw new RuntimeException(
                        "Informations utilisateur invalides dans le JWT"
                );
            }

            // ==========================================
            // 7. CREER L'AUTORITE
            // ==========================================

            String authority =
                    role.startsWith("ROLE_")
                            ? role
                            : "ROLE_" + role;

            // ==========================================
            // 8. UTILISATEUR AUTHENTIFIE
            // ==========================================

            AuthenticatedUser authenticatedUser =
                    new AuthenticatedUser(
                            userId,
                            email,
                            role
                    );

            // ==========================================
            // 9. AUTHENTIFICATION SPRING SECURITY
            // ==========================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            authenticatedUser,
                            null,
                            Collections.singletonList(
                                    new SimpleGrantedAuthority(authority)
                            )
                    );

            // ==========================================
            // 10. ENREGISTRER AUTHENTIFICATION
            // ==========================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println("JWT AUTHENTICATION SUCCESS");

        } catch (Exception e) {

            System.out.println(
                    "JWT ERROR: "
                            + e.getClass().getSimpleName()
                            + " - "
                            + e.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        // ==========================================
        // 11. CONTINUER LA REQUETE
        // ==========================================

        filterChain.doFilter(request, response);
    }
}