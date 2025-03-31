package com.service;

import com.model.ReadingPractice;
import com.repository.ReadingPracticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReadingPracticeService{
    @Autowired
    ReadingPracticeRepository readingPracticeRepository;

    public ReadingPractice getReadingPracticeByTopicNUMAndLevel(int level_id, int topic_num){
        return readingPracticeRepository.findByTopic_numAndLevel_id(level_id, topic_num);
    }
}
