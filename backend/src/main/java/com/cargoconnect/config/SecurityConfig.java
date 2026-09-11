package com.cargoconnect.config;

import com.cargoconnect.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/users/register", "/api/users/login").permitAll()
                .requestMatchers("/api/users/**").hasAnyAuthority("ADMIN", "DRIVER", "SHIPPER")
                .requestMatchers(HttpMethod.GET, "/api/drivers/**").hasAnyAuthority("ADMIN", "DRIVER", "SHIPPER")
                .requestMatchers(HttpMethod.POST, "/api/drivers/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/drivers/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/drivers/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/vehicles/**").hasAnyAuthority("ADMIN", "DRIVER", "SHIPPER")
                .requestMatchers(HttpMethod.POST, "/api/vehicles/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/vehicles/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/bookings/**").hasAnyAuthority("ADMIN", "DRIVER", "SHIPPER")
                .requestMatchers(HttpMethod.POST, "/api/bookings/**").hasAnyAuthority("ADMIN", "SHIPPER")
                .requestMatchers(HttpMethod.PUT, "/api/bookings/**").hasAnyAuthority("ADMIN", "DRIVER", "SHIPPER")
                .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").hasAnyAuthority("ADMIN", "SHIPPER")
                .requestMatchers("/api/payments/**").hasAnyAuthority("ADMIN", "SHIPPER")
                .requestMatchers("/api/tracking/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:5175"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
