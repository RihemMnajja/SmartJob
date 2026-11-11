package com.smartjob.controller;

import com.smartjob.model.JobOffer;
import com.smartjob.security.AuthenticatedUser;
import com.smartjob.service.JobOfferService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@CrossOrigin("*")
public class JobOfferController {

    private final JobOfferService service;

    public JobOfferController(
            JobOfferService service
    ) {
        this.service = service;
    }


    // ==========================================
    // CREATE
    // ==========================================

    @PostMapping
    public ResponseEntity<JobOffer> create(
            @RequestBody JobOffer offer,
            Authentication authentication
    ) {

        AuthenticatedUser user =
                (AuthenticatedUser)
                        authentication.getPrincipal();

        Long userId =
                user.getUserId();

        JobOffer savedOffer =
                service.save(
                        offer,
                        userId
                );

        return ResponseEntity.ok(
                savedOffer
        );
    }


    // ==========================================
    // READ ALL
    // ==========================================

    @GetMapping
    public List<JobOffer> getAll() {

        return service.findAll();
    }


    // ==========================================
    // READ BY ID
    // ==========================================

    @GetMapping("/{id}")
    public JobOffer getById(
            @PathVariable Long id
    ) {

        return service.findById(id);
    }


    // ==========================================
    // UPDATE
    // ==========================================

    @PutMapping("/{id}")
    public JobOffer update(
            @PathVariable Long id,
            @RequestBody JobOffer offer
    ) {

        return service.update(
                id,
                offer
        );
    }


    // ==========================================
    // DELETE
    // ==========================================

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        service.delete(id);
    }
}