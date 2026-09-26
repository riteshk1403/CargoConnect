package com.cargoconnect.dto;

import com.cargoconnect.model.DocumentEntity.EntityType;
import com.cargoconnect.model.DocumentEntity.DocumentType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DocumentUploadRequest {
    @NotNull(message = "Entity type is required (DRIVER or VEHICLE)")
    private EntityType entityType;

    @NotNull(message = "Entity ID is required")
    private Long entityId;

    @NotNull(message = "Document type is required")
    private DocumentType documentType;

    private String fileName;
    private String fileData; // Base64 or URI
    private LocalDate expiryDate;


    // --- Standard Constructors ---
    public DocumentUploadRequest() {}

    public DocumentUploadRequest(EntityType entityType, Long entityId, DocumentType documentType, String fileName, String fileData, LocalDate expiryDate) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.documentType = documentType;
        this.fileName = fileName;
        this.fileData = fileData;
        this.expiryDate = expiryDate;
    }


    // --- Getters & Setters ---
    public EntityType getEntityType() { return this.entityType; }
    public void setEntityType(EntityType entityType) { this.entityType = entityType; }
    public Long getEntityId() { return this.entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    public DocumentType getDocumentType() { return this.documentType; }
    public void setDocumentType(DocumentType documentType) { this.documentType = documentType; }
    public String getFileName() { return this.fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileData() { return this.fileData; }
    public void setFileData(String fileData) { this.fileData = fileData; }
    public LocalDate getExpiryDate() { return this.expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }


    // --- Builder Pattern ---
    public static DocumentUploadRequestBuilder builder() {
        return new DocumentUploadRequestBuilder();
    }

    public static class DocumentUploadRequestBuilder {
        private EntityType entityType;
        private Long entityId;
        private DocumentType documentType;
        private String fileName;
        private String fileData;
        private LocalDate expiryDate;

        public DocumentUploadRequestBuilder() {}

        public DocumentUploadRequestBuilder entityType(EntityType entityType) {
            this.entityType = entityType;
            return this;
        }

        public DocumentUploadRequestBuilder entityId(Long entityId) {
            this.entityId = entityId;
            return this;
        }

        public DocumentUploadRequestBuilder documentType(DocumentType documentType) {
            this.documentType = documentType;
            return this;
        }

        public DocumentUploadRequestBuilder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public DocumentUploadRequestBuilder fileData(String fileData) {
            this.fileData = fileData;
            return this;
        }

        public DocumentUploadRequestBuilder expiryDate(LocalDate expiryDate) {
            this.expiryDate = expiryDate;
            return this;
        }

        public DocumentUploadRequest build() {
            DocumentUploadRequest instance = new DocumentUploadRequest();
            instance.entityType = this.entityType;
            instance.entityId = this.entityId;
            instance.documentType = this.documentType;
            instance.fileName = this.fileName;
            instance.fileData = this.fileData;
            instance.expiryDate = this.expiryDate;
            return instance;
        }
    }

}
