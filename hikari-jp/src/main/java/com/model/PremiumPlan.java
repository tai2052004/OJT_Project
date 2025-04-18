package com.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.engine.internal.Cascade;

import java.util.List;

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

    @Column (name = "duration_in_months")
    private Integer durationInMonths;

    @Column (name = "price")
    private Integer price;

    @Column (name = "description")
    private String description;


}