package com.model;

import jakarta.persistence.*;

@Entity
public class GrammarPractice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int grammar_id;
    private String explain;

    @OneToOne
    @JoinColumn(name = "test_question_id", nullable = false)
    private TestQuestion testQuestion;


    @ManyToOne
    @JoinColumn(name = "practice_id", nullable = false)
    private Practice practice;

    public GrammarPractice(int gramma_id, String explain, Practice practice, TestQuestion testQuestion) {
        this.grammar_id = gramma_id;
        this.explain = explain;
        this.practice = practice;
        this.testQuestion = testQuestion;
    }

    public GrammarPractice() {

    }


    public Practice getPractice() {
        return practice;
    }

    public void setPractice(Practice practice) {
        this.practice = practice;
    }

    public TestQuestion getTestQuestion() {
        return testQuestion;
    }

    public void setTestQuestion(TestQuestion testQuestion) {
        this.testQuestion = testQuestion;
    }

    public String getExplain() {
        return explain;
    }

    public int getGrammar_id() {
        return grammar_id;
    }

    public void setGrammar_id(int grammar_id) {
        this.grammar_id = grammar_id;
    }

    public void setExplain(String explain) {
        this.explain = explain;
    }
}
