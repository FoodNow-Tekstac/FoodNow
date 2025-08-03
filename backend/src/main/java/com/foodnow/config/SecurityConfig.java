package com.foodnow.config;

import com.foodnow.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // THIS IS THE FIX: Allow public access to the frontend files.
                .requestMatchers("/", "/index.html", "/assets/**", "/customer/**", "/admin/**", "/restaurant/**", "/delivery/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll() 
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/restaurant/apply").hasRole("CUSTOMER")
                .requestMatchers("/api/restaurant/**").hasRole("RESTAURANT_OWNER")
                .requestMatchers("/api/cart/**").hasRole("CUSTOMER")
                .requestMatchers("/api/orders/**").hasRole("CUSTOMER")
                .requestMatchers("/api/payments/**").hasRole("CUSTOMER")
                                .requestMatchers("/api/profile/**").authenticated() // ADD THIS RULE

                                .requestMatchers("/api/delivery/**").hasRole("DELIVERY_PERSONNEL") // ADD THIS RULE
                .requestMatchers(HttpMethod.POST, "/api/orders/{orderId}/review").hasRole("CUSTOMER") // ADD THIS RULE

 .requestMatchers("/api/manage/orders/**").hasAnyRole("ADMIN", "RESTAURANT_OWNER", "DELIVERY_PERSONNEL", "CUSTOMER")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
