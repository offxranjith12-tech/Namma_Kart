package com.grocery.config;

import com.grocery.security.JwtAuthenticationEntryPoint;
import com.grocery.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Security Configuration
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF because this is a REST API using JWT
            .csrf(AbstractHttpConfigurer::disable)

            // H2 console support if needed
            .headers(headers ->
                headers.frameOptions(
                    HeadersConfigurer.FrameOptionsConfig::disable
                )
            )

            // Unauthorized request handler
            .exceptionHandling(exception ->
                exception.authenticationEntryPoint(unauthorizedHandler)
            )

            // JWT = Stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC ENDPOINTS
                // =========================
                .requestMatchers("/api/auth/**").permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/categories/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/products/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/delivery-slots/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/products/*/reviews"
                ).permitAll()

                .requestMatchers("/h2-console/**").permitAll()


                // =========================
                // ADMIN ENDPOINTS
                // =========================
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")


                // =========================
                // DELIVERY PERSON
                // =========================
                .requestMatchers("/api/delivery/**")
                .hasRole("DELIVERY_PERSON")


                // =========================
                // AUTHENTICATED USER
                // =========================
                .requestMatchers("/api/users/me")
                .authenticated()

                .requestMatchers("/api/addresses/**")
                .authenticated()

                .requestMatchers("/api/cart/**")
                .authenticated()

                .requestMatchers("/api/wishlist/**")
                .authenticated()

                .requestMatchers("/api/coupons/validate")
                .authenticated()

                .requestMatchers("/api/orders/**")
                .authenticated()

                .requestMatchers("/api/notifications/**")
                .authenticated()

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/products/*/reviews"
                ).authenticated()


                // =========================
                // EVERYTHING ELSE
                // =========================
                .anyRequest()
                .authenticated()
            );

        // JWT Authentication Filter
        http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }


    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
            new CorsConfiguration();

        // Your deployed React frontend
        configuration.setAllowedOriginPatterns(
            List.of(
                "https://namma-kart-frontend.onrender.com"
            )
        );

        // Allowed HTTP methods
        configuration.setAllowedMethods(
            Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
            )
        );

        // Allowed request headers
        configuration.setAllowedHeaders(
            Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
            )
        );

        // Headers exposed to frontend
        configuration.setExposedHeaders(
            List.of("Authorization")
        );

        // Required for JWT / credentials
        configuration.setAllowCredentials(true);

        // Browser can cache CORS preflight response
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }
}