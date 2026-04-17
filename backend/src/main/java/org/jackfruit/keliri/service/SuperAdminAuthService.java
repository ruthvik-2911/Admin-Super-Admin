package org.jackfruit.keliri.service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.jackfruit.keliri.model.SuperAdmin;
import org.jackfruit.keliri.repository.SuperAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import io.jsonwebtoken.Claims;

@Service
public class SuperAdminAuthService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private SuperAdminRepository adminRepo;

    @Autowired
    private JwtService jwtService;

    @Value("${security.superadmin.lock-duration-ms}")
    private long lockDurationMs;

    public Map<String, Object> login(String email, String password) {
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
            admin.setRole(jwtService.normalizeRole(admin.getRole()));
            admin.setFailedAttempts(0);
            admin.setLocked(false);
            admin.setLockUntil(null);
            adminRepo.save(admin);

            Map<String, Boolean> permissions = normalizePermissions(admin);
            admin.setPermissions(permissions);
            adminRepo.save(admin);

            String token = jwtService.generateToken(admin);
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("token", token);
            payload.put("message", "Login Successful");
            payload.put("expiresInHours", 24);
            payload.put("email", admin.getEmail());
            payload.put("name", admin.getName());
            payload.put("phone", admin.getPhone());
            payload.put("role", admin.getRole());
            payload.put("permissions", permissions);
            return payload;
        }

        admin.setFailedAttempts(admin.getFailedAttempts() + 1);
        if (admin.getFailedAttempts() >= 5) {
            admin.setLocked(true);
            admin.setLockUntil(Instant.now().plusMillis(lockDurationMs));
        }
        adminRepo.save(admin);
        throw new RuntimeException("Invalid credentials");
    }

    public Map<String, Object> getCurrentSession(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Authorization token is required");
        }

        String token = authorization.substring(7).trim();

        try {
            Claims claims = jwtService.parseToken(token);
            String adminId = claims.get("adminId", String.class);
            String email = claims.getSubject();

            SuperAdmin admin = adminId != null && !adminId.isBlank()
                    ? adminRepo.findById(adminId).orElse(null)
                    : null;

            if (admin == null && email != null && !email.isBlank()) {
                admin = adminRepo.findByEmail(email).orElse(null);
            }

            if (admin == null) {
                throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Account not found");
            }

            admin.setRole(jwtService.normalizeRole(admin.getRole()));
            Map<String, Boolean> permissions = normalizePermissions(admin);
            admin.setPermissions(permissions);
            adminRepo.save(admin);

            String refreshedToken = jwtService.generateToken(admin);
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("token", refreshedToken);
            payload.put("message", "Session refreshed");
            payload.put("expiresInHours", 24);
            payload.put("email", admin.getEmail());
            payload.put("name", admin.getName());
            payload.put("phone", admin.getPhone());
            payload.put("role", admin.getRole());
            payload.put("permissions", permissions);
            return payload;
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
    }

    public Map<String, Boolean> normalizePermissions(SuperAdmin admin) {
        Map<String, Boolean> allModules = new LinkedHashMap<>();
        allModules.put("dashboard", true);
        allModules.put("analytics", true);
        allModules.put("admins", true);
        allModules.put("publishers", true);
        allModules.put("ads", true);
        allModules.put("revenue", true);
        allModules.put("transactions", true);
        allModules.put("tickets", true);
        allModules.put("auditLogs", true);
        allModules.put("profile", true);
        allModules.put("settings", true);
        allModules.put("subAdmins", true);

        if (JwtService.MASTER_SUPER_ADMIN.equalsIgnoreCase(jwtService.normalizeRole(admin.getRole()))) {
            return allModules;
        }

        Map<String, Boolean> custom = new LinkedHashMap<>();
        if (admin.getPermissions() != null) {
            custom.putAll(admin.getPermissions());
        }

        Map<String, Boolean> merged = new LinkedHashMap<>();
        for (Map.Entry<String, Boolean> entry : allModules.entrySet()) {
            merged.put(entry.getKey(), Boolean.TRUE.equals(custom.get(entry.getKey())));
        }
        merged.put("subAdmins", false);
        return merged;
    }
}
