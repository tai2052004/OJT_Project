package com.repository;

import com.model.GrammarPractice;
import com.model.ListeningPractice;
import com.model.ReadingPractice;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface PracticeRepository extends JpaRepository<ReadingPractice, Integer> {
    @Query("SELECT DISTINCT rp FROM ReadingPractice rp " +
            "WHERE rp.level_id = :levelID AND rp.topic_num = :topicNUM AND rp.skill = :subjectTEST")
    ReadingPractice findByTopic_numAndLevel_id(@Param("levelID") int levelID, @Param("topicNUM") int topicNUM, @Param("subjectTEST") String subjectTEST);

    @Query("SELECT DISTINCT lp FROM ListeningPractice lp " +
            "JOIN lp.practice p " +
            "WHERE p.level_id = :levelID " +
            "AND p.topic_num = :topicNUM " +
            "AND p.skill = :subjectTEST")
    List<ListeningPractice> findListeningPractices(@Param("levelID") int levelID, @Param("topicNUM") int topicNUM, @Param("subjectTEST") String subjectTEST);

    @Query("SELECT DISTINCT gp FROM GrammarPractice gp " +
            "JOIN gp.practice p " +
            "WHERE p.level_id = :levelID " +
            "AND p.topic_num = :topicNUM " +
            "AND p.skill = :subjectTEST")
    List<GrammarPractice> findGrammarPractices(@Param("levelID") int levelID, @Param("topicNUM") int topicNUM, @Param("subjectTEST") String subjectTEST);
}
