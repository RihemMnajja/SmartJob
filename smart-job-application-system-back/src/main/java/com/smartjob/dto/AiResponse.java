package com.smartjob.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;



@JsonIgnoreProperties(ignoreUnknown = true)
public class AiResponse {


    private int score;


    private List<String> strengths;


    private List<String> missingSkills;


    private String feedback;




    public AiResponse() {
    }





    public AiResponse(
            int score,
            List<String> strengths,
            List<String> missingSkills,
            String feedback
    ){

        this.score = score;
        this.strengths = strengths;
        this.missingSkills = missingSkills;
        this.feedback = feedback;

    }





    public int getScore() {
        return score;
    }



    public void setScore(int score) {
        this.score = score;
    }





    public List<String> getStrengths() {
        return strengths;
    }



    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }





    public List<String> getMissingSkills() {
        return missingSkills;
    }



    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }





    public String getFeedback() {
        return feedback;
    }



    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }


}