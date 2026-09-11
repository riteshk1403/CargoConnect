package com.cargoconnect.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${cargoconnect.app.client-url:http://localhost:5173}")
    private String clientUrl;

    @Value("${spring.mail.username:kengarritesh3@gmail.com}")
    private String fromEmail;

    public void sendVerificationOtp(String toEmail, String username, String otp) {
        String subject = "Your CargoConnect Verification Code: " + otp;
        String messageBody = "Hello " + (username != null ? username : "User") + ",\n\n"
                + "Welcome to CargoConnect B2B Logistics!\n\n"
                + "Your 6-digit email verification OTP is:\n\n"
                + "       [ " + otp + " ]\n\n"
                + "This OTP is valid for 10 minutes. Please enter this code on the CargoConnect verification page to activate your account.\n\n"
                + "If you did not request this registration, please ignore this email.\n\n"
                + "Best regards,\n"
                + "CargoConnect Security & Operations Team";

        printDevBanner("EMAIL VERIFICATION OTP", toEmail, otp);

        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(messageBody);
                mailSender.send(message);
                logger.info("Verification OTP email successfully delivered via Gmail SMTP to {}", toEmail);
            }
        } catch (Exception e) {
            logger.warn("SMTP delivery error: {}. Check console banner above.", e.getMessage());
        }
    }

    public void sendPasswordResetOtp(String toEmail, String username, String otp) {
        String subject = "CargoConnect Password Reset Code: " + otp;
        String messageBody = "Hello " + (username != null ? username : "User") + ",\n\n"
                + "We received a request to reset the password for your CargoConnect account.\n\n"
                + "Your 6-digit password reset OTP is:\n\n"
                + "       [ " + otp + " ]\n\n"
                + "This OTP will expire in 10 minutes. For your security, never share this code with anyone.\n\n"
                + "If you did not request a password reset, please contact support immediately.\n\n"
                + "Best regards,\n"
                + "CargoConnect Security & Operations Team";

        printDevBanner("PASSWORD RESET OTP", toEmail, otp);

        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(messageBody);
                mailSender.send(message);
                logger.info("Password reset OTP email successfully delivered via Gmail SMTP to {}", toEmail);
            }
        } catch (Exception e) {
            logger.warn("SMTP host not reachable. In development mode, check console banner above.");
        }
    }

    public void sendNotificationEmail(String toEmail, String subject, String content) {
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
            }
        } catch (Exception e) {
            logger.info("Notification email to {}: {}", toEmail, subject);
        }
    }

    private void printDevBanner(String type, String email, String otp) {
        System.out.println("==================================================================");
        System.out.println(" [CARGOCONNECT DEV EMAIL SERVICE] " + type);
        System.out.println(" Recipient: " + email);
        System.out.println(" 6-Digit OTP: >>> " + otp + " <<< (Expires in 10 minutes)");
        System.out.println("==================================================================");
    }
}
