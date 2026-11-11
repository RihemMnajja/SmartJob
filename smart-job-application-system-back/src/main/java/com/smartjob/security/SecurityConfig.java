package com.smartjob.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {
        System.out.println("===== SECURITY CONFIG CHARGED =====");

        http

                // ==========================================
                // CSRF
                // ==========================================

                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable()))

                // ==========================================
                // SESSION
                // ==========================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // ==========================================
                // AUTORISATIONS
                // ==========================================

                .authorizeHttpRequests(auth -> auth
// ==========================================

                                // SWAGGER PUBLIC
                                // ==========================================

                                .requestMatchers(
                                        "/swagger-ui/**",
                                        "/swagger-ui.html",
                                        "/v3/api-docs/**",
                                        "/v3/api-docs.yaml"
                                ).permitAll()
                        // ==========================================
                        // ENDPOINTS PUBLICS
                        // ==========================================

                        .requestMatchers(
                                "/auth/login",
                                "/auth/register",
                                "/auth/register/recruiter",
                                "/auth/forgot-password",
                                "/auth/reset-password"
                        ).permitAll()


                        // ==========================================
                        // ADMIN
                        // ==========================================

                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole("ADMIN")


                        // ==========================================
                        // RH
                        // ==========================================

                        .requestMatchers(
                                "/api/rh/**"
                        )
                        .hasRole("RH")


                        // ==========================================
                        // CANDIDAT
                        // ==========================================

                        .requestMatchers(
                                "/api/candidate/**"
                        )
                        .hasRole("CANDIDAT")


                        // ==========================================
                        // JOB OFFERS
                        // ==========================================

                        // Création d'une offre
                        // Réservée aux RH

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/offers"
                        )
                        .hasRole("RH")


                        // Modification d'une offre
                        // Réservée aux RH

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/offers/**"
                        )
                        .hasRole("RH")


                        // Suppression d'une offre
                        // Réservée aux RH

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/offers/**"
                        )
                        .hasRole("RH")


                        // Consultation des offres
                        // Accessible aux utilisateurs authentifiés

                        // .requestMatchers(
                        //   HttpMethod.GET,
                        //     "/api/offers",
                        //    "/api/offers/**"
                                //)
                                //.authenticated()

                                // ==========================================
// JOB OFFERS
// ==========================================

                               // Voir les offres : public
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/offers",
                                        "/api/offers/**"
                                )
                                .permitAll()


                               // Créer une offre : RH uniquement
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/offers"
                                )
                                .hasRole("RH")


                                // Modifier une offre : RH uniquement
                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/api/offers/**"
                                )
                                .hasRole("RH")


                                // Supprimer une offre : RH uniquement
                                .requestMatchers(
                                        HttpMethod.DELETE,
                                        "/api/offers/**"
                                )
                                .hasRole("RH")


                        // ==========================================
                        // GESTION DES CANDIDATURES
                        // ==========================================

                        // Création d'une candidature
                        // Réservée aux candidats

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications"
                        )
                        .hasRole("CANDIDAT")


                        // Upload du CV
                        // Réservé aux candidats

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications/*/upload-cv"
                        )
                        .hasRole("CANDIDAT")

                                // ==========================================
// PROFIL CANDIDAT
// ==========================================

// Créer un profil
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/profile/*"
                                )
                                .hasRole("CANDIDAT")

// Modifier le profil
                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/profile/*"
                                )
                                .hasRole("CANDIDAT")

// Upload photo
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/profile/*/upload-photo"
                                )
                                .hasRole("CANDIDAT")

// Voir la photo
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/profile/*/photo"
                                )
                                .authenticated()

// Consulter le profil
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/profile/*"
                                )
                                .authenticated()

// Supprimer le profil
                                .requestMatchers(
                                        HttpMethod.DELETE,
                                        "/profile/*"
                                )
                                .hasRole("CANDIDAT")


                        // Analyse IA d'une candidature
                        // Réservée aux utilisateurs authentifiés

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications/*/analyze"
                        )
                        .authenticated()


                        // Consultation du CV
                        // Réservée aux RH

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/*/view-cv"
                        )
                        .hasRole("RH")


                        // Modification du statut
                        // Réservée aux RH

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/applications/*/status"
                        )
                        .hasRole("RH")


                        // Consultation des candidatures d'une offre
                        // Réservée aux RH

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/offer/**"
                        )
                        .hasRole("RH")


                        // Consultation des candidatures d'un candidat
                        // Réservée aux candidats

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/candidate/**"
                        )
                        .hasRole("CANDIDAT")


                        // ==========================================
                        // AUTRES ENDPOINTS APPLICATIONS
                        // ==========================================

                        .requestMatchers(
                                "/api/applications/**"
                        )
                        .authenticated()
// ==========================================
// ==========================================
// PROFIL RH
// ==========================================

                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/recruiters"
                                )
                                .hasRole("RH")

                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/api/recruiters/**"
                                )
                                .hasRole("RH")

                                .requestMatchers(
                                        HttpMethod.DELETE,
                                        "/api/recruiters/**"
                                )
                                .hasRole("RH")

                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/recruiters/**"
                                )
                                .authenticated()
                        // ==========================================
                        // TOUT LE RESTE
                        // ==========================================

                        .anyRequest()
                        //.authenticated()
                                .permitAll()
                )


                // ==========================================
                // JWT FILTER
                // ==========================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}