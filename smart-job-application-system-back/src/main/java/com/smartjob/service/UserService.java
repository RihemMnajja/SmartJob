package com.smartjob.service;

import com.smartjob.dto.RegisterRequest;
import com.smartjob.model.Role;
import com.smartjob.model.User;
import com.smartjob.model.RecruiterProfile;
import com.smartjob.repository.UserRepository;
import com.smartjob.repository.RecruiterProfileRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(
            UserRepository userRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // ==========================================
    // REGISTER CANDIDATE
    // ==========================================

    public User register(RegisterRequest request) {

        validateBasicRegistration(request);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // Signup public candidat
        user.setRole(Role.ROLE_CANDIDAT);

        return userRepository.save(user);
    }


    // ==========================================
    // REGISTER RECRUITER
    // ==========================================

    public User registerRecruiter(RegisterRequest request) {

        validateBasicRegistration(request);


        // Vérifier le nom de l'entreprise
        if (request.getCompanyName() == null ||
                request.getCompanyName().isBlank()) {

            throw new IllegalArgumentException(
                    "Company name is required"
            );
        }


        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {

            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }


        // ==========================================
        // 1. CREER USER
        // ==========================================

        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // Le compte est RH
        user.setRole(Role.ROLE_RH);


        // Sauvegarder User d'abord
        User savedUser = userRepository.save(user);


        // ==========================================
        // 2. CREER RECRUITER PROFILE
        // ==========================================

        RecruiterProfile recruiterProfile =
                new RecruiterProfile();

        recruiterProfile.setUser(savedUser);

        recruiterProfile.setCompanyName(
                request.getCompanyName()
        );

        recruiterProfile.setCompanyEmail(
                request.getCompanyEmail()
        );


        recruiterProfileRepository.save(
                recruiterProfile
        );


        return savedUser;
    }


    // ==========================================
    // FIND USER BY EMAIL
    // ==========================================

    public User findByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }


    // ==========================================
    // VALIDATION
    // ==========================================

    private void validateBasicRegistration(
            RegisterRequest request
    ) {

        if (request.getName() == null ||
                request.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Name is required"
            );
        }


        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required"
            );
        }


        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required"
            );
        }
    }
}