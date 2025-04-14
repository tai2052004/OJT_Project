package com.service;

import com.model.GrammarPractice;
import com.model.ListeningPractice;
import com.model.ReadingPractice;
import com.model.VocabAndKanji;
import com.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestService {

    @Autowired
    TestRepository repository;

    public ReadingPractice getReading(int level_id, int topic_num){
        return repository.findReading(level_id, topic_num);
    }

    public List<ListeningPractice> getListeningPractices(int level_id, int topic_num){
        return repository.findListening(level_id, topic_num);
    }

    public List<GrammarPractice> getGrammarPractices(int level_id, int topic_num){
        return repository.findGrammarPractices(level_id, topic_num);
    }

    public List<VocabAndKanji> getVocabAndKanji(int level_id, int topic_num){
        return repository.findVocabAndKanji(level_id, topic_num);
    }
}
