package com.smartjob.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;



@Entity
@Table(name = "applications")
public class JobApplication {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ============================
    // Analyse IA
    // ============================

    @Column(nullable = true)
    private Integer scoreIa;


    @Column(length = 2000)
    private String aiFeedback;



    @ElementCollection
    @CollectionTable(
            name = "application_strengths",
            joinColumns = @JoinColumn(name = "application_id")
    )
    @Column(name = "strength")
    private List<String> strengths;



    @ElementCollection
    @CollectionTable(
            name = "application_missing_skills",
            joinColumns = @JoinColumn(name = "application_id")
    )
    @Column(name = "missing_skill")
    private List<String> missingSkills;



    // ============================
    // Candidat
    // ============================

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CandidateProfile candidate;



    // ============================
    // Offre
    // ============================

    @ManyToOne
    @JoinColumn(name = "job_offer_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private JobOffer jobOffer;



    // ============================
    // CV
    // ============================

    private String cvPath;



    // ============================
    // Status
    // ============================

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;



    private LocalDate applicationDate;



    // ============================
    // Constructeur vide
    // ============================

    public JobApplication() {

    }



    // ============================
    // Getters / Setters
    // ============================


    public Long getId() {
        return id;
    }



    public CandidateProfile getCandidate() {
        return candidate;
    }


    public void setCandidate(CandidateProfile candidate) {
        this.candidate = candidate;
    }



    public JobOffer getJobOffer() {
        return jobOffer;
    }


    public void setJobOffer(JobOffer jobOffer) {
        this.jobOffer = jobOffer;
    }



    public String getCvPath() {
        return cvPath;
    }


    public void setCvPath(String cvPath) {
        this.cvPath = cvPath;
    }



    public ApplicationStatus getStatus() {
        return status;
    }


    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }



    public Integer getScoreIa() {
        return scoreIa;
    }


    public void setScoreIa(Integer scoreIa) {
        this.scoreIa = scoreIa;
    }



    public String getAiFeedback() {
        return aiFeedback;
    }


    public void setAiFeedback(String aiFeedback) {
        this.aiFeedback = aiFeedback;
    }



    public List<String> getStrengths() {
        return strengths;
    }


    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }



    public List<String> getMissingSkills() {
        return missingSkills;
    }


    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }



    public LocalDate getApplicationDate() {
        return applicationDate;
    }


    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

}