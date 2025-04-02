package com.model;

import jakarta.persistence.*;

@Entity
public class ListeningPractice{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int listening_id;
    private String audio;
    private String image_link;

    @OneToOne
    @JoinColumn(name = "test_question_id", nullable = false)
    private TestQuestion testQuestion;


    @ManyToOne
    @JoinColumn(name = "practice_id", nullable = false)
    private Practice practice;

    public ListeningPractice(TestQuestion testQuestion, String image_link, String audio, int listening_id) {
        this.testQuestion = testQuestion;
        this.image_link = image_link;
        this.audio = audio;
        this.listening_id = listening_id;
    }

    public ListeningPractice() {}

    public int getListening_id() {
        return listening_id;
    }

    public void setListening_id(int listening_id) {
        this.listening_id = listening_id;
    }

    public TestQuestion getTestQuestion() {
        return testQuestion;
    }

    public void setTestQuestion(TestQuestion testQuestion) {
        this.testQuestion = testQuestion;
    }

    public String getImage_link() {
        return image_link;
    }

    public void setImage_link(String image_link) {
        this.image_link = image_link;
    }

    public String getAudio() {
        return audio;
    }

    public void setAudio(String audio) {
        this.audio = audio;
    }

    public Practice getPractice() {
        return practice;
    }

    public void setPractice(Practice practice) {
        this.practice = practice;
    }
}
