package org.jackfruit.keliri.service;

import java.time.Instant;

import org.jackfruit.keliri.model.SuperAdmin;
import org.jackfruit.keliri.repository.SuperAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SuperAdminAuthService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private SuperAdminRepository adminRepo;

    @Autowired
    private JwtService jwtService;

    @Value("${security.superadmin.lock-duration-ms}")
    private long lockDurationMs;

    public String login(String email, String password) {
        SuperAdmin admin = adminRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (admin.isLocked() && admin.getLockUntil() != null && admin.getLockUntil().isBefore(Instant.now())) {
            admin.setLocked(false);
            admin.setLockUntil(null);
            admin.setFailedAttempts(0);
            adminRepo.save(admin);
        }

        if (admin.isLocked()) {
            throw new RuntimeException("Account temporarily locked");
        }

        if (admin.getPassword() != null && passwordEncoder.matches(password, admin.getPassword())) {
            admin.setFailedAttempts(0);
            admin.setLocked(false);
            admin.setLockUntil(null);
            adminRepo.save(admin);
            return jwtService.generateToken(admin);
        } else {
            admin.setFailedAttempts(admin.getFailedAttempts() + 1);
            if (admin.getFailedAttempts() >= 5) {
                admin.setLocked(true);
                admin.setLockUntil(Instant.now().plusMillis(lockDurationMs));
            }
            adminRepo.save(admin);
            throw new RuntimeException("Invalid credentials");
        }
    }
}
