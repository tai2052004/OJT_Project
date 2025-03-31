package com.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class ReadingPractice extends Practice{

    private int reading_id;
    private int level_id;
    private String passage;



    public ReadingPractice(int reading_id, String passage, int level_id) {
        super();
        this.reading_id = reading_id;
        this.passage = passage;
        this.level_id = level_id;
    }

    public ReadingPractice() {

    }
    public int getReading_id() {
        return reading_id;
    }

    public void setReading_id(int reading_id) {
        this.reading_id = reading_id;
    }

    public String getPassage() {
        return passage;
    }

    public void setPassage(String passage) {
        this.passage = passage;
    }



    public int getLevel_id() {
        return level_id;
    }

    public void setLevel_id(int level_id) {
        this.level_id = level_id;
    }

// Getters and Setters
}
