package com.foodnow.foodnow.service;

import com.foodnow.dto.DeliveryPersonnelSignUpRequest;
import com.foodnow.dto.LoginRequest;
import com.foodnow.dto.ResetPasswordRequest;
import com.foodnow.dto.SignUpRequest;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.PasswordResetToken;
import com.foodnow.model.Role;
import com.foodnow.model.User;
import com.foodnow.model.DeliveryAgentStatus;
import com.foodnow.repository.PasswordResetTokenRepository;
import com.foodnow.repository.UserRepository;
import com.foodnow.security.JwtTokenProvider;
import com.foodnow.service.AuthenticationService;
import com.foodnow.service.EmailService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the AuthenticationService class.
 * This class uses Mockito to mock dependencies and test the service layer in isolation.
 */
@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    // Mocking all the dependencies required by AuthenticationService
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider tokenProvider;
    @Mock
    private PasswordResetTokenRepository tokenRepository;
    @Mock
    private EmailService emailService;

    // Injecting the mocks into the service instance
    @InjectMocks
    private AuthenticationService authenticationService;

    private User testUser;
    private final String frontendUrl = "http://localhost:3000";

    /**
     * Sets up common test data and configurations before each test.
     */
    @BeforeEach
    void setUp() {
        // Using ReflectionTestUtils to set the value of the @Value annotated field
        ReflectionTestUtils.setField(authenticationService, "frontendUrl", frontendUrl);

        // Creating a standard user for tests
        testUser = new User();
        // FIX: Changed from 1L (long) to 1 (int) to match the expected type.
        testUser.setId(1);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(Role.CUSTOMER);
    }

    @Test
    void generateAndSendPasswordResetLink_WhenUserExists_ShouldGenerateTokenAndSendEmail() {
        // Arrange: Mock the repository to find the user
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        doNothing().when(tokenRepository).deleteByUser(any(User.class));
        when(tokenRepository.save(any(PasswordResetToken.class))).thenReturn(new PasswordResetToken());
        doNothing().when(emailService).sendPasswordResetEmail(anyString(), anyString());

        // Act: Call the method to be tested
        authenticationService.generateAndSendPasswordResetLink(testUser.getEmail());

        // Assert: Verify that the expected methods were called
        verify(userRepository, times(1)).findByEmail(testUser.getEmail());
        verify(tokenRepository, times(1)).deleteByUser(testUser);
        verify(tokenRepository, times(1)).save(any(PasswordResetToken.class));
        verify(emailService, times(1)).sendPasswordResetEmail(eq(testUser.getEmail()), contains(frontendUrl + "/reset-password?token="));
    }

    @Test
    void generateAndSendPasswordResetLink_WhenUserNotFound_ShouldThrowResourceNotFoundException() {
        // Arrange: Mock the repository to return an empty optional
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act & Assert: Verify that the correct exception is thrown
        assertThrows(ResourceNotFoundException.class, () -> {
            authenticationService.generateAndSendPasswordResetLink("nonexistent@example.com");
        });

        // Verify that no token was created or email sent
        verify(tokenRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
    }

    @Test
    void resetPassword_WithValidToken_ShouldResetPassword() {
        // Arrange
        // FIX: Use setters instead of constructor
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("validToken");
        request.setNewPassword("newPassword123");

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(request.getToken());
        resetToken.setUser(testUser);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));

        when(tokenRepository.findByToken(request.getToken())).thenReturn(Optional.of(resetToken));
        when(passwordEncoder.encode(request.getNewPassword())).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        doNothing().when(tokenRepository).delete(any(PasswordResetToken.class));

        // Act
        authenticationService.resetPassword(request);

        // Assert
        verify(passwordEncoder, times(1)).encode("newPassword123");
        verify(userRepository, times(1)).save(testUser);
        assertEquals("newEncodedPassword", testUser.getPassword());
        verify(tokenRepository, times(1)).delete(resetToken);
    }

    @Test
    void resetPassword_WithInvalidToken_ShouldThrowResourceNotFoundException() {
        // Arrange
        // FIX: Use setters instead of constructor
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("invalidToken");
        request.setNewPassword("newPassword123");

        when(tokenRepository.findByToken(request.getToken())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> authenticationService.resetPassword(request));
    }

    @Test
    void resetPassword_WithExpiredToken_ShouldThrowIllegalStateException() {
        // Arrange
        // FIX: Use setters instead of constructor
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("expiredToken");
        request.setNewPassword("newPassword123");

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(request.getToken());
        resetToken.setUser(testUser);
        resetToken.setExpiryDate(LocalDateTime.now().minusHours(1)); // Expired token

        when(tokenRepository.findByToken(request.getToken())).thenReturn(Optional.of(resetToken));

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> authenticationService.resetPassword(request));
        verify(tokenRepository, times(1)).delete(resetToken); // Verify token is deleted even if expired
    }

    @Test
    void authenticateUser_WithValidCredentials_ShouldReturnJwtToken() {
        // Arrange
        // FIX: Use setters instead of constructor
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("dummy-jwt-token");

        // Act
        String token = authenticationService.authenticateUser(loginRequest);

        // Assert
        assertNotNull(token);
        assertEquals("dummy-jwt-token", token);
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenProvider, times(1)).generateToken(authentication);
    }

    @Test
    void registerUser_WithNewEmail_ShouldCreateAndReturnUser() {
        // Arrange
        // FIX: Use setters instead of constructor
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setName("New User");
        signUpRequest.setEmail("new@example.com");
        signUpRequest.setPhoneNumber("1234567890");
        signUpRequest.setPassword("password123");

        when(userRepository.existsByEmail(signUpRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(signUpRequest.getPassword())).thenReturn("encodedPassword");
        // We need to capture the user object passed to save() to return it
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User registeredUser = authenticationService.registerUser(signUpRequest);

        // Assert
        assertNotNull(registeredUser);
        assertEquals(signUpRequest.getName(), registeredUser.getName());
        assertEquals(signUpRequest.getEmail(), registeredUser.getEmail());
        assertEquals(Role.CUSTOMER, registeredUser.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUser_WithExistingEmail_ShouldThrowIllegalStateException() {
        // Arrange
        // FIX: Use setters instead of constructor
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setName("Existing User");
        signUpRequest.setEmail("test@example.com");
        signUpRequest.setPhoneNumber("1234567890");
        signUpRequest.setPassword("password123");

        when(userRepository.existsByEmail(signUpRequest.getEmail())).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> authenticationService.registerUser(signUpRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerDeliveryPersonnel_WithNewEmail_ShouldCreateAndReturnDeliveryUser() {
        // Arrange
        // FIX: Use setters instead of constructor
        DeliveryPersonnelSignUpRequest signUpRequest = new DeliveryPersonnelSignUpRequest();
        signUpRequest.setName("Delivery Joe");
        signUpRequest.setEmail("delivery@example.com");
        signUpRequest.setPhoneNumber("0987654321");
        signUpRequest.setPassword("password123");

        when(userRepository.existsByEmail(signUpRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(signUpRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User registeredUser = authenticationService.registerDeliveryPersonnel(signUpRequest);

        // Assert
        assertNotNull(registeredUser);
        assertEquals(signUpRequest.getName(), registeredUser.getName());
        assertEquals(signUpRequest.getEmail(), registeredUser.getEmail());
        assertEquals(Role.DELIVERY_PERSONNEL, registeredUser.getRole());
        assertEquals(DeliveryAgentStatus.ONLINE, registeredUser.getDeliveryStatus());
        verify(userRepository, times(1)).save(any(User.class));
    }
}
