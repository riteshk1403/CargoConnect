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
}
