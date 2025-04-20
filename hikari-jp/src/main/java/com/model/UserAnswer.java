package com.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Test_User_Answer")
public class UserAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "test_result_id", nullable = false)
    private JLPTTestResult testResult;

    @OneToOne
    @JoinColumn(name = "test_question_id", nullable = false)
    private TestQuestion testQuestion;


    private String user_answer;

    public UserAnswer(String userAnswer, TestQuestion testQuestion, JLPTTestResult testResult, int id) {
        this.user_answer = userAnswer;
        this.testQuestion = testQuestion;
        this.testResult = testResult;
        this.id = id;
    }

    public UserAnswer() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUser_answer() {
        return user_answer;
    }

    public void setUser_answer(String user_answer) {
        this.user_answer = user_answer;
    }

    public TestQuestion getTestQuestion() {
        return testQuestion;
    }

    public void setTestQuestion(TestQuestion testQuestion) {
        this.testQuestion = testQuestion;
    }

    public JLPTTestResult getTestResult() {
        return testResult;
    }

    public void setTestResult(JLPTTestResult testResult) {
        this.testResult = testResult;
    }
}
