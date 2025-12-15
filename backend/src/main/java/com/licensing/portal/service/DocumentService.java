package com.licensing.portal.service;

import com.licensing.portal.model.Document;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    Document uploadDocument(Long taskId, MultipartFile file, String username);

    List<Document> getDocumentsByTaskId(Long taskId);

    void deleteDocument(Long documentId);

    Document getDocument(Long documentId);
}
