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

    private int id;

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

    @OneToMany(mappedBy = "practice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VocabAndKanji> vocabAndKanjis;

    public Practice(int practice_id, List<GrammarPractice> grammarPractice, List<ListeningPractice> listeningPractices, List<PracticeDetail> practiceDetails, int level_id, int topic_num, String skill, int id) {
        this.practice_id = practice_id;
        this.grammarPractice = grammarPractice;
        this.listeningPractices = listeningPractices;
        this.practiceDetails = practiceDetails;
        this.level_id = level_id;
        this.topic_num = topic_num;
        this.skill = skill;
        this.id = id;
    }

    public Practice() {}

    public int getPractice_id() {
        return practice_id;
    }

    public void setPractice_id(int practice_id) {
        this.practice_id = practice_id;
    }

    public List<GrammarPractice> getGrammarPractice() {
        return grammarPractice;
    }

    public void setGrammarPractice(List<GrammarPractice> grammarPractice) {
        this.grammarPractice = grammarPractice;
    }

    public List<ListeningPractice> getListeningPractices() {
        return listeningPractices;
    }

    public void setListeningPractices(List<ListeningPractice> listeningPractices) {
        this.listeningPractices = listeningPractices;
    }

    public List<PracticeDetail> getPracticeDetails() {
        return practiceDetails;
    }

    public void setPracticeDetails(List<PracticeDetail> practiceDetails) {
        this.practiceDetails = practiceDetails;
    }

    public int getLevel_id() {
        return level_id;
    }

    public void setLevel_id(int level_id) {
        this.level_id = level_id;
    }

    public int getTopic_num() {
        return topic_num;
    }

    public void setTopic_num(int topic_num) {
        this.topic_num = topic_num;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSkill() {
        return skill;
    }

    public List<VocabAndKanji> getVocabAndKanjis() {
        return vocabAndKanjis;
    }

    public void setVocabAndKanjis(List<VocabAndKanji> vocabAndKanjis) {
        this.vocabAndKanjis = vocabAndKanjis;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }
}
