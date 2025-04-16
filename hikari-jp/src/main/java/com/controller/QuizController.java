package com.controller;

import com.model.PremiumPlan;
import com.model.UserPremium;
import com.model.Users;
import com.service.PremiumService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class QuizController {
//fix redundant code
    @GetMapping("/quizzInterface")
    public String quizInterface(@RequestParam(name = "level", required = false) String level, Model model) {
        model.addAttribute("level", level);
        return "quizzInterface";
    }
}
