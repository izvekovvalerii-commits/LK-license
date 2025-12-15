package com.licensing.portal.service.impl;

import com.licensing.portal.model.Document;
import com.licensing.portal.model.Task;
import com.licensing.portal.model.User;
import com.licensing.portal.repository.DocumentRepository;
import com.licensing.portal.repository.TaskRepository;
import com.licensing.portal.repository.UserRepository;
import com.licensing.portal.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final Path fileStorageLocation;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public DocumentServiceImpl() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public Document uploadDocument(Long taskId, MultipartFile file, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + taskId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username " + username));

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Document document = new Document();
            document.setTask(task);
            document.setFileName(originalFileName);
            document.setFilePath(targetLocation.toString());
            document.setFileSize(file.getSize());
            document.setDocumentType(getFileExtension(originalFileName));
            document.setUploadedBy(user);

            return documentRepository.save(document);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @Override
    public List<Document> getDocumentsByTaskId(Long taskId) {
        return documentRepository.findByTaskId(taskId);
    }

    @Override
    public void deleteDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id " + documentId));

        try {
            Path filePath = Paths.get(document.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            // Log error but continue to delete from DB
            System.err.println("Could not delete file: " + ex.getMessage());
        }

        documentRepository.delete(document);
    }

    @Override
    public Document getDocument(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id " + documentId));
    }

    private String getFileExtension(String fileName) {
        if (fileName == null)
            return "";
        int lastIndexOf = fileName.lastIndexOf(".");
        if (lastIndexOf == -1)
            return "";
        return fileName.substring(lastIndexOf + 1);
    }
}
