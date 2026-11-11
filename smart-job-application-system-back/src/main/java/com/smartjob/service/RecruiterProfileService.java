package com.smartjob.service;

import com.smartjob.model.RecruiterProfile;
import com.smartjob.model.User;
import com.smartjob.repository.RecruiterProfileRepository;
import com.smartjob.repository.UserRepository;
import com.smartjob.security.AuthenticatedUser;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecruiterProfileService {


    private final RecruiterProfileRepository repository;
    private final UserRepository userRepository;

    public RecruiterProfileService(
            RecruiterProfileRepository repository,
            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

// =====================================================
// CREATE
// =====================================================

    public RecruiterProfile save(RecruiterProfile profile) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Utilisateur non authentifié"
            );
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof AuthenticatedUser authenticatedUser)) {

            throw new RuntimeException(
                    "Utilisateur authentifié invalide"
            );
        }

        Long userId = authenticatedUser.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable avec ID : " + userId
                        )
                );

        // Vérifier que l'utilisateur est bien RH
        if (user.getRole() == null ||
                !user.getRole().name().equals("ROLE_RH")) {

            throw new RuntimeException(
                    "Seul un utilisateur RH peut créer un profil recruteur"
            );
        }

        // Vérifier qu'il n'existe pas déjà un profil
        if (repository.findByUserId(userId).isPresent()) {

            throw new RuntimeException(
                    "Un profil recruteur existe déjà pour cet utilisateur"
            );
        }

        // L'utilisateur est récupéré automatiquement depuis le JWT
        profile.setUser(user);

        return repository.save(profile);
    }

// =====================================================
// READ ALL
// =====================================================

    public List<RecruiterProfile> findAll() {

        return repository.findAll();
    }

// =====================================================
// READ BY ID
// =====================================================

    public RecruiterProfile findById(Long id) {

        return repository.findById(id)
                .orElse(null);
    }

// =====================================================
// UPDATE
// =====================================================

    public RecruiterProfile update(
            Long id,
            RecruiterProfile profile) {

        RecruiterProfile existing =
                repository.findById(id)
                        .orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setCompanyName(
                profile.getCompanyName()
        );

        existing.setCompanyEmail(
                profile.getCompanyEmail()
        );

        existing.setPhone(
                profile.getPhone()
        );

        existing.setPosition(
                profile.getPosition()
        );

        return repository.save(existing);
    }

// =====================================================
// DELETE
// =====================================================

    public void delete(Long id) {

        repository.deleteById(id);
    }


}
