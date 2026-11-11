package com.smartjob.controller;


import com.smartjob.dto.AiRequest;
import com.smartjob.dto.AiResponse;
import com.smartjob.model.JobOffer;
import com.smartjob.repository.JobOfferRepository;
import com.smartjob.service.AiMatchingService;


import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AiController {



    private final AiMatchingService aiMatchingService;

    private final JobOfferRepository jobOfferRepository;



    public AiController(
            AiMatchingService aiMatchingService,
            JobOfferRepository jobOfferRepository
    ){

        this.aiMatchingService = aiMatchingService;
        this.jobOfferRepository = jobOfferRepository;

    }






    @PostMapping(
            value="/match",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public AiResponse analyzeCV(

            @RequestParam("jobOfferId")
            Long jobOfferId,


            @RequestParam("cv")
            MultipartFile cv

    ){



        JobOffer offer =
                jobOfferRepository.findById(jobOfferId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Offre introuvable"
                                )
                        );



        /*
           Pour le moment on utilise un fichier temporaire.
           Plus tard on pourra utiliser FileStorageService.
        */


        try {


            java.io.File tempFile =
                    java.io.File.createTempFile(
                            "cv-",
                            ".pdf"
                    );


            cv.transferTo(tempFile);



            return aiMatchingService.analyzeCV(
                    tempFile.getAbsolutePath(),
                    offer
            );



        } catch(Exception e){


            throw new RuntimeException(
                    "Erreur analyse CV : "
                            + e.getMessage()
            );

        }


    }



}
