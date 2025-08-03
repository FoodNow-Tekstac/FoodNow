package com.foodnow.service;

import com.foodnow.dto.DeliveryPersonnelSignUpRequest;
import com.foodnow.dto.LoginRequest;
import com.foodnow.dto.SignUpRequest;
import com.foodnow.model.DeliveryAgentStatus; // Import the status enum
import com.foodnow.model.Role;
import com.foodnow.model.User;
import com.foodnow.repository.UserRepository;
import com.foodnow.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider tokenProvider;

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
     * This is the updated method.
     * It now sets a default delivery status for new agents.
     */
    // Inside your AuthenticationService.java file

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
    
    // THIS IS THE FIX: Set the default status to ONLINE.
    user.setDeliveryStatus(DeliveryAgentStatus.ONLINE);
    
    return userRepository.save(user);
}
}
