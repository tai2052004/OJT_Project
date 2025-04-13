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
        private String explain;

    public TestQuestion(int test_question_id, String explain, String correct_answer, String choice_d, String choice_c, String choice_b, String choice_a, String question_text) {
        this.test_question_id = test_question_id;
        this.explain = explain;
        this.correct_answer = correct_answer;
        this.choice_d = choice_d;
        this.choice_c = choice_c;
        this.choice_b = choice_b;
        this.choice_a = choice_a;
        this.question_text = question_text;
    }

    public TestQuestion() {}
    public int getTest_question_id() {
        return test_question_id;
    }

    public void setTest_question_id(int test_question_id) {
        this.test_question_id = test_question_id;
    }

    public String getCorrect_answer() {
        return correct_answer;
    }

    public void setCorrect_answer(String correct_answer) {
        this.correct_answer = correct_answer;
    }

    public String getExplain() {
        return explain;
    }

    public void setExplain(String explain) {
        this.explain = explain;
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

    public String getChoice_b() {
        return choice_b;
    }

    public void setChoice_b(String choice_b) {
        this.choice_b = choice_b;
    }

    public String getChoice_a() {
        return choice_a;
    }

    public void setChoice_a(String choice_a) {
        this.choice_a = choice_a;
    }

    public String getQuestion_text() {
        return question_text;
    }

    public void setQuestion_text(String question_text) {
        this.question_text = question_text;
    }
}
