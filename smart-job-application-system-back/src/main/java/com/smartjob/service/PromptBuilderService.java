package com.smartjob.service;


import org.springframework.stereotype.Service;



@Service
public class PromptBuilderService {



    public String buildPrompt(
            String cvText,
            String requiredSkills
    ){



        return """
                
                Tu es un expert en recrutement informatique.

                Ta mission est d'analyser la compatibilité
                entre un CV candidat et une offre d'emploi.


                Compare les compétences du candidat
                avec les compétences demandées.


                Retourne UNIQUEMENT un JSON valide.


                Le format obligatoire est :


                {
                  "score": 0,
                  "strengths": [],
                  "missingSkills": [],
                  "feedback": ""
                }



                Le score doit être un nombre entre 0 et 100.


                OFFRE D'EMPLOI :

                %s



                CV DU CANDIDAT :

                %s



                N'ajoute aucun texte avant ou après le JSON.

                """
                .formatted(
                        requiredSkills,
                        cvText
                );

    }


}
