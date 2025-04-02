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

    @OneToMany(mappedBy = "practice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListeningPractice> listeningPractices;

    @OneToMany(mappedBy = "practice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GrammarPractice> grammarPractice;

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

    public int getPractice_id() {
        return practice_id;
    }

    public void setPractice_id(int practice_id) {
        this.practice_id = practice_id;
    }

    public List<ListeningPractice> getListeningPractices() {
        return listeningPractices;
    }

    public void setListeningPractices(List<ListeningPractice> listeningPractices) {
        this.listeningPractices = listeningPractices;
    }

    public int getTopic_num() {
        return topic_num;
    }

    public List<GrammarPractice> getGrammaPractice() {
        return grammarPractice;
    }

    public void setGrammaPractice(List<GrammarPractice> grammarPractice) {
        this.grammarPractice = grammarPractice;
    }

    public void setTopic_num(int topic_num) {
        this.topic_num = topic_num;
    }

    public void setPracticeDetails(List<PracticeDetail> practiceDetails) {
        this.practiceDetails = practiceDetails;
    }
}
