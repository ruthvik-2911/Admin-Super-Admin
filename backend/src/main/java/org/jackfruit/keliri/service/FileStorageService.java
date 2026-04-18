package org.jackfruit.keliri.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    @Value("${aws.s3.folder:registrations}")
    private String folder;

    public FileStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file, String subFolder) throws IOException {
        // Mocking upload as per user request to bypass S3 configuration issues for now
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String mockUrl = "http://localhost/mock-uploads/" + subFolder + "/" + fileName;
        
        System.out.println("MOCK UPLOAD: " + fileName + " to " + subFolder);
        return mockUrl;
    }
}
