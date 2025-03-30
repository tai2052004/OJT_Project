package com.hikari.hikari_jp.service;

import com.hikari.hikari_jp.entity.Users;
import com.hikari.hikari_jp.exception.OTPExpiredException;
import com.hikari.hikari_jp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public void sendForgotPasswordEmail(String email) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new OTPExpiredException("User with email " + email + " not found");
        }

        String otp = generateOTP(user);
        user.setOtp(otp);
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    public String generateOTP(Users user) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000)); // OTP 6 số
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5)); // OTP có hạn 5 phút
        userRepository.save(user);

        System.out.println("Generated OTP: " + otp + " (Expires at: " + user.getOtpExpiry() + ")");
        return otp;
    }

    public boolean verifyOTP(String email, String inputOtp) {
        Users user = userRepository.findByEmail(email);

        if (user == null || user.getOtp() == null) return false;

        if (!user.getOtp().equals(inputOtp)) {
            return false;
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new OTPExpiredException("OTP expired");
        }

        return true;
    }
//    public void resetPassword(ResetPasswordRequest request) {
//        Users user = userRepository.findByEmail(request.getEmail());
//        if (user == null) {
//            throw new OTPExpiredException("User with email " + request.getEmail() + " not found");
//        }
//
//        // Update user's password
//        user.setPassword(request.getNewPassword());
//        userRepository.save(user);
//    }

    public boolean checkLogin(String email, String password) {
        Users user = userRepository.findByEmail(email);
        return user != null && user.getPassword().equals(password);
    }

}
