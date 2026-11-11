package com.smartjob.repository;

import com.smartjob.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByCandidateId(Long candidateId);

    List<JobApplication> findByJobOfferId(Long jobOfferId);

    // Candidatures d'une offre triées par score IA décroissant
    List<JobApplication> findByJobOfferIdOrderByScoreIaDesc(Long jobOfferId);

}