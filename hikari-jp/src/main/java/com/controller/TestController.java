package com.controller;

import com.model.GrammarPractice;
import com.model.ListeningPractice;
import com.model.ReadingPractice;
import com.model.VocabAndKanji;
import com.service.PracticeService;
import com.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class TestController {
    @Autowired
    TestService testService;

    @GetMapping("/test")
    public String test(@RequestParam("level_id") int levelID, @RequestParam("topic_num") int topicNUM, Model model) {
        ReadingPractice rp = null;
        List<ListeningPractice> practiceList = null;
        List<GrammarPractice> grammarPracticeList = null;
        List<VocabAndKanji> vocabList = null;
        System.out.println(levelID + " : " + topicNUM);
        rp = testService.getReading(levelID,topicNUM);
        model.addAttribute("readingTest", rp);

        practiceList = testService.getListeningPractices(levelID,topicNUM);
        model.addAttribute("listeningTest", practiceList);

        grammarPracticeList = testService.getGrammarPractices(levelID,topicNUM);
        model.addAttribute("grammarTest", grammarPracticeList);

        vocabList = testService.getVocabAndKanji(levelID,topicNUM);
        model.addAttribute("vocabList", vocabList);

        System.out.println(vocabList.size());
        System.out.println(grammarPracticeList.size());
        System.out.println(practiceList.size());
        System.out.println(rp.getPassage());

        return "testJLPT";
    }
}
