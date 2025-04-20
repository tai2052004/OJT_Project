package com.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.*;
import com.service.*;
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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Controller
public class JLPTResultController {

    @Autowired
    JLPTResultService jLPTResultService;

    @Autowired
    TestLevelService testLevelService;

    @Autowired
    TestQuestionService testQuestionService;

    @Autowired
    UserAnswerService userAnswerService;

    @Autowired
    TestService testService;

    @GetMapping("/historyResult")
    public String history(Model model, HttpSession session) throws JsonProcessingException {
        Users user = (Users) session.getAttribute("user");
        List<JLPTTestResult> jlptResultList = jLPTResultService.findByJLPTResultByUserID(user.getId().intValue());
        System.out.println(jlptResultList.size());
        List<UserAnswer> userAnswers = new ArrayList<>();
        ReadingPractice rp = null;
        for (JLPTTestResult jlptResult : jlptResultList)
        {
            rp = testService.getReading(jlptResult.getLevel_id().getLevel_id(), jlptResult.getTopic_num());
            jlptResult.setPassage(rp.getPassage());
            userAnswers = jLPTResultService.findUserAnswerByResultID(jlptResult.getResult_id());
            System.out.println(userAnswers.size());
            ObjectMapper mapper = new ObjectMapper();
            String userAnswersJson = mapper.writeValueAsString(userAnswers);
            jlptResult.setUser_answer_JSON(userAnswersJson);
        }
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
            @RequestParam("status") String status, @RequestParam("progress") String progress, @RequestParam("date-taken") String date ,
            @RequestParam("vocab-rate") String vocabRate, @RequestParam("grammar-rate") String grammarRate,
            @RequestParam("reading-rate") String readingRate,
            @RequestParam("listening-rate") String listeningRate,
            @RequestParam("user-answer") String userAnswerDTO,HttpSession session) throws JsonProcessingException {
        Users user = (Users) session.getAttribute("user");
        JLPTTestResult jlptResult = new JLPTTestResult();

        jlptResult.setUser(user);
        jlptResult.setScore(score);
        jlptResult.setStatus(status);
        jlptResult.setProgress(progress);
        jlptResult.setDate_taken(date);
        jlptResult.setLevel_id(testLevelService.getTestLevelById(level));
        jlptResult.setTopic_num(topic);
        jlptResult.setVocab_and_kanji_rate(vocabRate);
        jlptResult.setGrammar_rate(grammarRate);
        jlptResult.setReading_rate(readingRate);
        jlptResult.setListening_rate(listeningRate);

        JLPTTestResult savedResult = jLPTResultService.saveJLPTResult(jlptResult);

        if (status.equalsIgnoreCase("Finished"))
        {
            ObjectMapper objectMapper = new ObjectMapper();
            List<UserAnswerDTO> answers = objectMapper.readValue(
                    userAnswerDTO,
                    new TypeReference<List<UserAnswerDTO>>() {}
            );

            // Bước 2: Xử lý logic (lưu vào database, tính toán...)
            for (UserAnswerDTO dto : answers) {
                UserAnswer userAnswer = new UserAnswer();
                userAnswer.setUser_answer(dto.getUserAnswer());
                userAnswer.setTestQuestion(testQuestionService.findById(dto.getTestQuestionId()));
                userAnswer.setTestResult(jLPTResultService.findById(savedResult.getResult_id()));
                // Lưu vào database (ví dụ)
                userAnswerService.saveUserAnswer(userAnswer);
            }
        }

        return ResponseEntity.ok("Save successful");
    }
}
