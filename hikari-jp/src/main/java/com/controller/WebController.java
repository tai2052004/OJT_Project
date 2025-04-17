package com.controller;

import com.model.UserPremium;
import com.model.Users;
import com.repository.UserPremiumRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class WebController {
    @Autowired
    private UserPremiumRepository userPremiumRepository;

    @GetMapping("/")
    public String home(Model model) {
        return "landingPage";
    }

    @GetMapping("/Practice")
    public String practice() { return "Practice"; }

    @GetMapping("/lookUp")
    public String lookUp(Model model) {
        model.addAttribute("currentPage", "lookup");
        return "lookUp"; }

    @PostMapping("/clearModel")
    public String clearModelVariable(Model model, HttpSession session) {
        model.addAttribute("readingPractices", null);
        session.removeAttribute("readingPractices");
        return "Practice"; // Trả về trang hiện tại
    }
    @PostMapping("/clearListening")
    public String clearListening(Model model, HttpSession session) {
        model.addAttribute("listeningPractices", null);
        session.removeAttribute("listeningPractices");
        return "Practice";
    }

    @GetMapping("/saleStatistic")
    public String saleStatistic() {
        return "saleStatistic";
    }



    @GetMapping("/buyPremium")
    public String buyPremium(Model model) {
        model.addAttribute("currentPage", "buyPremium");
        return "premium"; }
    @GetMapping("/backToHome")
    public String backToHome() { return "landingPage"; }

    @GetMapping("/flashcards")
    public String flashcards(Model model, HttpSession session) {
        Users user = (Users) session.getAttribute("user");
        if(user == null) {
            model.addAttribute("alertMessage", "Please sign in before taking the exam");
            return "landingPage";
        }
        UserPremium userPremium = userPremiumRepository.findByUserId(user.getId());
        model.addAttribute("userPremium", userPremium);
        return "flashcards"; }



    @GetMapping("/quiz")
    public String quiz() { return "Quizz"; }

    @GetMapping("/testQuiz")
    public String testQuiz() { return "test_quiz"; }

    @GetMapping("/quizResult")
    public String quizResult() { return "Quizz_result"; }
}