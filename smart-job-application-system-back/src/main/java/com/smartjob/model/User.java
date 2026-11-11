package com.smartjob.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL
    )
    @JsonIgnore
    private CandidateProfile candidateProfile;
    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL
    )
    @JsonIgnore
    private RecruiterProfile recruiterProfile;


    // Constructeur vide obligatoire pour JPA
    public User() {
    }


    // ==============================
    // GETTERS
    // ==============================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public CandidateProfile getCandidateProfile() {
        return candidateProfile;
    }
    public RecruiterProfile getRecruiterProfile() {
        return recruiterProfile;
    }


    // ==============================
    // SETTERS
    // ==============================

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setCandidateProfile(CandidateProfile candidateProfile) {
        this.candidateProfile = candidateProfile;
    }
    public void setRecruiterProfile(RecruiterProfile recruiterProfile) {
        this.recruiterProfile = recruiterProfile;
    }
}