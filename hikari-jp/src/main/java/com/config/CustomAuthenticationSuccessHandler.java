package com.config;

import com.model.CustomOAuth2User;
import com.model.UserDetail;
import com.model.Users;
import com.repository.UserDetailRepository;
import com.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        HttpSession session = request.getSession();

        Object principal = authentication.getPrincipal();
        System.out.println("Principal Class: " + principal.getClass().getName());

        if (principal instanceof CustomOAuth2User oauthUser) {
            // OAuth2
            Users user = oauthUser.getUser();
            UserDetail userDetail = userDetailRepository.findByUserId(user.getId());

            session.setAttribute("user", user);
            session.setAttribute("userDetail", userDetail);

            response.sendRedirect("ADMIN".equalsIgnoreCase(user.getRole())
                    ? "/admin/userManagement"
                    : "/landingPage");

        } else if (principal instanceof org.springframework.security.core.userdetails.User userPrincipal) {
            // Form login - tìm user qua email
            String email = userPrincipal.getUsername();  // Sử dụng email làm username
            Users user = userRepository.findByEmail(email);  // Tìm user qua email
            if (user == null) {
                response.sendRedirect("/login");
                return;
            }

            UserDetail userDetail = userDetailRepository.findByUserId(user.getId());

            session.setAttribute("user", user);
            session.setAttribute("userDetail", userDetail);

            response.sendRedirect("ADMIN".equalsIgnoreCase(user.getRole())
                    ? "/admin/userManagement"
                    : "/landingPage");
        } else {
            response.sendRedirect("/landingPage");
        }
    }

}