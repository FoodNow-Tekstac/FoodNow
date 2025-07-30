package com.foodnow;

import com.foodnow.model.Role;
import com.foodnow.model.User;
import com.foodnow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if the admin user already exists
        if (!userRepository.findByEmail("admin@foodnow.com").isPresent()) {
            User adminUser = new User();
            adminUser.setName("Admin");
            adminUser.setEmail("admin@foodnow.com");
            adminUser.setPhoneNumber("0000000000"); // Dummy phone number
            adminUser.setPassword(passwordEncoder.encode("admin123")); // Use a strong password
            adminUser.setRole(Role.ADMIN);
            userRepository.save(adminUser);
            System.out.println("Default admin user created.");
        }
    }
}