package com.smartjob.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;



@Entity
@Table(name = "job_offers")
public class JobOffer {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    // Relation avec RecruiterProfile

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private RecruiterProfile recruiter;



    private String title;


    @Column(length = 2000)
    private String description;


    private String location;


    private String contractType;


    private String requiredSkills;


    private LocalDate createdDate;


    private String status;




    // =====================================
    // Relation avec JobApplication
    // =====================================

    // Une offre peut avoir plusieurs candidatures

    @OneToMany(mappedBy = "jobOffer",
            cascade = CascadeType.ALL)
    @JsonIgnore
    private List<JobApplication> applications;






    // Constructeur vide obligatoire pour JPA

    public JobOffer(){

    }






    // GETTERS


    public Long getId() {
        return id;
    }



    public RecruiterProfile getRecruiter() {
        return recruiter;
    }



    public String getTitle() {
        return title;
    }



    public String getDescription() {
        return description;
    }



    public String getLocation() {
        return location;
    }



    public String getContractType() {
        return contractType;
    }



    public String getRequiredSkills() {
        return requiredSkills;
    }



    public LocalDate getCreatedDate() {
        return createdDate;
    }



    public String getStatus() {
        return status;
    }




    public List<JobApplication> getApplications() {
        return applications;
    }







    // SETTERS


    public void setRecruiter(RecruiterProfile recruiter) {
        this.recruiter = recruiter;
    }



    public void setTitle(String title) {
        this.title = title;
    }



    public void setDescription(String description) {
        this.description = description;
    }



    public void setLocation(String location) {
        this.location = location;
    }



    public void setContractType(String contractType) {
        this.contractType = contractType;
    }



    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }



    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }



    public void setStatus(String status) {
        this.status = status;
    }





    public void setApplications(List<JobApplication> applications) {
        this.applications = applications;
    }


}