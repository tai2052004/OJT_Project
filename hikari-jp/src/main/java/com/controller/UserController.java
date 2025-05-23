package com.controller;
import com.model.UserDetail;
import com.model.Users;
import com.repository.UserDetailRepository;
import com.repository.UserRepository;
import com.service.EmailService;
import com.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.logging.Logger;

@Controller
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserDetailRepository userDetailRepository;

    private static final Logger LOGGER = Logger.getLogger(UserController.class.getName());

    //Login

    @GetMapping("/landingPage")
    public String landingPage(Model model, HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if (user != null) {
            UserDetail userDetail = userDetailRepository.findByUserId(user.getId());
            session.setAttribute("userDetail", userDetail);
        }
        model.addAttribute("currentPage","landing" );
        return "landingPage";
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login"; // Trả về trang đăng nhập
    }

    //Register
    @GetMapping("/register")
    public String showRegisterForm() {
        return "register"; // Trả về trang đăng ký
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute Users user, @RequestParam String rePassword, Model model, HttpSession session) {
        try {
            if (!user.getPassword().equals(rePassword)) {
                model.addAttribute("error", "Passwords do not match!");
                model.addAttribute("username", user.getUsername());
                model.addAttribute("email", user.getEmail());
                return "register";
            }

            // Kiểm tra username hoặc email đã tồn tại
            if (userRepository.findByUsername(user.getUsername()) != null) {
                model.addAttribute("error", "Username is already taken");
                return "register";
            }
            if (userRepository.findByEmail(user.getEmail()) != null) {
                model.addAttribute("error", "Email is already registered");
                return "register";
            }

            user.setPassword(user.getPassword());
            // Tạo OTP
            String otp = userService.generateOTP(user);
            user.setOtp(otp);
            user.setRole("USER");

            // Gửi OTP qua email
            emailService.sendOtpEmail(user.getEmail(), otp);

            // Lưu user vào session
            session.setAttribute("tempUser", user);

            return "redirect:/verify-otp-register?email=" + user.getEmail();
        } catch (DataIntegrityViolationException ex) {
            model.addAttribute("error", "An error occurred: " + ex.getMessage());
            return "register";
        }
    }

    @GetMapping("/verify-otp-register")
    public String showOtpVerificationFormRegister(@RequestParam String email, Model model, HttpSession session) {
        Users tempUser = (Users) session.getAttribute("tempUser");

        if (tempUser == null || !tempUser.getEmail().equals(email)) {
            model.addAttribute("error", "Invalid session or email mismatch.");
            return "register";
        }

        model.addAttribute("email", email);
        return "otp-verification-register";
    }
    @PostMapping("/verify-otp-register")
    public String verifyOTPRegister(@RequestParam String email,
                                    @RequestParam String otp,
                                    HttpSession session,
                                    Model model) {

        Users tempUser = (Users) session.getAttribute("tempUser");

        try {
            // Kiểm tra OTP hợp lệ
            boolean isValidOTP = userService.verifyOTP(session, email, otp);
            if (!isValidOTP) {
                model.addAttribute("error", "OTP invalid");
                model.addAttribute("email", email);
                return "otp-verification-register";
            }

            UserDetail userDetail = new UserDetail();
            userDetail.setFullName(null);
            userDetail.setPhoneNumber(null);
            userDetail.setAvatar(null);
            userDetail.setBirthdate(null);

            tempUser.setUserDetail(userDetail);

            userRepository.save(tempUser);

            // Xóa user tạm khỏi session
            session.removeAttribute("tempUser");

            return "otp-success";

        } catch (Exception ex) {
            ex.printStackTrace();
            model.addAttribute("error", "An error occurred. Please try again.");
            model.addAttribute("email", email);
            return "otp-verification-register";
        }
    }

    @GetMapping("/otp-success")
    public String otpSuccess(Model model) {
        return "otp-success";
    }

    //Forget password
    @GetMapping("/forget-password")
    public String forgetPassword(Model model) {
        return "forgetPassword";
    }

    @PostMapping("/forget-password")
    public String forgetPassword(@RequestParam String email, Model model, HttpSession session) {
        Users user = userRepository.findByEmail(email);

        if (user == null) {
            model.addAttribute("error", "User not found");
            model.addAttribute("email", email);
            return "forgetPassword";
        }

        String otp = userService.generateOTP(user);
        user.setOtp(otp);
        emailService.sendOtpEmail(user.getEmail(), otp);

        session.setAttribute("tempUser", user);
        return "redirect:/verify-otp-reset?email=" + user.getEmail();
    }


    @GetMapping("/verify-otp-reset")
    public String showOtpVerificationFormReset(@RequestParam String email, Model model, HttpSession session) {
        Users resetUser = (Users) session.getAttribute("tempUser");
        model.addAttribute("email", email);
        return "otp-verification-reset";
    }

    @PostMapping("/verify-otp-reset")
    public String verifyOTPReset(@RequestParam String email, @RequestParam String otp, HttpSession session, Model model) {
        Users resetUser = (Users) session.getAttribute("tempUser");
        // Kiểm tra OTP hợp lệ
        boolean isValidOTP = userService.verifyOTP(session, email, otp);
        if (!isValidOTP) {
            model.addAttribute("error", "Invalid OTP!");
            return "otp-verification-reset";
        }

        return "redirect:/reset-password?email=" + email;
    }

    @GetMapping("/reset-password")
    public String showResetPasswordForm(@RequestParam String email, Model model, HttpSession session) {
        Users resetUser = (Users) session.getAttribute("tempUser");
        model.addAttribute("email", email);
        return "resetPassword";
    }

    @PostMapping("/reset-password")
    public String processResetPassword(@RequestParam String newPassword, @RequestParam String rePassword, Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        Users resetUser = (Users) session.getAttribute("tempUser");
        if (!newPassword.equals(rePassword)) {
            model.addAttribute("error", "Passwords do not match!");
            return "resetPassword";
        }

        resetUser.setPassword(newPassword);
        userRepository.save(resetUser);
        session.removeAttribute("tempUser");

        redirectAttributes.addFlashAttribute("success", "Password reset successful! You can log in now");
        return "redirect:/landingPage";
    }

    //Logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate(); // Xóa toàn bộ session của user
        return "redirect:/landingPage"; // Chuyển hướng về trang đăng nhập
    }

}