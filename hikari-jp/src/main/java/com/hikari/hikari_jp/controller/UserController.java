package com.hikari.hikari_jp.controller;
import com.hikari.hikari_jp.entity.Users;
import com.hikari.hikari_jp.exception.OTPExpiredException;
import com.hikari.hikari_jp.repository.UserRepository;
import com.hikari.hikari_jp.service.EmailService;
import com.hikari.hikari_jp.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@Controller
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    private static final Logger LOGGER = Logger.getLogger(UserController.class.getName());

    //Login

    @GetMapping("/landingPage")
    public String landingPage(Model model) {
        return "landingPage";
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login"; // Trả về trang đăng nhập
    }

    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam String password,
                        Model model) {
        if (userService.checkLogin(email, password)) {
            return "redirect:/landingPage";
        } else {
            model.addAttribute("email", email);
            model.addAttribute("password", password);
            model.addAttribute("error", "Username or password is incorrect.");
            return "login";
        }
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

            // Tạo OTP
            String otp = userService.generateOTP(user);
            user.setOtp(otp);

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
            boolean isValidOTP = userService.verifyOTP(email, otp);
            if (!isValidOTP) {
                model.addAttribute("error", "OTP invalid");
                model.addAttribute("email", email);
                return "otp-verification-register";
            }

            // Lưu user vào database nếu OTP hợp lệ
            userRepository.save(tempUser);
            session.removeAttribute("tempUser");

            // Thêm thông báo thành công
            model.addAttribute("successMessage", "Đăng ký thành công! Bạn có thể đăng nhập ngay.");

            return "otp-verification-register";
        } catch (OTPExpiredException ex) {
            model.addAttribute("error", "OTP expired. Please request a new one.");
            model.addAttribute("email", email);

            // Reset OTP mới nếu OTP cũ hết hạn
            userService.generateOTP(tempUser);
            System.out.println("OTP mới: " + tempUser.getOtp());

            return "otp-verification-register";
        } catch (Exception ex) {
            model.addAttribute("error", "An error occurred. Please try again.");
            model.addAttribute("email", email);
            return "otp-verification-register";
        }
    }

    //Forget password
    @GetMapping("/forget-password")
    public String forgetPassword(Model model) {
        return "forgetPassword";
    }

//    @PostMapping("/resend-otp-register")
//    public String resendOTP(@RequestParam String email, HttpSession session, Model model) {
//        Users tempUser = (Users) session.getAttribute("tempUser");
//
//        if (tempUser == null || !tempUser.getEmail().equals(email)) {
//            model.addAttribute("error", "Invalid session or email mismatch.");
//            model.addAttribute("email", email);
//            return "otp-verification-register";
//        }
//
//        // Tạo mã OTP mới
//        String newOtp = userService.generateOTP();
//        tempUser.setOtp(newOtp);
//
//        // Cập nhật user trong session
//        session.setAttribute("tempUser", tempUser);
//
//        // Gửi lại OTP qua email
//        emailService.sendOtpEmail(email, newOtp);
//
//        model.addAttribute("success", "A new OTP has been sent to your email.");
//        model.addAttribute("email", email);
//        return "otp-verification-register";
//    }

//    @GetMapping("/login")
//    public String showLoginForm(Model model) {
//        model.addAttribute("loginRequest", new LoginRequest());
//        return "login"; // Trả về trang đăng nhập
//    }
//
//    @GetMapping("/forgot-password")
//    public String showForgotPasswordForm(Model model) {
//        model.addAttribute("forgotPasswordRequest", new ForgotPasswordRequest());
//        return "forgot-password"; // Trả về trang quên mật khẩu
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> loginUser (@ModelAttribute LoginRequest loginRequest) {
//        // Check if username and password are provided
//        if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
//            LOGGER.warning("Username or password is null");
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username and password are required");
//        }
//
//        // Attempt login
//        LOGGER.info("Attempting login with username: " + loginRequest.getUsername());
//        Users existingUser  = userRepository.findByUsername(loginRequest.getUsername());
//        if (existingUser  != null) {
//            LOGGER.info("User  found: " + existingUser .toString());
//            // Check if password matches
//            if (existingUser .getPassword().equals(loginRequest.getPassword())) {
//                LOGGER.info("Password match for user: " + existingUser .getUsername());
//                return ResponseEntity.ok(existingUser );
//            } else {
//                LOGGER.warning("Password mismatch for user: " + existingUser .getUsername());
//            }
//        } else {
//            LOGGER.warning("No user found with username: " + loginRequest.getUsername());
//        }
//
//        // Return unauthorized status if login fails
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
//    }
//
//
//    @PostMapping("/forgot-password")
//    public ResponseEntity<?> forgotPassword(@ModelAttribute ForgotPasswordRequest request) {
//        try {
//            userService.sendForgotPasswordEmail(request.getEmail()); // Gửi OTP cho quên mật khẩu
//            return ResponseEntity.ok("Password reset email sent successfully");
//        } catch (OTPExpiredException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User  not found");
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
//        }
//    }
//
//    @GetMapping("/verify-otp-forgot")
//    public String showOtpVerificationFormForgot(@RequestParam String email, Model model) {
//        model.addAttribute("email", email);
//        return "otp-verification"; // Trả về trang nhập OTP cho quên mật khẩu
//    }
//
//    @PostMapping("/verify-otp-forgot")
//    public ResponseEntity<?> verifyOTPForgot(@RequestParam String email, @RequestParam String otp) {
//        try {
//            userService.verifyOTP(email, otp); // Xác thực OTP cho quên mật khẩu
//            return ResponseEntity.ok("OTP verified successfully. You can now reset your password.");
//        } catch (OTPExpiredException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("OTP verification failed: " + ex.getMessage());
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
//        }
//    }
//
//    @PostMapping("/reset-password")
//    public ResponseEntity<?> resetPassword(@ModelAttribute ResetPasswordRequest request) {
//        try {
//            userService.resetPassword(request);
//            return ResponseEntity.ok("Password reset successfully");
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
//        }
//    }
}