package com.smartjob.controller;

import com.smartjob.model.CandidateProfile;
import com.smartjob.model.Certification;
import com.smartjob.model.Education;
import com.smartjob.model.Experience;
import com.smartjob.model.Language;
import com.smartjob.model.Project;
import com.smartjob.model.Skill;
import com.smartjob.model.User;
import com.smartjob.repository.CandidateProfileRepository;
import com.smartjob.repository.UserRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;


@RestController
@RequestMapping("/profile")
@CrossOrigin("*")
@SecurityRequirement(name = "bearerAuth")
public class CandidateProfileController {

    private final CandidateProfileRepository profileRepository;

    private final UserRepository userRepository;

    // Dossier de stockage des photos de profil
    private final Path profilePhotoStorageLocation =
            Paths.get("uploads/profile-photos")
                    .toAbsolutePath()
                    .normalize();

    public CandidateProfileController(
            CandidateProfileRepository profileRepository,
            UserRepository userRepository) {

        this.profileRepository = profileRepository;
        this.userRepository = userRepository;

        // Création automatique du dossier
        try {
            Files.createDirectories(profilePhotoStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Impossible de créer le dossier de stockage des photos",
                    e
            );
        }
    }

    // ===============================
    // HELPER: lier chaque élément d'une liste au profil parent
    // ===============================
    // Sans ceci, Hibernate insère les lignes filles avec profile_id = NULL
    // (le cascade=ALL persiste bien les entités, mais ne renseigne jamais
    // la clé étrangère côté "mappedBy" tout seul).

    private void linkChildrenToProfile(CandidateProfile profile) {

        if (profile.getExperiences() != null) {
            for (Experience e : profile.getExperiences()) {
                e.setProfile(profile);
            }
        }

        if (profile.getEducations() != null) {
            for (Education e : profile.getEducations()) {
                e.setProfile(profile);
            }
        }

        if (profile.getSkills() != null) {
            for (Skill s : profile.getSkills()) {
                s.setProfile(profile);
            }
        }

        if (profile.getLanguages() != null) {
            for (Language l : profile.getLanguages()) {
                l.setProfile(profile);
            }
        }

        if (profile.getCertifications() != null) {
            for (Certification c : profile.getCertifications()) {
                c.setProfile(profile);
            }
        }

        if (profile.getProjects() != null) {
            for (Project p : profile.getProjects()) {
                p.setProfile(profile);
            }
        }
    }

    // ===============================
    // CREATE PROFILE
    // ===============================

    @PostMapping("/{userId}")
    public ResponseEntity<?> createProfile(
            @PathVariable Long userId,
            @RequestBody CandidateProfile profile) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Vérifier si profil existe déjà
        if (profileRepository.findByUserId(userId).isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Profile already exists");
        }

        profile.setUser(user);

        // IMPORTANT : relier chaque expérience/formation/compétence/...
        // au profil avant la sauvegarde, sinon leur profile_id reste NULL.
        linkChildrenToProfile(profile);

        CandidateProfile saved =
                profileRepository.save(profile);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    // ===============================
    // GET PROFILE
    // ===============================

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(
            @PathVariable Long userId) {

        return profileRepository
                .findByUserId(userId)

                .map(profile ->
                        ResponseEntity.ok(profile))

                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // ===============================
    // UPDATE PROFILE
    // ===============================

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody CandidateProfile updatedProfile) {

        CandidateProfile existingProfile =
                profileRepository.findByUserId(userId)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Profile not found"));

        // Modification des champs plats

        existingProfile.setPhoto(
                updatedProfile.getPhoto());

        existingProfile.setFirstName(
                updatedProfile.getFirstName());

        existingProfile.setLastName(
                updatedProfile.getLastName());

        existingProfile.setGender(
                updatedProfile.getGender());

        existingProfile.setBirthDate(
                updatedProfile.getBirthDate());

        existingProfile.setNationality(
                updatedProfile.getNationality());

        existingProfile.setCity(
                updatedProfile.getCity());

        existingProfile.setAddress(
                updatedProfile.getAddress());

        existingProfile.setPhone(
                updatedProfile.getPhone());

        existingProfile.setProfessionalTitle(
                updatedProfile.getProfessionalTitle());

        existingProfile.setSummary(
                updatedProfile.getSummary());

        existingProfile.setAvailability(
                updatedProfile.getAvailability());

        existingProfile.setEducationLevel(
                updatedProfile.getEducationLevel());

        existingProfile.setSchool(
                updatedProfile.getSchool());

        existingProfile.setLinkedin(
                updatedProfile.getLinkedin());

        existingProfile.setGithub(
                updatedProfile.getGithub());

        existingProfile.setPortfolio(
                updatedProfile.getPortfolio());

        existingProfile.setCvPath(
                updatedProfile.getCvPath());

        // IMPORTANT : remplacer les listes SEULEMENT si le client en a
        // envoyé (non-null), pour ne pas effacer les données existantes
        // à chaque sauvegarde des champs plats. On vide la collection
        // gérée par Hibernate puis on la repeuple (au lieu de réaffecter
        // la référence) pour que le dirty-checking fonctionne bien.

        if (updatedProfile.getExperiences() != null) {
            replaceList(existingProfile.getExperiences(), updatedProfile.getExperiences(),
                    existingProfile, (child, profile) -> ((Experience) child).setProfile(profile));
        }

        if (updatedProfile.getEducations() != null) {
            replaceList(existingProfile.getEducations(), updatedProfile.getEducations(),
                    existingProfile, (child, profile) -> ((Education) child).setProfile(profile));
        }

        if (updatedProfile.getSkills() != null) {
            replaceList(existingProfile.getSkills(), updatedProfile.getSkills(),
                    existingProfile, (child, profile) -> ((Skill) child).setProfile(profile));
        }

        if (updatedProfile.getLanguages() != null) {
            replaceList(existingProfile.getLanguages(), updatedProfile.getLanguages(),
                    existingProfile, (child, profile) -> ((Language) child).setProfile(profile));
        }

        if (updatedProfile.getCertifications() != null) {
            replaceList(existingProfile.getCertifications(), updatedProfile.getCertifications(),
                    existingProfile, (child, profile) -> ((Certification) child).setProfile(profile));
        }

        if (updatedProfile.getProjects() != null) {
            replaceList(existingProfile.getProjects(), updatedProfile.getProjects(),
                    existingProfile, (child, profile) -> ((Project) child).setProfile(profile));
        }

        CandidateProfile saved =
                profileRepository.save(existingProfile);

        return ResponseEntity.ok(saved);
    }

    // Petit helper générique : vide la collection persistante existante et
    // la repeuple avec les nouveaux éléments, en reliant chacun au profil.
    // NOTE: sans orphanRemoval=true sur les @OneToMany (voir CandidateProfile.java),
    // les anciennes lignes retirées de la liste seront détachées (profile_id
    // remis à NULL) mais PAS supprimées de la base. Ajoutez orphanRemoval=true
    // si vous voulez qu'elles soient réellement effacées.
    @SuppressWarnings("unchecked")
    private <T> void replaceList(
            List<T> existingList,
            List<T> newList,
            CandidateProfile profile,
            java.util.function.BiConsumer<Object, CandidateProfile> linker) {

        existingList.clear();
        for (T item : newList) {
            linker.accept(item, profile);
            existingList.add(item);
        }
    }

    // ===============================
    // UPLOAD PROFILE PHOTO
    // ===============================

    @PostMapping(
            value = "/{userId}/upload-photo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadProfilePhoto(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        try {

            // Vérifier si le profil existe
            CandidateProfile profile =
                    profileRepository.findByUserId(userId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Profile not found"));

            // Vérifier si le fichier est vide
            if (file.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Please select a photo");
            }

            // Vérifier le type MIME
            // Vérifier si le fichier est vide
            if (file.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Please select a photo");
            }

// Récupérer le nom original
            String originalFilename = file.getOriginalFilename();

            if (originalFilename == null || originalFilename.isBlank()) {
                return ResponseEntity
                        .badRequest()
                        .body("Invalid file name");
            }

// Récupérer l'extension
            String extension = originalFilename
                    .substring(originalFilename.lastIndexOf("."))
                    .toLowerCase();

// Vérifier l'extension
            if (!extension.equals(".jpg")
                    && !extension.equals(".jpeg")
                    && !extension.equals(".png")) {

                return ResponseEntity
                        .badRequest()
                        .body("Only JPG, JPEG and PNG images are allowed");
            }

// Vérifier le type MIME
            String contentType = file.getContentType();

            if (contentType == null
                    || (!contentType.equalsIgnoreCase("image/jpeg")
                    && !contentType.equalsIgnoreCase("image/png"))) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid image format");
            }

            // Nom unique
            String fileName =
                    "profile_" +
                            userId +
                            "_" +
                            UUID.randomUUID() +
                            extension;

            // Chemin final
            Path targetLocation =
                    profilePhotoStorageLocation
                            .resolve(fileName)
                            .normalize();

            // Copier le fichier
            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING
            );

            // Supprimer ancienne photo si elle existe
            String oldPhoto =
                    profile.getPhoto();

            if (oldPhoto != null &&
                    !oldPhoto.isBlank()) {

                try {

                    Path oldPhotoPath =
                            Paths.get(oldPhoto);

                    if (Files.exists(oldPhotoPath)) {
                        Files.delete(oldPhotoPath);
                    }

                } catch (Exception e) {

                    // Ne pas bloquer l'upload
                    // si la suppression de l'ancienne photo échoue
                    System.out.println(
                            "Impossible de supprimer l'ancienne photo : "
                                    + e.getMessage()
                    );
                }
            }

            // Sauvegarder le chemin
            profile.setPhoto(
                    targetLocation.toString()
            );

            CandidateProfile saved =
                    profileRepository.save(profile);

            return ResponseEntity.ok(saved);

        } catch (IOException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Error while uploading profile photo: "
                                    + e.getMessage()
                    );
        }
    }

    // ===============================
    // VIEW PROFILE PHOTO
    // ===============================

    @GetMapping("/{userId}/photo")
    public ResponseEntity<Resource> getProfilePhoto(
            @PathVariable Long userId) {

        try {

            CandidateProfile profile =
                    profileRepository.findByUserId(userId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Profile not found"));

            String photoPath =
                    profile.getPhoto();

            if (photoPath == null ||
                    photoPath.isBlank()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            Path filePath =
                    Paths.get(photoPath)
                            .toAbsolutePath()
                            .normalize();

            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );

            if (!resource.exists() ||
                    !resource.isReadable()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            String contentType =
                    Files.probeContentType(filePath);

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity
                    .ok()
                    .contentType(
                            MediaType.parseMediaType(contentType)
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" +
                                    filePath.getFileName() +
                                    "\""
                    )
                    .body(resource);

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .build();
        }
    }

    // ===============================
    // DELETE PROFILE
    // ===============================

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteProfile(
            @PathVariable Long userId) {

        CandidateProfile profile =
                profileRepository.findByUserId(userId)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Profile not found"));

        profileRepository.delete(profile);

        return ResponseEntity.ok(
                "Profile deleted successfully");
    }
}