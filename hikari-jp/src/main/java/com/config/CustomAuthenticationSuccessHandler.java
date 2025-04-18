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

        if (principal instanceof CustomOAuth2User) {
            // OAuth2 login (CustomOAuth2User)
            CustomOAuth2User oauthUser = (CustomOAuth2User) principal;
            if (oauthUser == null) {
                System.out.println("oauthUser is null");
            } else {
                System.out.println("oauthUser is not null, user details: " + oauthUser.getName());
            }

            Users user = oauthUser.getUser();
            if (user == null) {
                System.out.println("user is null");
            } else {
                System.out.println("user is not null, user id: " + user.getId());
            }

//            Users user = oauthUser.getUser();
            UserDetail userDetail = userDetailRepository.findByUserId(user.getId());

            session.setAttribute("user", user);
            session.setAttribute("userDetail", userDetail);

            response.sendRedirect("ADMIN".equalsIgnoreCase(user.getRole())
                    ? "/admin/userManagement"
                    : "/landingPage");

        } else if (principal instanceof org.springframework.security.core.userdetails.User userPrincipal) {
            // Form login - tìm user qua email
            String email = userPrincipal.getUsername();  // Nếu sử dụng email làm username
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

        } else if (principal instanceof org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser oidcUser) {
            // OAuth2 login (Google login with DefaultOidcUser)
            String email = oidcUser.getAttribute("email");
            String name = oidcUser.getAttribute("name");
            String googleId = oidcUser.getAttribute("sub");

            // Kiểm tra user theo email
            Users user = userRepository.findByEmail(email);

            if (user == null) {
                // Trường hợp user hoàn toàn mới (chưa tồn tại trong hệ thống)
                user = new Users();
                user.setEmail(email);
                user.setUsername(generateUsernameFromEmail(email));
                user.setPassword(""); // Google login không cần password
                user.setGoogleId(googleId);
                user.setRole("USER");

                UserDetail detail = new UserDetail();
                detail.setFullName(name);
                detail.setPhoneNumber(null);
                detail.setBirthdate(null);
                detail.setAvatar(null);

                user.setUserDetail(detail);
                userRepository.save(user);
            } else if (user.getGoogleId() == null || user.getGoogleId().isEmpty()) {
                // Nếu người dùng đã tồn tại nhưng chưa có Google ID, bổ sung Google ID
                user.setGoogleId(googleId);
                if (user.getUserDetail() == null) {
                    UserDetail detail = new UserDetail();
                    detail.setFullName(name);
                    user.setUserDetail(detail);
                } else if (user.getUserDetail().getFullName() == null) {
                    user.getUserDetail().setFullName(name);
                }

                userRepository.save(user);
            }

            // Lưu người dùng vào session
            session.setAttribute("user", user);

            // Redirect đến trang phù hợp
            response.sendRedirect("ADMIN".equalsIgnoreCase(user.getRole())
                    ? "/admin/userManagement"
                    : "/landingPage");

        } else {
            // fallback (nếu có trường hợp nào khác)
            response.sendRedirect("/login");
        }
    }

    private String generateUsernameFromEmail(String email) {
        String baseUsername = email.split("@")[0];
        String username = baseUsername;
        int i = 1;

        // Kiểm tra xem tên người dùng có trùng không, nếu có thì thêm số
        while (userRepository.findByUsername(username) != null) {
            username = baseUsername + i;
            i++;
        }

        return username;
    }

}