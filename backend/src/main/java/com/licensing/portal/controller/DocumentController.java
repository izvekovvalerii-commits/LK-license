package com.licensing.portal.controller;

import com.licensing.portal.model.Document;
import com.licensing.portal.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/tasks/{taskId}/documents")
    public ResponseEntity<Document> uploadDocument(@PathVariable Long taskId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        String username = authentication.getName();
        Document document = documentService.uploadDocument(taskId, file, username);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/tasks/{taskId}/documents")
    public ResponseEntity<List<Document>> getDocumentsByTaskId(@PathVariable Long taskId) {
        List<Document> documents = documentService.getDocumentsByTaskId(taskId);
        return ResponseEntity.ok(documents);
    }

    @DeleteMapping("/documents/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId) {
        documentService.deleteDocument(documentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) {
        Document document = documentService.getDocument(documentId);
        try {
            Path filePath = Paths.get(document.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("application/octet-stream"))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + document.getFileName() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("File not found " + document.getFileName());
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + document.getFileName(), ex);
        }
    }
}
