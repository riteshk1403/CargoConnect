package com.cargoconnect.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class DocumentEntity {
    public enum EntityType {
        DRIVER,
        VEHICLE
    }

    public enum DocumentType {
        DRIVING_LICENSE,
        RC,
        INSURANCE,
        FITNESS_CERTIFICATE,
        PERMIT
    }

    public enum Status {
        PENDING,
        VERIFIED,
        REJECTED,
        EXPIRED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityType entityType;

    @Column(nullable = false)
    private Long entityId; // driverId or vehicleId

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType documentType;

    private String fileName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String fileData; // Stored securely as Base64 data URI or storage path

    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
        private Status status = Status.PENDING;

    private String rejectionReason;

    private LocalDateTime uploadedAt;
    private LocalDateTime verifiedAt;
    private String verifiedBy;

    @PrePersist
    protected void onCreate() {
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
    }


    // --- Standard Constructors ---
    public DocumentEntity() {}

    public DocumentEntity(Long id, EntityType entityType, Long entityId, DocumentType documentType, String fileName, String fileData, LocalDate expiryDate, Status status, String rejectionReason, LocalDateTime uploadedAt, LocalDateTime verifiedAt, String verifiedBy) {
        this.id = id;
        this.entityType = entityType;
        this.entityId = entityId;
        this.documentType = documentType;
        this.fileName = fileName;
        this.fileData = fileData;
        this.expiryDate = expiryDate;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.uploadedAt = uploadedAt;
        this.verifiedAt = verifiedAt;
        this.verifiedBy = verifiedBy;
    }


    // --- Getters & Setters ---
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
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
    public Status getStatus() { return this.status; }
    public void setStatus(Status status) { this.status = status; }
    public String getRejectionReason() { return this.rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public LocalDateTime getUploadedAt() { return this.uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public LocalDateTime getVerifiedAt() { return this.verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
    public String getVerifiedBy() { return this.verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }


    // --- Builder Pattern ---
    public static DocumentEntityBuilder builder() {
        return new DocumentEntityBuilder();
    }

    public static class DocumentEntityBuilder {
        private Long id;
        private EntityType entityType;
        private Long entityId;
        private DocumentType documentType;
        private String fileName;
        private String fileData;
        private LocalDate expiryDate;
        private Status status;
        private String rejectionReason;
        private LocalDateTime uploadedAt;
        private LocalDateTime verifiedAt;
        private String verifiedBy;

        public DocumentEntityBuilder() {}

        public DocumentEntityBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public DocumentEntityBuilder entityType(EntityType entityType) {
            this.entityType = entityType;
            return this;
        }

        public DocumentEntityBuilder entityId(Long entityId) {
            this.entityId = entityId;
            return this;
        }

        public DocumentEntityBuilder documentType(DocumentType documentType) {
            this.documentType = documentType;
            return this;
        }

        public DocumentEntityBuilder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public DocumentEntityBuilder fileData(String fileData) {
            this.fileData = fileData;
            return this;
        }

        public DocumentEntityBuilder expiryDate(LocalDate expiryDate) {
            this.expiryDate = expiryDate;
            return this;
        }

        public DocumentEntityBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public DocumentEntityBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public DocumentEntityBuilder uploadedAt(LocalDateTime uploadedAt) {
            this.uploadedAt = uploadedAt;
            return this;
        }

        public DocumentEntityBuilder verifiedAt(LocalDateTime verifiedAt) {
            this.verifiedAt = verifiedAt;
            return this;
        }

        public DocumentEntityBuilder verifiedBy(String verifiedBy) {
            this.verifiedBy = verifiedBy;
            return this;
        }

        public DocumentEntity build() {
            DocumentEntity instance = new DocumentEntity();
            instance.id = this.id;
            instance.entityType = this.entityType;
            instance.entityId = this.entityId;
            instance.documentType = this.documentType;
            instance.fileName = this.fileName;
            instance.fileData = this.fileData;
            instance.expiryDate = this.expiryDate;
            instance.status = this.status;
            instance.rejectionReason = this.rejectionReason;
            instance.uploadedAt = this.uploadedAt;
            instance.verifiedAt = this.verifiedAt;
            instance.verifiedBy = this.verifiedBy;
            return instance;
        }
    }

}
