package com.cargoconnect.repository;

import com.cargoconnect.model.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    List<DocumentEntity> findByEntityTypeAndEntityId(DocumentEntity.EntityType entityType, Long entityId);
    Optional<DocumentEntity> findByEntityTypeAndEntityIdAndDocumentType(
            DocumentEntity.EntityType entityType, Long entityId, DocumentEntity.DocumentType documentType);
    List<DocumentEntity> findByStatus(DocumentEntity.Status status);
}
