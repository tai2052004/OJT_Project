package com.controller;

import com.model.JLPTTestResult;
import com.model.Users;
import com.service.JLPTResultService;
import com.service.TestLevelService;
import com.service.TestService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Controller
public class JLPTResultController {

    @Autowired
    JLPTResultService jLPTResultService;

    @Autowired
    TestLevelService testLevelService;

    @GetMapping("/historyResult")
    public String history(Model model, HttpSession session)
    {
        Users user = (Users) session.getAttribute("user");
        List<JLPTTestResult> jlptResultList = jLPTResultService.findByJLPTResultByUserID(user.getId().intValue());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

        jlptResultList.sort((a, b) -> {
            LocalDateTime d1 = LocalDateTime.parse(a.getDate_taken(), formatter);
            LocalDateTime d2 = LocalDateTime.parse(b.getDate_taken(), formatter);
            return d2.compareTo(d1);
        });
        model.addAttribute("jlptResultList", jlptResultList);
        return "historyTest";
    }

    @PostMapping("/saveResult")
    public ResponseEntity<String> saveHistory(@RequestParam("topic") int topic, @RequestParam("level") int level, @RequestParam("score") String score,
            @RequestParam("status") String status, @RequestParam("progress") String progress, @RequestParam("date-taken") String date , HttpSession session)
    {
        Users user = (Users) session.getAttribute("user");
        JLPTTestResult jlptResult = new JLPTTestResult();

        jlptResult.setUser(user);
        jlptResult.setScore(score);
        jlptResult.setStatus(status);
        jlptResult.setProgress(progress);
        jlptResult.setDate_taken(date);
        jlptResult.setLevel_id(testLevelService.getTestLevelById(level));
        jlptResult.setTopic_num(topic);

        jLPTResultService.saveJLPTResult(jlptResult);

        return ResponseEntity.ok("Save successful");
    }
}
