package com.foodnow.service;

import com.foodnow.dto.*;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.*;
import com.foodnow.repository.PasswordResetTokenRepository;
import com.foodnow.repository.UserRepository;
import com.foodnow.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthenticationService {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider tokenProvider;
    @Autowired private PasswordResetTokenRepository tokenRepository;
    @Autowired private EmailService emailService;
    
    // Inject the frontend URL from your application.properties
    @Value("${app.frontend.url}")
    private String frontendUrl;

    /**
     * Generates a password reset token and sends it via email.
     * Throws ResourceNotFoundException if the email does not exist.
     */
    @Transactional
    public void generateAndSendPasswordResetLink(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        tokenRepository.deleteByUser(user); // Delete any old tokens

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenRepository.save(resetToken);

        // Construct the full link here
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        // Delegate the sending of the fully-formed link to the EmailService
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    }
    
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid password reset token."));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new IllegalStateException("Password reset token has expired.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        tokenRepository.delete(resetToken);
    }
    
    // Other methods (authenticateUser, registerUser, etc.) remain the same


    /**
     * Authenticates a user and returns a JWT token.
     */
    public String authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return tokenProvider.generateToken(authentication);
    }

    /**
     * Registers a new customer.
     */
    public User registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new IllegalStateException("Email Address already in use!");
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(Role.CUSTOMER);

        return userRepository.save(user);
    }

    /**
     * Registers a new delivery personnel.
     */
    public User registerDeliveryPersonnel(DeliveryPersonnelSignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new IllegalStateException("Email Address already in use!");
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(Role.DELIVERY_PERSONNEL);
        user.setDeliveryStatus(DeliveryAgentStatus.ONLINE);

        return userRepository.save(user);
    }
}
