package com.smartjob.dto;


import org.springframework.web.multipart.MultipartFile;



public class AiRequest {


    private Long jobOfferId;


    private MultipartFile cv;



    public AiRequest() {
    }



    public Long getJobOfferId() {
        return jobOfferId;
    }



    public void setJobOfferId(Long jobOfferId) {
        this.jobOfferId = jobOfferId;
    }



    public MultipartFile getCv() {
        return cv;
    }



    public void setCv(MultipartFile cv) {
        this.cv = cv;
    }


}
