package com.foodnow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends a pre-formatted password reset email.
     * @param toEmail The recipient's email address.
     * @param resetLink The full password reset link to be included in the email.
     */
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Password Reset Request - FoodNow");
            message.setText("Dear User,\n\n" +
                    "You have requested to reset your password. Please click the link below to do so:\n\n" +
                    resetLink + "\n\n" +
                    "This link will expire in 1 hour.\n\n" +
                    "If you did not request this password reset, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "The FoodNow Team");
            message.setFrom("noreply@foodnow.com"); // Use a no-reply address
            
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", toEmail);
            
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}. Error: {}", toEmail, e.getMessage());
            // This re-throws the exception, which will be caught by the AuthController.
            // This ensures a 500 error isn't sent to the user, protecting system info.
            throw new RuntimeException("Failed to send password reset email.", e);
        }
    }
}