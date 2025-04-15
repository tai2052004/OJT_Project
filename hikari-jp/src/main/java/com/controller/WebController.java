package com.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String home(Model model) {
        return "landingPage";
    }

    @GetMapping("/Practice")
    public String practice() { return "practice"; }

    @GetMapping("/lookUp")
    public String lookUp(Model model) {
        model.addAttribute("currentPage", "lookup");
        return "lookUp"; }

    @PostMapping("/clearModel")
    public String clearModelVariable(Model model, HttpSession session) {
        model.addAttribute("readingPractices", null);
        session.removeAttribute("readingPractices");
        return "practice"; // Trả về trang hiện tại
    }
    @PostMapping("/clearListening")
    public String clearListening(Model model, HttpSession session) {
        model.addAttribute("listeningPractices", null);
        session.removeAttribute("listeningPractices");
        return "practice";
    }
    @GetMapping("/jlptTest")
    public String jlptTest() { return "welcomeJLPT"; }


    @GetMapping("/buyPremium")
    public String buyPremium(Model model) {
        model.addAttribute("currentPage", "buyPremium");
        return "premium"; }
    @GetMapping("/backToHome")
    public String backToHome() { return "landingPage"; }

    @GetMapping("/flashcards")
    public String flashcards() { return "flashcards"; }



    @GetMapping("/quiz")
    public String quiz() { return "quizz"; }

    @GetMapping("/testQuiz")
    public String testQuiz() { return "test_quiz"; }

    @GetMapping("/quizResult")
    public String quizResult() { return "Quizz_result"; }
}