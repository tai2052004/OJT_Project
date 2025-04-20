package com.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "JLPT_Test_Result")
public class JLPTTestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int result_id;

    @ManyToOne
    @JoinColumn(name = "id")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "level_id")
    private TestLevel level_id;

    private int topic_num;
    private String score;
    private String status;
    private String progress;
    private String date_taken;

    private String vocab_and_kanji_rate;
    private String grammar_rate;
    private String reading_rate;
    private String listening_rate;

    @Transient
    @OneToMany(mappedBy = "testResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAnswer> user_answers;

    @Transient
    private String user_answer_JSON;

    @Transient
    private String passage;

    public JLPTTestResult() {}
    // Getters and Setters


    public String getPassage() {
        return passage;
    }

    public void setPassage(String passage) {
        this.passage = passage;
    }

    public String getVocab_and_kanji_rate() {
        return vocab_and_kanji_rate;
    }

    public void setVocab_and_kanji_rate(String vocab_and_kanji_rate) {
        this.vocab_and_kanji_rate = vocab_and_kanji_rate;
    }

    public String getListening_rate() {
        return listening_rate;
    }

    public void setListening_rate(String listening_rate) {
        this.listening_rate = listening_rate;
    }

    public String getReading_rate() {
        return reading_rate;
    }

    public void setReading_rate(String reading_rate) {
        this.reading_rate = reading_rate;
    }

    public String getGrammar_rate() {
        return grammar_rate;
    }

    public void setGrammar_rate(String grammar_rate) {
        this.grammar_rate = grammar_rate;
    }

    public String getUser_answer_JSON() {
        return user_answer_JSON;
    }

    public void setUser_answer_JSON(String user_answer_JSON) {
        this.user_answer_JSON = user_answer_JSON;
    }

    public List<UserAnswer> getUser_answers() {
        return user_answers;
    }

    public void setUser_answers(List<UserAnswer> user_answers) {
        this.user_answers = user_answers;
    }

    public int getResult_id() {
        return result_id;
    }

    public void setResult_id(int result_id) {
        this.result_id = result_id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public TestLevel getLevel_id() {
        return level_id;
    }

    public void setLevel_id(TestLevel level_id) {
        this.level_id = level_id;
    }

    public int getTopic_num() {
        return topic_num;
    }

    public void setTopic_num(int topic_num) {
        this.topic_num = topic_num;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

    public String getDate_taken() {
        return date_taken;
    }

    public void setDate_taken(String date_taken) {
        this.date_taken = date_taken;
    }
}
