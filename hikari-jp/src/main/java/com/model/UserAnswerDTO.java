package com.model;

public class UserAnswerDTO {
    private String userAnswer;
    private int testQuestionId;

    // Constructor, getters, setters
    public UserAnswerDTO() {}

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    public int getTestQuestionId() { return testQuestionId; }
    public void setTestQuestionId(int testQuestionId) { this.testQuestionId = testQuestionId; }
}
