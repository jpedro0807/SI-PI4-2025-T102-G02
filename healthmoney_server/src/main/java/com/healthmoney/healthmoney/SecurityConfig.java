package com.healthmoney.healthmoney;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**", "/loginGoogle", "/api/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        // AQUI ESTÁ O SEGREDO:
                        // Mandamos ele voltar para o seu site React (porta 5173)
                        // O parâmetro 'true' força essa ida.
                        .defaultSuccessUrl("http://localhost:5173/agenda", true)
                );

        return http.build();
    }

    // Configuração detalhada do CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Libera a porta do React (Vite)
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Libera todos os métodos (GET, POST, PUT, DELETE)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Libera todos os cabeçalhos (Authorization, Content-Type, etc)
        configuration.setAllowedHeaders(List.of("*"));

        // Permite enviar Cookies (JSESSIONID) entre o Front e o Back
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}