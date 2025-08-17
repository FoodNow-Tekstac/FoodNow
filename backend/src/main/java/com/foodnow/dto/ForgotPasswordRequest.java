package com.foodnow.dto;

import jakarta.validation.constraints.Email;

public class ForgotPasswordRequest {
    
    @jakarta.validation.constraints.NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    // Constructors
    public ForgotPasswordRequest() {}

    public ForgotPasswordRequest(String email) {
        this.email = email;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}