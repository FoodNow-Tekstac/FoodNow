package com.foodnow.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final String uploadBaseUrl;
    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    public FileStorageService(
            @Value("${file.upload-dir}") String uploadDir,
            @Value("${file.upload-url:/uploads/}") String uploadBaseUrl) {

        // Normalize path
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.uploadBaseUrl = uploadBaseUrl.endsWith("/") ? uploadBaseUrl : uploadBaseUrl + "/";

        logger.info("====================================================================");
        logger.info("CONFIGURED UPLOAD DIR: {}", uploadDir);
        logger.info("RESOLVED ABSOLUTE PATH: {}", this.fileStorageLocation);
        logger.info("====================================================================");

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Invalid path sequence in filename: " + originalFileName);
            }

            String fileExtension = "";
            int dotIndex = originalFileName.lastIndexOf(".");
            if (dotIndex != -1) {
                fileExtension = originalFileName.substring(dotIndex);
            }

            String uniqueFileName = UUID.randomUUID() + fileExtension;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return uploadBaseUrl + uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName, ex);
        }
    }
}
