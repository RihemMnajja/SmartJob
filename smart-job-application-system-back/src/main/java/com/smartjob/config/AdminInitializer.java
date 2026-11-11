package com.smartjob.config;

import com.smartjob.model.Role;
import com.smartjob.model.User;
import com.smartjob.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createDefaultAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {

            String adminEmail = "admin@smartjob.com";

            // Vérifier si le Super Admin existe déjà
            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setName("Super Admin");

                admin.setEmail(adminEmail);

                admin.setPassword(
                        passwordEncoder.encode("Admin@123456")
                );

                admin.setRole(Role.ROLE_ADMIN);

                userRepository.save(admin);

                System.out.println(
                        "=========================================="
                );

                System.out.println(
                        "SUPER ADMIN CREATED SUCCESSFULLY"
                );

                System.out.println(
                        "Email: " + adminEmail
                );

                System.out.println(
                        "Role: " + Role.ROLE_ADMIN
                );

                System.out.println(
                        "=========================================="
                );

            } else {

                System.out.println(
                        "SUPER ADMIN ALREADY EXISTS"
                );
            }
        };
    }
}
