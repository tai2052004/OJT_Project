package com.repository;

import com.model.ReadingPractice;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingPracticeRepository extends JpaRepository<ReadingPractice, Integer> {
    @Query("SELECT DISTINCT rp FROM ReadingPractice rp " +
            "WHERE rp.level_id = :levelID AND rp.topic_num = :topicNUM")
    ReadingPractice findByTopic_numAndLevel_id(@Param("levelID") int levelID, @Param("topicNUM") int topicNUM);
}
