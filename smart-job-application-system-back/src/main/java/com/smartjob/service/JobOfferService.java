package com.smartjob.service;

import com.smartjob.model.JobOffer;
import com.smartjob.model.RecruiterProfile;
import com.smartjob.repository.JobOfferRepository;
import com.smartjob.repository.RecruiterProfileRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class JobOfferService {

    private final JobOfferRepository repository;
    private final RecruiterProfileRepository recruiterProfileRepository;

    public JobOfferService(
            JobOfferRepository repository,
            RecruiterProfileRepository recruiterProfileRepository
    ) {
        this.repository = repository;
        this.recruiterProfileRepository = recruiterProfileRepository;
    }


    // ==========================================
    // CREATE JOB OFFER
    // ==========================================

    public JobOffer save(JobOffer offer, Long userId) {

        // Récupérer le RecruiterProfile du RH connecté
        RecruiterProfile recruiter =
                recruiterProfileRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found for user ID: " + userId
                                )
                        );

        // Associer l'offre au RH
        offer.setRecruiter(recruiter);

        // Date automatique
        if (offer.getCreatedDate() == null) {
            offer.setCreatedDate(LocalDate.now());
        }

        // Statut par défaut
        if (offer.getStatus() == null ||
                offer.getStatus().isBlank()) {

            offer.setStatus("OPEN");
        }

        return repository.save(offer);
    }


    // ==========================================
    // READ ALL
    // ==========================================

    public List<JobOffer> findAll() {
        return repository.findAll();
    }


    // ==========================================
    // READ BY ID
    // ==========================================

    public JobOffer findById(Long id) {

        return repository.findById(id)
                .orElse(null);
    }


    // ==========================================
    // UPDATE
    // ==========================================

    public JobOffer update(
            Long id,
            JobOffer offer
    ) {

        JobOffer existing =
                repository.findById(id)
                        .orElse(null);

        if (existing != null) {

            existing.setTitle(
                    offer.getTitle()
            );

            existing.setDescription(
                    offer.getDescription()
            );

            existing.setLocation(
                    offer.getLocation()
            );

            existing.setContractType(
                    offer.getContractType()
            );

            existing.setRequiredSkills(
                    offer.getRequiredSkills()
            );

            existing.setStatus(
                    offer.getStatus()
            );

            return repository.save(existing);
        }

        return null;
    }


    // ==========================================
    // DELETE
    // ==========================================

    public void delete(Long id) {

        repository.deleteById(id);
    }
}