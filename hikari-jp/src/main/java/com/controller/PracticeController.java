package com.controller;

import com.model.GrammarPractice;
import com.model.ListeningPractice;
import org.springframework.ui.Model;
import com.model.ReadingPractice;
import com.service.PracticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class PracticeController {
    @Autowired
    PracticeService practiceService;

    @GetMapping("/getPractice")
    public String getPractice(@RequestParam("level_id") int levelID, @RequestParam("topic_num") int topicNUM, @RequestParam("subject_test") String subjectTEST, Model model) {
        ReadingPractice rp = null;
        List<ListeningPractice> practiceList = null;
        List<GrammarPractice> grammarPracticeList = null;
        if(subjectTEST.equalsIgnoreCase("どっかい"))
        {
            subjectTEST = "Reading";
            rp = practiceService.getReadingPracticeByTopicNUMAndLevel(levelID,topicNUM,subjectTEST);
            model.addAttribute("readingPractices", rp);
        } else if (subjectTEST.equalsIgnoreCase("ちょうかい")) {
            subjectTEST = "Listening";
            practiceList = practiceService.getListeningPractices(levelID,topicNUM,subjectTEST);
            model.addAttribute("listeningPractices", practiceList);
        }
        else if (subjectTEST.equalsIgnoreCase("ぶんぽう"))
        {
            subjectTEST = "Grammar";
            grammarPracticeList = practiceService.getGrammarPractices(levelID,topicNUM,subjectTEST);
            model.addAttribute("grammarPractices", grammarPracticeList);
        }

        if (grammarPracticeList != null) {

            for(GrammarPractice lp : grammarPracticeList)
            {
                System.out.println(lp.getExplain());
            }
        } else {
            System.out.println("Không tìm thấy bài grammar!");
        }


        return "practice";
    }
}
