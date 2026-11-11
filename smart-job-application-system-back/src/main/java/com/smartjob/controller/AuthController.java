package com.smartjob.controller;

import com.smartjob.dto.LoginRequest;
import com.smartjob.dto.RegisterRequest;
import com.smartjob.model.User;
import com.smartjob.service.JwtService;
import com.smartjob.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {


    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserService userService,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

// ==========================================
// REGISTER CANDIDATE
// ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {


        try {

            User user = userService.register(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message",
                            "Candidate registered successfully",

                            "id",
                            user.getId(),

                            "name",
                            user.getName(),

                            "email",
                            user.getEmail(),

                            "role",
                            user.getRole().name()
                    ));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

// ==========================================
// REGISTER RECRUITER / RH
// ==========================================

    @PostMapping("/register/recruiter")
    public ResponseEntity<?> registerRecruiter(
            @RequestBody RegisterRequest request
    ) {

        try {

            User user = userService.registerRecruiter(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message",
                            "Recruiter registered successfully",

                            "id",
                            user.getId(),

                            "name",
                            user.getName(),

                            "email",
                            user.getEmail(),

                            "role",
                            user.getRole().name()
                    ));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

// ==========================================
// LOGIN
// ==========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        User user = userService.findByEmail(
                request.email
        );

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error",
                            "Invalid email or password"
                    ));
        }

        if (!passwordEncoder.matches(
                request.password,
                user.getPassword()
        )) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error",
                            "Invalid email or password"
                    ));
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId()
        );

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "userId", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole().name()
                )
        );
    }


}
