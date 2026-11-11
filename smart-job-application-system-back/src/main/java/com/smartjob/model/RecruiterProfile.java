package com.smartjob.model;

import jakarta.persistence.*;

@Entity
@Table(name = "recruiter_profiles")
public class RecruiterProfile {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;




    // Relation avec User
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;


    private String companyName;

    private String companyEmail;

    private String phone;

    private String position;




    public Long getId() {
        return id;
    }


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }


    public String getCompanyName() {
        return companyName;
    }


    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }


    public String getCompanyEmail() {
        return companyEmail;
    }


    public void setCompanyEmail(String companyEmail) {
        this.companyEmail = companyEmail;
    }


    public String getPhone() {
        return phone;
    }


    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getPosition() {
        return position;
    }


    public void setPosition(String position) {
        this.position = position;
    }
}