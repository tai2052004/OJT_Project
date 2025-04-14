package com.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🔑 Mã OTP của bạn");
            helper.setText(getEmailContent(otp), true); // Gửi email dạng HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    private String getEmailContent(String otp) {
        return """
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
                <div style="max-width: 500px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #4CAF50;">🔐 Mã OTP của bạn</h2>
                    <p style="font-size: 18px;">Vui lòng sử dụng mã OTP dưới đây để xác thực tài khoản:</p>
                    <div style="font-size: 22px; font-weight: bold; color: #333; background: #f9f9f9; padding: 10px; display: inline-block; border-radius: 5px;">
                        %s
                    </div>
                    <p style="color: red; font-size: 14px;">Mã OTP có hiệu lực trong 5 phút.</p>
                    <p style="font-size: 14px; color: #666;">Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.</p>
                    <hr style="margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                </div>
            </div>
        """.formatted(otp);
    }
}