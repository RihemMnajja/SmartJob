package com.smartjob.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.*;



@Service
public class FileStorageService {



    private final Path fileStorageLocation;



    public FileStorageService(
            @Value("${file.upload-dir}") String uploadDir
    ) {


        this.fileStorageLocation =
                Paths.get(uploadDir)
                        .toAbsolutePath()
                        .normalize();


        try {

            Files.createDirectories(
                    this.fileStorageLocation
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Impossible de créer le dossier upload",
                    e
            );
        }

    }






    public String storeFile(MultipartFile file){


        try {


            String fileName =
                    System.currentTimeMillis()
                            + "_"
                            + file.getOriginalFilename();



            Path targetLocation =
                    this.fileStorageLocation
                            .resolve(fileName);



            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING
            );



            return targetLocation.toString();



        } catch(IOException e){


            throw new RuntimeException(
                    "Erreur sauvegarde fichier",
                    e
            );

        }


    }


}
