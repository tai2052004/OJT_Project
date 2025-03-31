package com.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Test_question")
public class TestQuestion {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int test_question_id;

        private String question_text;
        private String choice_a;
        private String choice_b;
        private String choice_c;
        private String choice_d;
        private String correct_answer;

    public TestQuestion(int questionId, String correct_answer, String choice_d, String choice_b, String choice_a, String question_text, String choice_c) {
        this.test_question_id = questionId;
        this.correct_answer = correct_answer;
        this.choice_d = choice_d;
        this.choice_b = choice_b;
        this.choice_a = choice_a;
        this.question_text = question_text;
        this.choice_c = choice_c;
    }

    public TestQuestion() {}

    public int getQuestionId() {
        return test_question_id;
    }

    public void setQuestionId(int questionId) {
        this.test_question_id = questionId;
    }

    public String getCorrect_answer() {
        return correct_answer;
    }

    public void setCorrect_answer(String correct_answer) {
        this.correct_answer = correct_answer;
    }

    public String getChoice_d() {
        return choice_d;
    }

    public void setChoice_d(String choice_d) {
        this.choice_d = choice_d;
    }

    public String getChoice_c() {
        return choice_c;
    }

    public void setChoice_c(String choice_c) {
        this.choice_c = choice_c;
    }

    public String getChoice_a() {
        return choice_a;
    }

    public void setChoice_a(String choice_a) {
        this.choice_a = choice_a;
    }

    public String getChoice_b() {
        return choice_b;
    }

    public void setChoice_b(String choice_b) {
        this.choice_b = choice_b;
    }

    public String getQuestion_text() {
        return question_text;
    }

    public void setQuestion_text(String question_text) {
        this.question_text = question_text;
    }
}
