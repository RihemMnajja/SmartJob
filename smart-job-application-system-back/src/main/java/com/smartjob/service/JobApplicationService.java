package com.smartjob.service;

import com.smartjob.dto.AiResponse;
import com.smartjob.model.ApplicationStatus;
import com.smartjob.model.JobApplication;
import com.smartjob.repository.JobApplicationRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    private final EmailService emailService;

    private final FileStorageService fileStorageService;

    private final AiMatchingService aiMatchingService;


    public JobApplicationService(
            JobApplicationRepository repository,
            EmailService emailService,
            FileStorageService fileStorageService,
            AiMatchingService aiMatchingService
    ) {

        this.repository = repository;
        this.emailService = emailService;
        this.fileStorageService = fileStorageService;
        this.aiMatchingService = aiMatchingService;
    }


    // =========================
    // CREATE CANDIDATURE
    // =========================

    public JobApplication save(JobApplication application) {

        application.setStatus(ApplicationStatus.SENT);

        application.setApplicationDate(LocalDate.now());

        return repository.save(application);
    }


    // =========================
    // READ ALL
    // =========================

    public List<JobApplication> findAll() {

        return repository.findAll();
    }


    // =========================
    // READ BY ID
    // =========================

    public JobApplication findById(Long id) {

        return repository.findById(id)
                .orElse(null);
    }


    // =========================
    // UPDATE
    // =========================

    public JobApplication update(
            Long id,
            JobApplication application) {

        JobApplication existing =
                repository.findById(id)
                        .orElse(null);

        if (existing != null) {

            existing.setCvPath(
                    application.getCvPath()
            );

            existing.setScoreIa(
                    application.getScoreIa()
            );

            existing.setAiFeedback(
                    application.getAiFeedback()
            );

            return repository.save(existing);
        }

        return null;
    }


    // =========================
    // UPLOAD CV
    // =========================

    // =========================
// UPLOAD CV + ANALYSE IA AUTOMATIQUE
// =========================

    public JobApplication uploadCV(
            Long id,
            MultipartFile file
    ) {

        JobApplication application =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found")
                        );


        // =========================
        // 1. STOCKER LE CV
        // =========================

        String path =
                fileStorageService.storeFile(file);

        application.setCvPath(path);


        // =========================
        // 2. SAUVEGARDER LE CV
        // =========================

        application =
                repository.save(application);


        // =========================
        // 3. LANCER L'ANALYSE IA
        // =========================

        AiResponse response =
                aiMatchingService.analyzeCV(
                        application.getCvPath(),
                        application.getJobOffer()
                );


        // =========================
        // 4. STOCKER LE SCORE IA
        // =========================

        application.setScoreIa(
                response.getScore()
        );


        // =========================
        // 5. STOCKER LE FEEDBACK
        // =========================

        application.setAiFeedback(
                response.getFeedback()
        );


        // =========================
        // 6. STOCKER LES STRENGTHS
        // =========================

        application.setStrengths(
                response.getStrengths()
        );


        // =========================
        // 7. STOCKER LES MISSING SKILLS
        // =========================

        application.setMissingSkills(
                response.getMissingSkills()
        );


        // =========================
        // 8. SAUVEGARDER LE RESULTAT IA
        // =========================

        return repository.save(application);
    }


    // =========================
    // ANALYSE IA DE LA CANDIDATURE
    // =========================

    public JobApplication analyzeApplication(Long id) {

        JobApplication application =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found")
                        );

        AiResponse response =
                aiMatchingService.analyzeCV(
                        application.getCvPath(),
                        application.getJobOffer()
                );


        // =========================
        // STOCKAGE RESULTAT IA
        // =========================

        application.setScoreIa(
                response.getScore()
        );

        application.setAiFeedback(
                response.getFeedback()
        );

        application.setStrengths(
                response.getStrengths()
        );

        application.setMissingSkills(
                response.getMissingSkills()
        );

        return repository.save(application);
    }


    // =========================
    // DELETE
    // =========================

    public void delete(Long id) {

        repository.deleteById(id);
    }


    // =========================
    // PAR CANDIDAT
    // =========================

    public List<JobApplication> findByCandidate(
            Long candidateId) {

        return repository.findByCandidateId(candidateId);
    }


    // =========================
    // PAR OFFRE
    // =========================

    public List<JobApplication> findByJobOffer(
            Long jobOfferId) {

        return repository.findByJobOfferId(jobOfferId);
    }
    public List<JobApplication> getApplicationsByOffer(Long offerId) {
        return repository.findByJobOfferIdOrderByScoreIaDesc(offerId);
    }


    // =====================================================
    // PAR OFFRE - TRIE PAR SCORE IA
    // =====================================================
    // Retourne les candidatures d'une offre
    // du score IA le plus élevé au score le plus faible.
    //
    // Exemple :
    // 95
    // 87
    // 76
    // 64
    // 51
    // =====================================================

    public List<JobApplication> findByJobOfferOrderByScore(
            Long jobOfferId) {

        return repository.findByJobOfferIdOrderByScoreIaDesc(
                jobOfferId
        );
    }


    // =========================
    // RH OUVRE LE CV
    // PENDING -> VIEWED
    // =========================

    public JobApplication viewApplication(Long id) {

        JobApplication application =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found")
                        );


        // Si la candidature est encore PENDING,
        // le RH ouvre le CV :
        //
        // PENDING
        //    ↓
        // VIEWED
        //
        // Si elle est déjà SHORTLISTED,
        // INTERVIEW, ACCEPTED ou REJECTED,
        // le statut ne change pas.

        if (application.getStatus()
                == ApplicationStatus.SENT) {

            application.setStatus(
                    ApplicationStatus.VIEWED
            );

            return repository.save(application);
        }

        return application;
    }


    // =========================
    // RH CHANGE STATUS
    // =========================

    public JobApplication updateStatus(
            Long id,
            ApplicationStatus newStatus
    ) {

        JobApplication application =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found")
                        );


        // =========================
        // MODIFICATION DU STATUS
        // =========================

        application.setStatus(newStatus);


        JobApplication savedApplication =
                repository.save(application);


        // =========================
        // EMAIL DU CANDIDAT
        // =========================

        String email =
                application.getCandidate()
                        .getUser()
                        .getEmail();


        // =========================
        // INTERVIEW
        // =========================

        if (newStatus == ApplicationStatus.INTERVIEW) {

            emailService.sendEmail(
                    email,
                    "Interview",
                    "Congratulations! Your application has been selected for an interview."
            );
        }


        // =========================
        // ACCEPTED
        // =========================

        if (newStatus == ApplicationStatus.ACCEPTED) {

            emailService.sendEmail(
                    email,
                    "Application Accepted",
                    "Congratulations! Your application has been accepted."
            );
        }


        // =========================
        // REJECTED
        // =========================

        if (newStatus == ApplicationStatus.REJECTED) {

            emailService.sendEmail(
                    email,
                    "Application Rejected",
                    "Thank you for your interest. Your application was not selected."
            );
        }


        return savedApplication;
    }
}