package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        String imageUrl = uploadService.uploadImage(file);

        return ResponseEntity.ok(Map.of(
                "url", imageUrl
        ));
    }
}