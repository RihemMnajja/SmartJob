package com.smartjob.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartjob.dto.AiResponse;
import com.smartjob.model.JobOffer;
import org.springframework.stereotype.Service;

@Service
public class AiMatchingService {

    private final PdfExtractionService pdfExtractionService;

    private final OllamaService ollamaService;

    private final ObjectMapper objectMapper;


    public AiMatchingService(
            PdfExtractionService pdfExtractionService,
            OllamaService ollamaService
    ) {

        this.pdfExtractionService = pdfExtractionService;
        this.ollamaService = ollamaService;
        this.objectMapper = new ObjectMapper();

    }


    public AiResponse analyzeCV(
            String cvPath,
            JobOffer jobOffer
    ) {

        try {

            // ==========================
            // 1 - Vérification des données
            // ==========================

            if (cvPath == null || cvPath.isBlank()) {

                throw new RuntimeException(
                        "Le chemin du CV est vide."
                );
            }

            if (jobOffer == null) {

                throw new RuntimeException(
                        "L'offre d'emploi est introuvable."
                );
            }


            // ==========================
            // 2 - Extraction du texte CV
            // ==========================

            String cvText =
                    pdfExtractionService.extractText(cvPath);


            if (cvText == null || cvText.isBlank()) {

                throw new RuntimeException(
                        "Impossible d'extraire le texte du CV."
                );
            }


            // ==========================
            // 3 - Récupération des informations
            //    de l'offre
            // ==========================

            String jobTitle =
                    jobOffer.getTitle() != null
                            ? jobOffer.getTitle()
                            : "";

            String jobDescription =
                    jobOffer.getDescription() != null
                            ? jobOffer.getDescription()
                            : "";

            String requiredSkills =
                    jobOffer.getRequiredSkills() != null
                            ? jobOffer.getRequiredSkills()
                            : "";


            // ==========================
            // 4 - Création du prompt
            // ==========================

            /*
             * Ton prompt original est conservé.
             *
             * On ajoute simplement :
             * - le titre de l'offre
             * - la description de l'offre
             *
             * Cela permet à l'IA d'avoir plus de contexte
             * lors de la comparaison avec le CV.
             */

            String prompt = """

You are a professional AI-powered CV analysis and recruitment matching system.

Your mission:
Compare the candidate's CV with the skills and requirements requested in the job offer.

Analyze ONLY:
1. The technical skills explicitly present in the candidate's CV.
2. The technical skills required by the job offer.
3. The candidate's professional experience and projects.
4. The relevance of the candidate's profile to the job offer.

IMPORTANT LANGUAGE REQUIREMENT:

The ENTIRE response MUST be written in ENGLISH.

The following fields MUST be written entirely in ENGLISH:
- "strengths"
- "missingSkills"
- "feedback"

NEVER write any French words or sentences.
NEVER write in any other language.
Do NOT translate the answer into French.
Do NOT use French even if the CV or job offer contains French text.

IMPORTANT OUTPUT REQUIREMENT:

Return ONLY a valid JSON object.

Do NOT include:
- Any text before the JSON.
- Any text after the JSON.
- Markdown.
- Code fences.
- ```json
- Explanations outside the JSON.

The response MUST follow EXACTLY this JSON structure:

{
  "score": 0,
  "strengths": [
    "A technical skill or relevant experience found in the CV"
  ],
  "missingSkills": [
    "A required skill that is missing from the CV"
  ],
  "feedback": "A detailed explanation of the matching result written entirely in English."
}

MANDATORY RULES:

- "score" MUST be a number between 0 and 100.
- "strengths" MUST be an array of simple strings written entirely in English.
- "missingSkills" MUST be an array of simple strings written entirely in English.
- "feedback" MUST be a non-empty string written entirely in English.
- Explain clearly why the candidate received this score.
- Compare the candidate's CV with the job offer requirements.
- Do not invent skills or experience that are not present in the CV.
- Only consider skills and experience explicitly mentioned in the CV.
- Only consider requirements explicitly mentioned in the job offer.
- If a required skill is not found in the CV, include it in "missingSkills".
- If a relevant skill or experience is found in the CV, include it in "strengths".
- The score must reflect the actual match between the CV and the job offer.
- Keep the analysis professional and objective.

CANDIDATE CV:

%s

JOB OFFER TITLE:

%s

JOB OFFER DESCRIPTION:

%s

REQUIRED SKILLS:

%s

""".formatted(
                    cvText,
                    jobTitle,
                    jobDescription,
                    requiredSkills
            );


            // ==========================
            // 5 - Appel Ollama
            // ==========================

            String aiResult =
                    ollamaService.askOllama(prompt);


            System.out.println("========== OLLAMA ==========");
            System.out.println(aiResult);
            System.out.println("============================");


            // ==========================
            // 6 - Nettoyage réponse IA
            // ==========================

            aiResult = cleanJson(aiResult);


            // ==========================
            // 7 - Conversion JSON -> DTO
            // ==========================

            return objectMapper.readValue(
                    aiResult,
                    AiResponse.class
            );


        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Erreur analyse IA : "
                            + e.getMessage()
            );

        }

    }


    // ==========================
    // NETTOYAGE REPONSE IA
    // ==========================

    private String cleanJson(String response) {

        if (response == null || response.isBlank()) {

            throw new RuntimeException(
                    "La réponse de l'IA est vide."
            );
        }


        // Supprimer ```json

        response =
                response.replace(
                        "```json",
                        ""
                );


        // Supprimer ```

        response =
                response.replace(
                        "```",
                        ""
                );


        response = response.trim();


        // Trouver le premier {

        int start =
                response.indexOf("{");


        // Trouver le dernier }

        int end =
                response.lastIndexOf("}");


        if (start != -1 && end != -1) {

            return response.substring(
                    start,
                    end + 1
            );

        }


        throw new RuntimeException(
                "La réponse de l'IA ne contient pas de JSON valide."
        );

    }

}