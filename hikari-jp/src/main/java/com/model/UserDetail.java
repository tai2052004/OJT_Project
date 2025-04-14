package com.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "user_detail")
public class UserDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long Id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @Column(name = "avatar")
    private String avatar;

    @OneToOne
    @JoinColumn(name = "user_id") // FK trỏ tới bảng Users
    private Users user;

}
