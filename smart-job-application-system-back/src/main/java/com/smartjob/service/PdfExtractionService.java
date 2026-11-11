package com.smartjob.service;


import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;


import java.io.File;
import java.io.IOException;



@Service
public class PdfExtractionService {


    public String extractText(String path){


        try {


            File file = new File(path);



            PDDocument document =
                    PDDocument.load(file);



            PDFTextStripper stripper =
                    new PDFTextStripper();



            String text =
                    stripper.getText(document);



            document.close();



            return text;



        } catch (IOException e) {


            throw new RuntimeException(
                    "Erreur lecture PDF : " + e.getMessage()
            );

        }


    }


}