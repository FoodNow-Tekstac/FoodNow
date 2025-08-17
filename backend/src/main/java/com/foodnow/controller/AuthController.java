package com.foodnow.controller;

import com.foodnow.dto.ForgotPasswordRequest;
import com.foodnow.dto.JwtAuthenticationResponse;
import com.foodnow.dto.LoginRequest;
import com.foodnow.dto.ResetPasswordRequest;
import com.foodnow.dto.SignUpRequest;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.User;
import com.foodnow.service.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

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

    // --- THIS IS THE CORRECTED AND SECURE IMPLEMENTATION ---
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            // The service method is called. It will either complete successfully
            // or throw an exception if the user is not found or if email fails.
            authenticationService.generateAndSendPasswordResetLink(request.getEmail());
        } catch (ResourceNotFoundException e) {
            // This block is entered if the user is not found.
            // We catch the exception silently to prevent user enumeration.
            log.info("Password reset requested for non-existent email: {}", request.getEmail());
        } catch (Exception e) {
            // This catches other potential errors (like from the email service)
            // and still returns the generic message to protect system information.
            log.error("Error during password reset process for email [{}]: {}", request.getEmail(), e.getMessage());
        }

        // This message is ALWAYS returned, whether the user existed or not.
        // This is the correct security practice.
        return ResponseEntity.ok(Map.of("message", "If an account with that email exists, a password reset link has been sent."));
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