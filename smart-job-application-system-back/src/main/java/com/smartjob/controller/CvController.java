package com.smartjob.controller;


import com.smartjob.model.JobApplication;
import com.smartjob.service.JobApplicationService;
import com.smartjob.service.PdfExtractionService;


import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/cv")
@CrossOrigin("*")
public class CvController {


    private final JobApplicationService applicationService;

    private final PdfExtractionService pdfExtractionService;



    public CvController(
            JobApplicationService applicationService,
            PdfExtractionService pdfExtractionService
    ){

        this.applicationService = applicationService;
        this.pdfExtractionService = pdfExtractionService;

    }



    @GetMapping("/extract/{id}")
    public String extractCV(
            @PathVariable Long id
    ){

        JobApplication application =
                applicationService.findById(id);



        if(application == null){

            return "Candidature introuvable";

        }



        return pdfExtractionService.extractText(
                application.getCvPath()
        );

    }

}