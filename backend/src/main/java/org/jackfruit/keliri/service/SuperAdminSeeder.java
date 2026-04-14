package org.jackfruit.keliri.service;

import java.util.Map;

import org.jackfruit.keliri.model.SuperAdmin;
import org.jackfruit.keliri.repository.SuperAdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class SuperAdminSeeder implements CommandLineRunner {
    private final SuperAdminRepository superAdminRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public SuperAdminSeeder(SuperAdminRepository superAdminRepository) {
        this.superAdminRepository = superAdminRepository;
    }

    @Override
    public void run(String... args) {
        String defaultEmail = "admin@keliri.com";
        String defaultPassword = "password123";

        SuperAdmin admin = superAdminRepository.findByEmail(defaultEmail).orElseGet(SuperAdmin::new);
        admin.setEmail(defaultEmail);
        admin.setPassword(passwordEncoder.encode(defaultPassword));
        admin.setLocked(false);
        admin.setFailedAttempts(0);
        admin.setLockUntil(null);
        admin.setRole("SUPER_ADMIN");
        admin.setPermissions(Map.of("dashboard", true, "admins", true, "publishers", true, "ads", true, "tickets", true));

        superAdminRepository.save(admin);
    }
}
