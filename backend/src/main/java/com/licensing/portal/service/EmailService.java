package com.licensing.portal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String text) {
        try {
            log.info("Sending email to: {}", to);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendEmailWithAttachments(String to, String subject, String text, MultipartFile[] files) {
        try {
            log.info("Sending email with attachments to: {}", to);
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            if (files != null) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        helper.addAttachment(file.getOriginalFilename(), file);
                    }
                }
            }

            emailSender.send(message);
            log.info("Email with attachments sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email with attachments to: {}", to, e);
            throw new RuntimeException("Failed to send email with attachments", e);
        }
    }
}
