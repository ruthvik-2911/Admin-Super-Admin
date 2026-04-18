package org.jackfruit.keliri.service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.jackfruit.keliri.model.users;
import org.jackfruit.keliri.repository.usersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private usersRepository usersRepo;

    @Autowired
    private JwtService jwtService;

    public Map<String, Object> login(String identifier, String password) {
        // Try finding by email
        Optional<users> userOpt = usersRepo.findByEmailAddress(identifier);
        
        // If not found, could try by phone, but SRS usually implies email/password for admins
        
        users user = userOpt.orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // SECURE LOGIN: Check if account is ACTIVE
        if (user.getAccountStatus() == null || !"ACTIVE".equals(user.getAccountStatus())) {
            throw new RuntimeException("Account is not active. Please wait for Super Admin approval.");
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtService.generateToken(user);
            
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("success", true);
            payload.put("token", token);
            payload.put("message", "Login Successful");
            payload.put("user", Map.of(
                "id", user.getId(),
                "name", user.getFullName(),
                "email", user.getEmailAddress(),
                "company", user.getCompanyName() != null ? user.getCompanyName() : "",
                "role", user.getUserType()
            ));
            return payload;
        }

        throw new RuntimeException("Invalid credentials");
    }
}
