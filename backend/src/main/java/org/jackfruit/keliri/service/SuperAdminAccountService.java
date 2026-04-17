package org.jackfruit.keliri.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.jackfruit.keliri.model.SuperAdmin;
import org.jackfruit.keliri.model.SuperAdminAccountDto;
import org.jackfruit.keliri.repository.SuperAdminRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SuperAdminAccountService {
    private final SuperAdminRepository superAdminRepository;
    private final SuperAdminAuthService authService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public SuperAdminAccountService(SuperAdminRepository superAdminRepository, SuperAdminAuthService authService) {
        this.superAdminRepository = superAdminRepository;
        this.authService = authService;
    }

    public List<SuperAdminAccountDto.SubAdminSummary> listSubAdmins() {
        List<SuperAdminAccountDto.SubAdminSummary> records = new ArrayList<>();
        for (SuperAdmin account : superAdminRepository.findByRole("SUB_SUPER_ADMIN")) {
            records.add(toSummary(account));
        }
        records.sort((a, b) -> a.getEmail().compareToIgnoreCase(b.getEmail()));
        return records;
    }

    public SuperAdminAccountDto.SubAdminSummary createSubAdmin(SuperAdminAccountDto.CreateSubAdminRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }

        if (superAdminRepository.findByEmail(request.getEmail().trim()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        SuperAdmin account = new SuperAdmin();
        account.setName(request.getName() == null || request.getName().isBlank() ? "Sub Super Admin" : request.getName().trim());
        account.setEmail(request.getEmail().trim().toLowerCase());
        account.setPhone(request.getPhone());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setLocked(false);
        account.setFailedAttempts(0);
        account.setLockUntil(null);
        account.setRole("SUB_SUPER_ADMIN");
        account.setPermissions(normalizeSubPermissions(request.getPermissions()));
        superAdminRepository.save(account);
        return toSummary(account);
    }

    public SuperAdminAccountDto.SubAdminSummary updateSubAdmin(String id, SuperAdminAccountDto.UpdateSubAdminRequest request) {
        SuperAdmin account = superAdminRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sub admin not found"));

        if (!"SUB_SUPER_ADMIN".equalsIgnoreCase(account.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only sub admins can be updated here");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            account.setName(request.getName().trim());
        }

        if (request.getPhone() != null) {
            account.setPhone(request.getPhone().trim());
        }

        if (request.getPermissions() != null) {
            account.setPermissions(normalizeSubPermissions(request.getPermissions()));
        }

        superAdminRepository.save(account);
        return toSummary(account);
    }

    public SuperAdminAccountDto.SubAdminSummary lockSubAdmin(String id) {
        SuperAdmin account = findSubAdmin(id);
        account.setLocked(true);
        superAdminRepository.save(account);
        return toSummary(account);
    }

    public SuperAdminAccountDto.SubAdminSummary unlockSubAdmin(String id) {
        SuperAdmin account = findSubAdmin(id);
        account.setLocked(false);
        account.setFailedAttempts(0);
        account.setLockUntil(null);
        superAdminRepository.save(account);
        return toSummary(account);
    }

    public void deleteSubAdmin(String id) {
        SuperAdmin account = findSubAdmin(id);
        superAdminRepository.delete(account);
    }

    private SuperAdmin findSubAdmin(String id) {
        SuperAdmin account = superAdminRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sub admin not found"));

        if (!"SUB_SUPER_ADMIN".equalsIgnoreCase(account.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only sub admins can be managed here");
        }
        return account;
    }

    private Map<String, Boolean> normalizeSubPermissions(Map<String, Boolean> requested) {
        SuperAdmin dummy = new SuperAdmin();
        dummy.setRole("SUB_SUPER_ADMIN");
        dummy.setPermissions(requested == null ? Map.of() : requested);

        Map<String, Boolean> normalized = new LinkedHashMap<>(authService.normalizePermissions(dummy));
        normalized.put("subAdmins", false);
        return normalized;
    }

    private SuperAdminAccountDto.SubAdminSummary toSummary(SuperAdmin account) {
        SuperAdminAccountDto.SubAdminSummary summary = new SuperAdminAccountDto.SubAdminSummary();
        summary.setId(account.getId());
        summary.setName(account.getName());
        summary.setEmail(account.getEmail());
        summary.setPhone(account.getPhone());
        summary.setRole(account.getRole());
        summary.setLocked(account.isLocked());
        summary.setPermissions(account.getPermissions());
        return summary;
    }
}
