package com.foodnow.controller;

import com.foodnow.dto.ForgotPasswordRequest;
import com.foodnow.dto.JwtAuthenticationResponse;
import com.foodnow.dto.LoginRequest;
import com.foodnow.dto.ResetPasswordRequest;
import com.foodnow.dto.SignUpRequest;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.User;
import com.foodnow.service.AuthenticationService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        String jwt = authenticationService.authenticateUser(loginRequest);
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        User result = authenticationService.registerUser(signUpRequest);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            // THIS IS THE CHANGE: The service now returns the link
            String resetLink = authenticationService.generatePasswordResetToken(request.getEmail());
            // Return the link in a JSON object
            return ResponseEntity.ok(Map.of("resetLink", resetLink));
        } catch (ResourceNotFoundException e) {
            // To prevent users from guessing emails, we still return a success-like message
            return ResponseEntity.ok(Map.of("message", "If an account with that email exists, a reset link has been generated."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authenticationService.resetPassword(request);
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}