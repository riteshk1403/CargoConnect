package com.cargoconnect.controller;

import com.cargoconnect.dto.DocumentUploadRequest;
import com.cargoconnect.dto.DocumentVerifyRequest;
import com.cargoconnect.model.DocumentEntity;
import com.cargoconnect.model.DocumentEntity.EntityType;
import com.cargoconnect.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentEntity> uploadDocument(
            @Valid @RequestBody DocumentUploadRequest request,
            Authentication auth) {
        String username = auth != null ? auth.getName() : "user";
        return ResponseEntity.ok(documentService.uploadDocument(request, username));
    }

    @GetMapping
    public ResponseEntity<List<DocumentEntity>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<DocumentEntity>> getPendingDocuments() {
        return ResponseEntity.ok(documentService.getPendingDocuments());
    }

    @GetMapping("/entity/{type}/{id}")
    public ResponseEntity<List<DocumentEntity>> getDocumentsByEntity(
            @PathVariable("type") EntityType type,
            @PathVariable("id") Long id) {
        return ResponseEntity.ok(documentService.getDocumentsByEntity(type, id));
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<DocumentEntity> verifyDocument(
            @PathVariable Long id,
            @Valid @RequestBody DocumentVerifyRequest request,
            Authentication auth) {
        String adminUser = auth != null ? auth.getName() : "admin";
        return ResponseEntity.ok(documentService.verifyDocument(id, request.getStatus(), request.getRejectionReason(), adminUser));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<DocumentEntity> rejectDocument(
            @PathVariable Long id,
            @RequestBody(required = false) DocumentVerifyRequest request,
            Authentication auth) {
        String adminUser = auth != null ? auth.getName() : "admin";
        String reason = request != null ? request.getRejectionReason() : "Document rejected by compliance officer";
        return ResponseEntity.ok(documentService.verifyDocument(id, DocumentEntity.Status.REJECTED, reason, adminUser));
    }
}
