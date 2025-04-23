package com.service;

import com.model.CustomOAuth2User;
import com.model.UserDetail;
import com.model.Users;
import com.repository.UserDetailRepository;
import com.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HttpSession session;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Lấy thông tin người dùng từ OAuth2 (Google login)
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Kiểm tra người dùng theo email
        Users user = userRepository.findByEmail(email);

        if (user == null) {
            // Trường hợp người dùng mới (chưa có trong hệ thống)
            user = new Users();
            user.setEmail(email);
            user.setUsername(generateUsernameFromEmail(email)); // Tạo username từ email
            user.setPassword(""); // Login qua Google không cần password
            user.setRole("user");

            // Tạo thông tin chi tiết người dùng
            UserDetail detail = new UserDetail();
            detail.setFullName(name);
            detail.setPhoneNumber(null);
            detail.setBirthdate(null);
            detail.setAvatar(null);

            user.setUserDetail(detail);
            userRepository.save(user);
        } else if (user.getUserDetail() == null || user.getUserDetail().getFullName() == null) {
            // Cập nhật thông tin người dùng nếu cần
            if (user.getUserDetail() == null) {
                UserDetail detail = new UserDetail();
                detail.setFullName(name);
                user.setUserDetail(detail);
            } else if (user.getUserDetail().getFullName() == null) {
                user.getUserDetail().setFullName(name);
            }
            userRepository.save(user);
        }

        // Trả về đối tượng CustomOAuth2User
        return new CustomOAuth2User(oAuth2User, user);
    }


    private String generateUsernameFromEmail(String email) {
        String baseUsername = email.split("@")[0];
        String username = baseUsername;
        int i = 1;

        while (userRepository.findByUsername(username) != null) {
            username = baseUsername + i;
            i++;
        }

        return username;
    }
}