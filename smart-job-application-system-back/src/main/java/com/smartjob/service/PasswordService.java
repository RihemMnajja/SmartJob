package com.smartjob.service;

import com.smartjob.model.PasswordResetToken;
import com.smartjob.model.User;
import com.smartjob.repository.PasswordResetTokenRepository;
import com.smartjob.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;


    public PasswordService(UserRepository userRepository,
                           PasswordResetTokenRepository tokenRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           EmailService emailService) {

        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }


    // =========================
    // CHANGE PASSWORD (JWT)
    // =========================
    public String changePassword(String token,
                                 String oldPassword,
                                 String newPassword,
                                 String confirmPassword) {

        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return "Old password incorrect";
        }


        if (!newPassword.equals(confirmPassword)) {
            return "Passwords do not match";
        }


        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);


        return "Password changed successfully";
    }



    // =========================
    // FORGOT PASSWORD
    // =========================
    @Transactional
    public void forgotPassword(String email) {


        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        // Supprimer ancien token s'il existe
        tokenRepository.deleteByEmail(email);


        // Générer nouveau token
        String token = UUID.randomUUID().toString();


        PasswordResetToken resetToken = new PasswordResetToken();

        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiryDate(
                LocalDateTime.now().plusMinutes(15)
        );


        tokenRepository.save(resetToken);



        String resetLink =
                "http://localhost:4200/reset-password?token="
                        + token;



        String message =
                "Bonjour " + user.getName()
                        + ",\n\n"
                        + "Cliquez sur le lien suivant pour réinitialiser votre mot de passe :\n"
                        + resetLink
                        + "\n\n"
                        + "Ce lien expire dans 15 minutes.";



        emailService.sendEmail(
                email,
                "Réinitialisation du mot de passe",
                message
        );
    }



    // =========================
    // RESET PASSWORD
    // =========================
    @Transactional
    public String resetPassword(String token,
                                String newPassword) {


        PasswordResetToken resetToken =
                tokenRepository.findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException("Invalid token"));



        if (resetToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            return "Token expired";
        }



        User user =
                userRepository.findByEmail(resetToken.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException("User not found"));



        user.setPassword(
                passwordEncoder.encode(newPassword)
        );


        userRepository.save(user);


        // supprimer le token après utilisation
        tokenRepository.delete(resetToken);


        return "Password reset successfully";
    }

}