package com.smartjob.controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import com.smartjob.model.RecruiterProfile;
import com.smartjob.service.RecruiterProfileService;

import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/api/recruiters")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin("*")
public class RecruiterProfileController {



    private final RecruiterProfileService service;



    public RecruiterProfileController(
            RecruiterProfileService service){

        this.service = service;
    }





    // CREATE
    @PostMapping
    public RecruiterProfile create(
            @RequestBody RecruiterProfile profile){

        return service.save(profile);
    }






    // READ ALL
    @GetMapping
    public List<RecruiterProfile> getAll(){

        return service.findAll();
    }






    // READ BY ID
    @GetMapping("/{id}")
    public RecruiterProfile getById(
            @PathVariable Long id){

        return service.findById(id);
    }







    // UPDATE
    @PutMapping("/{id}")
    public RecruiterProfile update(
            @PathVariable Long id,
            @RequestBody RecruiterProfile profile){


        return service.update(id, profile);
    }








    // DELETE
    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id){

        service.delete(id);
    }


}