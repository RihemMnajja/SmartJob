package com.smartjob.controller;

import com.smartjob.dto.ChangePasswordRequest;
import com.smartjob.service.PasswordService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    // ======================================================
    // 1. CHANGE PASSWORD (JWT)
    // ======================================================
    @PutMapping("/change-password")
    public String changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody ChangePasswordRequest request
    ) {

        token = token.substring(7); // remove "Bearer "

        return passwordService.changePassword(
                token,
                request.getOldPassword(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );
    }

    // ======================================================
    // 2. FORGOT PASSWORD (send email)
    // ======================================================
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> request) {

        passwordService.forgotPassword(request.get("email"));

        return "Reset email sent successfully";
    }

    // ======================================================
    // 3. RESET PASSWORD (from email link)
    // ======================================================
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody Map<String, String> request) {

        String token = request.get("token");
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");


        if (!newPassword.equals(confirmPassword)) {
            return "Passwords do not match";
        }


        return passwordService.resetPassword(
                token,
                newPassword
        );
    }
}