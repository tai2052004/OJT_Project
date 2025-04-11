package com.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "premium_plan")
public class PremiumPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "id")
    private Long id;

    @Column (name = "name")
    private String name;

    @Column (name = "duration_in_days")
    private Integer durationInDays;

    @Column (name = "price")
    private Integer price;

    @Column (name = "description")
    private String description;

}