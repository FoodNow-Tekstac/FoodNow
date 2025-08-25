package com.foodnow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    private static final String FROM_EMAIL = "noreply@foodnow.com";

    // Common HTML email template wrapper
    private String buildEmailTemplate(String subject, String bodyContent) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; " +
                "box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #000000;}" +
                ".header { background: #2563eb; padding: 20px; text-align: center; color: #fff; font-size: 20px; font-weight: bold; }" +
                ".content { padding: 30px; font-size: 16px; line-height: 1.6; color: #333; }" +
                ".button { display: inline-block; padding: 14px 28px; margin: 20px 0; background: #2563eb; " +
                "color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: bold; }" +
                ".button:hover { background: #1e4ed8; }" +
                ".footer { background: #f4f6f8; padding: 15px; text-align: center; font-size: 12px; color: #888; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" + subject + "</div>" +
                "<div class='content'>" + bodyContent + "</div>" +
                "<div class='footer'>" +
                "<p>&copy; " + java.time.Year.now() + " FoodNow. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body></html>";
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom(FROM_EMAIL);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to {}. Error: {}", to, e.getMessage());
            throw new RuntimeException("Email sending failed.", e);
        }
    }

    // ---- PROFESSIONAL EMAIL METHODS ----

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        String subject = "Password Reset Request - FoodNow";
        String body = "<p>Dear User,</p>" +
                "<p>You have requested to reset your password. Please click the button below to reset it:</p>" +
                "<p><a class='button' href='" + resetLink + "'>Reset Password</a></p>" +
                "<p>This link will expire in <b>1 hour</b>.</p>" +
                "<p>If you did not request this password reset, please ignore this email.</p>" +
                "<p>Best regards,<br>The FoodNow Team</p>";

        sendHtmlEmail(toEmail, subject, buildEmailTemplate(subject, body));
    }

    public void sendApplicationConfirmationEmail(String toEmail, String applicantName, String restaurantName) {
        String subject = "Your FoodNow Restaurant Application has been Received!";
        String body = "<p>Dear " + applicantName + ",</p>" +
                "<p>Thank you for your interest in partnering with <b>FoodNow</b>.</p>" +
                "<p>We have successfully received your application for <b>" + restaurantName + "</b>. " +
                "Our team will review your submission and get back to you within <b>5–7 business days</b>.</p>" +
                "<p>We appreciate your patience and look forward to working with you.</p>" +
                "<p>Best regards,<br>The FoodNow Team</p>";

        sendHtmlEmail(toEmail, subject, buildEmailTemplate(subject, body));
    }

    public void sendApplicationApprovalEmail(String toEmail, String ownerName, String restaurantName) {
        String subject = "Congratulations! Your FoodNow Application is Approved!";
        String body = "<p>Dear " + ownerName + ",</p>" +
                "<p>We are thrilled to inform you that your application for <b>" + restaurantName + "</b> has been approved!</p>" +
                "<p>Welcome to the <b>FoodNow Family</b> 🎉</p>" +
                "<p>You can now log in to your account to manage your restaurant, add menu items, and start accepting orders.</p>" +
                "<p>We look forward to a successful partnership.</p>" +
                "<p>Best regards,<br>The FoodNow Team</p>";

        sendHtmlEmail(toEmail, subject, buildEmailTemplate(subject, body));
    }

    public void sendApplicationRejectionEmail(String toEmail, String applicantName, String restaurantName, String reason) {
        String subject = "Update on Your FoodNow Application";
        String body = "<p>Dear " + applicantName + ",</p>" +
                "<p>Thank you for submitting your restaurant application for <b>" + restaurantName + "</b>.</p>" +
                "<p>After careful review, we regret to inform you that we are unable to proceed with your application at this time.</p>" +
                "<p><b>Reason for rejection:</b> " + reason + "</p>" +
                "<p>We encourage you to address the feedback and reapply in the future.</p>" +
                "<p>We truly appreciate your interest in FoodNow.</p>" +
                "<p>Best regards,<br>The FoodNow Team</p>";

        sendHtmlEmail(toEmail, subject, buildEmailTemplate(subject, body));
    }
}
