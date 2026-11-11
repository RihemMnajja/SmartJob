package com.smartjob.service;

import com.smartjob.dto.OllamaRequest;
import com.smartjob.dto.OllamaResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OllamaService {

    private final RestTemplate restTemplate;

    private final String ollamaUrl;

    private final String model;

    public OllamaService(
            RestTemplate restTemplate,
            @Value("${ollama.url}") String ollamaUrl,
            @Value("${ollama.model}") String model
    ) {
        this.restTemplate = restTemplate;
        this.ollamaUrl = ollamaUrl;
        this.model = model;
    }

    public String askOllama(String prompt) {

        OllamaRequest request = new OllamaRequest();

        request.setModel(model);
        request.setPrompt(prompt);
        request.setStream(false);

        OllamaResponse response =
                restTemplate.postForObject(
                        ollamaUrl,
                        request,
                        OllamaResponse.class
                );

        if (response == null) {
            throw new RuntimeException("Réponse Ollama vide");
        }

        return response.getResponse();
    }
}