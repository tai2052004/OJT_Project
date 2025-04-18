package com.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Test_level")
public class TestLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int level_id;

    private String level_name;

    // Getters and Setters

    public int getLevel_id() {
        return level_id;
    }

    public void setLevel_id(int level_id) {
        this.level_id = level_id;
    }

    public String getLevel_name() {
        return level_name;
    }

    public void setLevel_name(String level_name) {
        this.level_name = level_name;
    }
}

