package com.model;

import jakarta.persistence.*;
import java.time.LocalDate;

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

    public JLPTTestResult() {}
    // Getters and Setters

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
