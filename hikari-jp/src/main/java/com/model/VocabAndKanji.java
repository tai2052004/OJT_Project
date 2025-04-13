package com.model;

import jakarta.persistence.*;

@Entity
public class VocabAndKanji {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int vocab_id;

    @OneToOne
    @JoinColumn(name = "test_question_id", nullable = false)
    private TestQuestion testQuestion;


    @ManyToOne
    @JoinColumn(name = "practice_id", nullable = false)
    private Practice practice;

    public VocabAndKanji(Practice practice, TestQuestion testQuestion, int vocab_id) {
        this.practice = practice;
        this.testQuestion = testQuestion;
        this.vocab_id = vocab_id;
    }

    public VocabAndKanji() {}

    public int getVocab_id() {
        return vocab_id;
    }

    public void setVocab_id(int vocab_id) {
        this.vocab_id = vocab_id;
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
}
