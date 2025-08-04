// File: src/main/java/com/foodnow/controller/FileUploadController.java (NEW FILE)
package com.foodnow.controller;

import com.foodnow.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("image") MultipartFile file) {
        try {
            // The service saves the file and returns the web-accessible path
            String filePath = fileStorageService.storeFile(file);
            
            // Return the path in a JSON object
            return ResponseEntity.ok(Map.of("filePath", filePath));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not upload the file: " + e.getMessage());
        }
    }
}