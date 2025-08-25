package com.foodnow.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    // Inject the upload directory path from application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*") // This should allow all headers including cache-control
                        .exposedHeaders("Cache-Control", "Pragma", "Expires") // Expose these headers to frontend
                        .allowCredentials(false);
            }

            // THIS IS THE NEW PART: It tells Spring Boot to serve the uploaded files
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // This maps the URL path /uploads/** to the physical directory on your server
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:" + uploadDir + "/");
            }
        };
    }
}