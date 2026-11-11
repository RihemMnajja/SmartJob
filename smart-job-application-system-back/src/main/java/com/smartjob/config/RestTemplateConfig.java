package com.smartjob.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;



@Configuration
public class RestTemplateConfig {


    /*
        RestTemplate permet à Spring Boot
        d'envoyer des requêtes HTTP vers Ollama.

        Exemple :

        Spring Boot
             |
             |
             POST
             |
             ↓
        http://localhost:11434/api/generate

    */


    @Bean
    public RestTemplate restTemplate(){

        return new RestTemplate();

    }


}
