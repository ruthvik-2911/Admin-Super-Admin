package org.jackfruit.keliri.controller;

import org.jackfruit.keliri.model.AdminRegistration;
import org.jackfruit.keliri.repository.AdminRegistrationRepository;
import org.jackfruit.keliri.service.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminRegistrationController {

    private final AdminRegistrationRepository registrationRepository;
    private final FileStorageService fileStorageService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminRegistrationController(AdminRegistrationRepository registrationRepository, FileStorageService fileStorageService) {
        this.registrationRepository = registrationRepository;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> register(
            @RequestParam("companyName") String companyName,
            @RequestParam("authorizedPerson") String authorizedPerson,
            @RequestParam("businessAddress") String businessAddress,
            @RequestParam(value = "gstNumber", required = false) String gstNumber,
            @RequestParam("mobileNumber") String mobileNumber,
            @RequestParam("emailId") String emailId,
            @RequestParam("password") String password,
            @RequestParam(value = "gstCertificate", required = false) MultipartFile gstCertificate,
            @RequestParam("companyRegistrationDoc") MultipartFile companyRegistrationDoc,
            @RequestParam("idProof") MultipartFile idProof
    ) {
        try {
            if (registrationRepository.findByEmailId(emailId).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Registration with this email already exists"));
            }

            AdminRegistration registration = new AdminRegistration();
            registration.setCompanyName(companyName);
            registration.setAuthorizedPerson(authorizedPerson);
            registration.setBusinessAddress(businessAddress);
            registration.setGstNumber(gstNumber);
            registration.setMobileNumber(mobileNumber);
            registration.setEmailId(emailId);
            registration.setPassword(passwordEncoder.encode(password));
            registration.setStatus("PENDING");
            registration.setSubmittedAt(Instant.now());

            // Upload files to S3
            String idSuffix = emailId.replaceAll("[^a-zA-Z0-9]", "_");
            
            if (gstCertificate != null && !gstCertificate.isEmpty()) {
                registration.setGstCertificateUrl(fileStorageService.uploadFile(gstCertificate, idSuffix + "/gst"));
            }
            
            registration.setCompanyRegistrationDocUrl(fileStorageService.uploadFile(companyRegistrationDoc, idSuffix + "/company"));
            registration.setIdProofUrl(fileStorageService.uploadFile(idProof, idSuffix + "/id"));

            registrationRepository.save(registration);

            return ResponseEntity.ok(Map.of("success", true, "message", "Registration submitted successfully. Awaiting approval."));
        } catch (software.amazon.awssdk.services.s3.model.S3Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "AWS S3 Error: " + e.awsErrorDetails().errorMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error submitting registration: " + e.getMessage()));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@RequestParam("email") String email) {
        return registrationRepository.findByEmailId(email)
                .map(reg -> ResponseEntity.ok(Map.of(
                        "success", true,
                        "status", reg.getStatus(),
                        "companyName", reg.getCompanyName(),
                        "submittedAt", reg.getSubmittedAt(),
                        "rejectionReason", reg.getRejectionReason() != null ? reg.getRejectionReason() : ""
                )))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No registration found for this email"));
    }
}
