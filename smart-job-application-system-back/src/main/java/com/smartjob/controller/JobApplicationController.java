
package com.smartjob.controller;

import com.smartjob.dto.ApplicationRequest;
import com.smartjob.dto.StatusRequest;
import com.smartjob.model.CandidateProfile;
import com.smartjob.model.JobApplication;
import com.smartjob.model.JobOffer;
import com.smartjob.repository.CandidateProfileRepository;
import com.smartjob.repository.JobOfferRepository;
import com.smartjob.service.JobApplicationService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin("*")
public class JobApplicationController {

    private final JobApplicationService service;
    private final CandidateProfileRepository candidateRepository;
    private final JobOfferRepository jobOfferRepository;

    public JobApplicationController(
            JobApplicationService service,
            CandidateProfileRepository candidateRepository,
            JobOfferRepository jobOfferRepository
    ) {
        this.service = service;
        this.candidateRepository = candidateRepository;
        this.jobOfferRepository = jobOfferRepository;
    }

    // =========================
    // CREATE CANDIDATURE
    // =========================

    @PostMapping
    public JobApplication create(
            @RequestBody ApplicationRequest request) {

        /*
         * IMPORTANT :
         * request.getCandidateId() correspond à User.id
         *
         * Exemple :
         * candidateId = 22
         *
         * User.id = 22
         *        ↓
         * CandidateProfile.id = 14
         */

        CandidateProfile candidate =
                candidateRepository.findByUserId(
                                request.getCandidateId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate profile not found for user ID: "
                                                + request.getCandidateId()
                                )
                        );

        /*
         * jobOfferId correspond directement à JobOffer.id
         *
         * Exemple :
         * jobOfferId = 6
         */
        JobOffer jobOffer =
                jobOfferRepository.findById(
                                request.getJobOfferId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job offer not found with ID: "
                                                + request.getJobOfferId()
                                )
                        );

        JobApplication application =
                new JobApplication();

        application.setCandidate(candidate);
        application.setJobOffer(jobOffer);

        return service.save(application);
    }

    // =========================
    // READ ALL
    // =========================

    @GetMapping
    public List<JobApplication> getAll() {
        return service.findAll();
    }

    // =========================
    // READ BY ID
    // =========================

    @GetMapping("/{id}")
    public JobApplication getById(
            @PathVariable Long id) {

        return service.findById(id);
    }

    // =========================
    // UPDATE
    // =========================

    @PutMapping("/{id}")
    public JobApplication update(
            @PathVariable Long id,
            @RequestBody JobApplication application) {

        return service.update(id, application);
    }

    // =========================
    // DELETE
    // =========================

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        service.delete(id);
    }

    // =====================================================
    // CANDIDATURES D'UN CANDIDAT
    // =====================================================

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByCandidate(
            @PathVariable Long candidateId) {

        return ResponseEntity.ok(
                service.findByCandidate(candidateId)
        );
    }

    // =====================================================
    // CANDIDATURES D'UNE OFFRE
    // =====================================================

    @GetMapping("/offer/{offerId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByJobOffer(
            @PathVariable Long offerId) {

        return ResponseEntity.ok(
                service.findByJobOffer(offerId)
        );
    }

    // =====================================================
    // CANDIDATURES D'UNE OFFRE
    // TRIEES PAR SCORE IA DECROISSANT
    // =====================================================

    @GetMapping("/offer/{offerId}/sorted")
    public ResponseEntity<List<JobApplication>> getApplicationsByJobOfferSorted(
            @PathVariable Long offerId) {

        return ResponseEntity.ok(
                service.findByJobOfferOrderByScore(offerId)
        );
    }

    // =====================================================
    // RH OUVRE / CONSULTE LE CV
    // SENT -> VIEWED
    // =====================================================

    @GetMapping("/{id}/view-cv")
    public ResponseEntity<Resource> viewCV(
            @PathVariable Long id) {

        try {

            JobApplication application =
                    service.viewApplication(id);

            if (application.getCvPath() == null ||
                    application.getCvPath().isBlank()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            Path filePath =
                    Paths.get(application.getCvPath())
                            .toAbsolutePath()
                            .normalize();

            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );

            if (!resource.exists() ||
                    !resource.isReadable()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            String contentType =
                    Files.probeContentType(filePath);

            if (contentType == null) {
                contentType = "application/pdf";
            }

            return ResponseEntity
                    .ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    contentType
                            )
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" +
                                    filePath.getFileName() +
                                    "\""
                    )
                    .body(resource);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }

    // =====================================================
    // RH MODIFIE LE STATUT
    // =====================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request) {

        return ResponseEntity.ok(
                service.updateStatus(
                        id,
                        request.getStatus()
                )
        );
    }

    // =====================================================
    // UPLOAD CV + ANALYSE IA AUTOMATIQUE
    // =====================================================


    @PostMapping(
            value = "/{id}/upload-cv",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public JobApplication uploadCV(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        return service.uploadCV(id, file);
    }

    // =====================================================
    // REANALYSE IA MANUELLE
    // =====================================================

    @PostMapping("/{id}/analyze")
    public JobApplication analyze(
            @PathVariable Long id) {

        return service.analyzeApplication(id);
    }
}

