package org.jackfruit.keliri.controller;

import java.util.Map;

import org.jackfruit.keliri.service.SuperAdminAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/superadmin")
public class SuperAdminAuthController {

    @Autowired
    private SuperAdminAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            Map<String, Object> payload = authService.login(credentials.get("email"), credentials.get("password"));
            return ResponseEntity.ok(payload);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentSession(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            return ResponseEntity.ok(authService.getCurrentSession(authorization));
        } catch (Exception e) {
            if (e instanceof org.springframework.web.server.ResponseStatusException ex) {
                return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", ex.getReason()));
            }
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logout Successful. Clear token and session on client."));
    }
}
