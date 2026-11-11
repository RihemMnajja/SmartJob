package com.smartjob.repository;


import com.smartjob.model.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;



public interface JobOfferRepository
        extends JpaRepository<JobOffer, Long> {


}