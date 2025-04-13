package com.repository;

import com.model.GrammarPractice;
import com.model.ListeningPractice;
import com.model.ReadingPractice;
import com.model.VocabAndKanji;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<ReadingPractice, Integer> {
    @Query("SELECT DISTINCT rp FROM ReadingPractice rp " +
            "WHERE rp.level_id = :levelID AND rp.topic_num = :topicNUM AND rp.skill = 'Reading'")
    ReadingPractice findReading(@Param("levelID") int levelID, @Param("topicNUM") int topicNUM);

    @Query("SELECT DISTINCT lp FROM ListeningPractice lp " +
            "JOIN lp.practice p " +
            "WHERE p.level_id = :levelID " +
            "AND p.topic_num = :topicNUM  AND p.skill = 'Listening'" )
    List<ListeningPractice> findListening(@Param("levelID") int levelID, @Param("topicNUM") int topicNUM);

    @Query("SELECT DISTINCT gp FROM GrammarPractice gp " +
            "JOIN gp.practice p " +
            "WHERE p.level_id = :levelID " +
            "AND p.topic_num = :topicNUM AND p.skill = 'Grammar'" )
    List<GrammarPractice> findGrammarPractices(@Param("levelID") int levelID, @Param("topicNUM") int topicNUM);

    @Query("SELECT DISTINCT vc FROM VocabAndKanji vc " +
            "JOIN vc.practice p " +
            "WHERE p.level_id = :levelID " +
            "AND p.topic_num = :topicNUM AND p.skill = 'Vocab'" )
    List<VocabAndKanji> findVocabAndKanji(@Param("levelID") int levelID, @Param("topicNUM") int topicNUM);
}
