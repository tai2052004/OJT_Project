package com.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "Practice")
public class Practice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int practice_id;

    private int user_id;

    private String skill; // Reading, Listening, Grammar

    private int topic_num; // Đề số mấy

    private int level_id;

    @OneToMany(mappedBy = "practice", cascade = CascadeType.ALL)
    private List<PracticeDetail> practiceDetails;
    // Getters và Setters

    public Practice(int practiceId, int level_id, int topicNum, String skill, int user_id) {
        this.practice_id = practiceId;
        this.level_id = level_id;
        this.topic_num = topicNum;
        this.skill = skill;
        this.user_id = user_id;
    }
    public Practice() {}

    public int getPracticeId() {
        return practice_id;
    }

    public void setPracticeId(int practiceId) {
        this.practice_id = practiceId;
    }

    public int getLevel_id() {
        return level_id;
    }

    public void setLevel_id(int level_id) {
        this.level_id = level_id;
    }

    public int getTopicNum() {
        return topic_num;
    }

    public void setTopicNum(int topicNum) {
        this.topic_num = topicNum;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public List<PracticeDetail> getPracticeDetails() {
        return practiceDetails;
    }

    public void setPracticeDetails(List<PracticeDetail> practiceDetails) {
        this.practiceDetails = practiceDetails;
    }
}
