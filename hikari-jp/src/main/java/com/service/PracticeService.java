package com.service;

import com.model.GrammarPractice;
import com.model.ListeningPractice;
import com.model.ReadingPractice;
import com.repository.PracticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PracticeService {
    @Autowired
    PracticeRepository practiceRepository;

    public ReadingPractice getReadingPracticeByTopicNUMAndLevel(int level_id, int topic_num, String subject_test){
        return practiceRepository.findByTopic_numAndLevel_id(level_id, topic_num, subject_test);
    }

    public List<ListeningPractice> getListeningPractices(int level_id, int topic_num, String subject_test){
        return practiceRepository.findListeningPractices(level_id, topic_num, subject_test);
    }

    public List<GrammarPractice> getGrammarPractices(int level_id, int topic_num, String subject_test){
        return practiceRepository.findGrammarPractices(level_id, topic_num, subject_test);
    }
}
