package com.smartjob.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;




@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {




    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;




    // Informations personnelles

    private String photo;

    private String firstName;

    private String lastName;

    private String gender;

    private LocalDate birthDate;

    private String nationality;

    private String city;

    private String address;

    private String phone;




    // Profil professionnel

    private String professionalTitle;


    @Column(length = 3000)
    private String summary;


    private String availability;




    // Formation principale

    private String educationLevel;

    private String school;




    // Réseaux

    private String linkedin;

    private String github;

    private String portfolio;




    // CV

    private String cvPath;





    // Relation avec User

    @OneToOne
    @JoinColumn(name="user_id")
    @JsonIgnore
    private User user;






    // Expériences

    @OneToMany(mappedBy="profile",
            cascade=CascadeType.ALL,
            fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private List<Experience> experiences;





    // Formations

    @OneToMany(mappedBy="profile",
            cascade=CascadeType.ALL,
            fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private List<Education> educations;





    // Compétences

    @OneToMany(mappedBy="profile",
            cascade=CascadeType.ALL,
            fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private List<Skill> skills;





    // Langues

    @OneToMany(mappedBy="profile",
            cascade=CascadeType.ALL,
            fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private List<Language> languages;





    // Certifications

    @OneToMany(mappedBy="profile",
            cascade=CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private List<Certification> certifications;





    // Projets

    @OneToMany(mappedBy="profile",
            cascade=CascadeType.ALL,
            fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private List<Project> projects;






    // ==============================
    // Relation Application
    // ==============================


    @OneToMany(mappedBy="candidate",
            cascade=CascadeType.ALL)
    @JsonIgnore
    private List<JobApplication> applications;






    // Constructeur vide

    public CandidateProfile(){

    }






    // GETTERS


    public Long getId(){
        return id;
    }


    public User getUser(){
        return user;
    }


    public String getPhoto(){
        return photo;
    }


    public String getFirstName(){
        return firstName;
    }


    public String getLastName(){
        return lastName;
    }


    public String getGender(){
        return gender;
    }


    public LocalDate getBirthDate(){
        return birthDate;
    }


    public String getNationality(){
        return nationality;
    }


    public String getCity(){
        return city;
    }


    public String getAddress(){
        return address;
    }


    public String getPhone(){
        return phone;
    }


    public String getProfessionalTitle(){
        return professionalTitle;
    }


    public String getSummary(){
        return summary;
    }


    public String getAvailability(){
        return availability;
    }


    public String getEducationLevel(){
        return educationLevel;
    }


    public String getSchool(){
        return school;
    }


    public String getLinkedin(){
        return linkedin;
    }


    public String getGithub(){
        return github;
    }


    public String getPortfolio(){
        return portfolio;
    }


    public String getCvPath(){
        return cvPath;
    }


    public List<Experience> getExperiences(){
        return experiences;
    }


    public List<Education> getEducations(){
        return educations;
    }


    public List<Skill> getSkills(){
        return skills;
    }


    public List<Language> getLanguages(){
        return languages;
    }


    public List<Certification> getCertifications(){
        return certifications;
    }


    public List<Project> getProjects(){
        return projects;
    }


    public List<JobApplication> getApplications(){
        return applications;
    }







    // SETTERS


    public void setUser(User user){
        this.user = user;
    }


    public void setPhoto(String photo){
        this.photo = photo;
    }


    public void setFirstName(String firstName){
        this.firstName = firstName;
    }


    public void setLastName(String lastName){
        this.lastName = lastName;
    }


    public void setGender(String gender){
        this.gender = gender;
    }


    public void setBirthDate(LocalDate birthDate){
        this.birthDate = birthDate;
    }


    public void setNationality(String nationality){
        this.nationality = nationality;
    }


    public void setCity(String city){
        this.city = city;
    }


    public void setAddress(String address){
        this.address = address;
    }


    public void setPhone(String phone){
        this.phone = phone;
    }


    public void setProfessionalTitle(String professionalTitle){
        this.professionalTitle = professionalTitle;
    }


    public void setSummary(String summary){
        this.summary = summary;
    }


    public void setAvailability(String availability){
        this.availability = availability;
    }


    public void setEducationLevel(String educationLevel){
        this.educationLevel = educationLevel;
    }


    public void setSchool(String school){
        this.school = school;
    }


    public void setLinkedin(String linkedin){
        this.linkedin = linkedin;
    }


    public void setGithub(String github){
        this.github = github;
    }


    public void setPortfolio(String portfolio){
        this.portfolio = portfolio;
    }


    public void setCvPath(String cvPath){
        this.cvPath = cvPath;
    }


    public void setExperiences(List<Experience> experiences){
        this.experiences = experiences;
    }


    public void setEducations(List<Education> educations){
        this.educations = educations;
    }


    public void setSkills(List<Skill> skills){
        this.skills = skills;
    }


    public void setLanguages(List<Language> languages){
        this.languages = languages;
    }


    public void setCertifications(List<Certification> certifications){
        this.certifications = certifications;
    }


    public void setProjects(List<Project> projects){
        this.projects = projects;
    }


    public void setApplications(List<JobApplication> applications){
        this.applications = applications;
    }

}