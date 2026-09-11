package com.cargoconnect.service;

import com.cargoconnect.dto.DocumentUploadRequest;
import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.DocumentEntity;
import com.cargoconnect.model.DocumentEntity.DocumentType;
import com.cargoconnect.model.DocumentEntity.EntityType;
import com.cargoconnect.model.DocumentEntity.Status;
import com.cargoconnect.model.Driver;
import com.cargoconnect.model.Vehicle;
import com.cargoconnect.repository.DocumentRepository;
import com.cargoconnect.repository.DriverRepository;
import com.cargoconnect.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {
    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    public DocumentEntity uploadDocument(DocumentUploadRequest request, String username) {
        Optional<DocumentEntity> existing = documentRepository.findByEntityTypeAndEntityIdAndDocumentType(
                request.getEntityType(), request.getEntityId(), request.getDocumentType());

        DocumentEntity doc;
        if (existing.isPresent()) {
            doc = existing.get();
            doc.setFileName(request.getFileName());
            if (request.getFileData() != null) {
                doc.setFileData(request.getFileData());
            }
            doc.setExpiryDate(request.getExpiryDate());
            doc.setStatus(Status.PENDING);
            doc.setRejectionReason(null);
            doc.setUploadedAt(LocalDateTime.now());
        } else {
            doc = DocumentEntity.builder()
                    .entityType(request.getEntityType())
                    .entityId(request.getEntityId())
                    .documentType(request.getDocumentType())
                    .fileName(request.getFileName())
                    .fileData(request.getFileData())
                    .expiryDate(request.getExpiryDate())
                    .status(Status.PENDING)
                    .uploadedAt(LocalDateTime.now())
                    .build();
        }

        doc = documentRepository.save(doc);

        auditLogService.log(username, "USER", "DOCUMENT_UPLOADED", request.getEntityType().name(),
                String.valueOf(request.getEntityId()), "Uploaded " + request.getDocumentType().name());

        return doc;
    }

    public List<DocumentEntity> getDocumentsByEntity(EntityType entityType, Long entityId) {
        return documentRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    public List<DocumentEntity> getPendingDocuments() {
        return documentRepository.findByStatus(Status.PENDING);
    }

    public List<DocumentEntity> getAllDocuments() {
        return documentRepository.findAll();
    }

    public DocumentEntity verifyDocument(Long documentId, Status status, String rejectionReason, String verifiedBy) {
        DocumentEntity doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        doc.setStatus(status);
        doc.setRejectionReason(status == Status.REJECTED ? rejectionReason : null);
        doc.setVerifiedAt(LocalDateTime.now());
        doc.setVerifiedBy(verifiedBy);
        doc = documentRepository.save(doc);

        // Update Entity verification status based on all compliance documents
        if (doc.getEntityType() == EntityType.DRIVER) {
            updateDriverComplianceStatus(doc.getEntityId());
        } else if (doc.getEntityType() == EntityType.VEHICLE) {
            updateVehicleComplianceStatus(doc.getEntityId());
        }

        auditLogService.log(verifiedBy, "ADMIN", "DOCUMENT_" + status.name(), doc.getEntityType().name(),
                String.valueOf(doc.getEntityId()), "Document " + doc.getDocumentType().name() + " was " + status.name());

        return doc;
    }

    private void updateDriverComplianceStatus(Long driverId) {
        Driver driver = driverRepository.findById(driverId).orElse(null);
        if (driver == null) return;

        List<DocumentEntity> docs = documentRepository.findByEntityTypeAndEntityId(EntityType.DRIVER, driverId);
        Optional<DocumentEntity> licenseDoc = docs.stream()
                .filter(d -> d.getDocumentType() == DocumentType.DRIVING_LICENSE)
                .findFirst();

        if (licenseDoc.isPresent()) {
            DocumentEntity d = licenseDoc.get();
            if (d.getStatus() == Status.VERIFIED) {
                if (d.getExpiryDate() != null && d.getExpiryDate().isBefore(LocalDate.now())) {
                    driver.setVerificationStatus(Driver.VerificationStatus.EXPIRED);
                    driver.setRejectionReason("Driving license has expired");
                } else {
                    driver.setVerificationStatus(Driver.VerificationStatus.VERIFIED);
                    driver.setRejectionReason(null);
                }
            } else if (d.getStatus() == Status.REJECTED) {
                driver.setVerificationStatus(Driver.VerificationStatus.REJECTED);
                driver.setRejectionReason(d.getRejectionReason());
            } else {
                driver.setVerificationStatus(Driver.VerificationStatus.PENDING);
            }
        } else {
            driver.setVerificationStatus(Driver.VerificationStatus.PENDING);
        }

        driverRepository.save(driver);
    }

    private void updateVehicleComplianceStatus(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);
        if (vehicle == null) return;

        List<DocumentEntity> docs = documentRepository.findByEntityTypeAndEntityId(EntityType.VEHICLE, vehicleId);
        boolean hasRc = docs.stream().anyMatch(d -> d.getDocumentType() == DocumentType.RC && d.getStatus() == Status.VERIFIED && (d.getExpiryDate() == null || !d.getExpiryDate().isBefore(LocalDate.now())));
        boolean hasInsurance = docs.stream().anyMatch(d -> d.getDocumentType() == DocumentType.INSURANCE && d.getStatus() == Status.VERIFIED && (d.getExpiryDate() == null || !d.getExpiryDate().isBefore(LocalDate.now())));
        boolean hasFitness = docs.stream().anyMatch(d -> d.getDocumentType() == DocumentType.FITNESS_CERTIFICATE && d.getStatus() == Status.VERIFIED && (d.getExpiryDate() == null || !d.getExpiryDate().isBefore(LocalDate.now())));
        boolean hasPermit = docs.stream().anyMatch(d -> d.getDocumentType() == DocumentType.PERMIT && d.getStatus() == Status.VERIFIED && (d.getExpiryDate() == null || !d.getExpiryDate().isBefore(LocalDate.now())));

        boolean anyRejected = docs.stream().anyMatch(d -> d.getStatus() == Status.REJECTED);
        boolean anyExpired = docs.stream().anyMatch(d -> d.getExpiryDate() != null && d.getExpiryDate().isBefore(LocalDate.now()));

        if (anyRejected) {
            vehicle.setVerificationStatus(Vehicle.VerificationStatus.REJECTED);
            vehicle.setRejectionReason("One or more compliance documents were rejected");
        } else if (anyExpired) {
            vehicle.setVerificationStatus(Vehicle.VerificationStatus.EXPIRED);
            vehicle.setRejectionReason("One or more compliance documents have expired");
        } else if (hasRc && hasInsurance && hasFitness && hasPermit) {
            vehicle.setVerificationStatus(Vehicle.VerificationStatus.VERIFIED);
            vehicle.setRejectionReason(null);
        } else {
            vehicle.setVerificationStatus(Vehicle.VerificationStatus.PENDING);
        }

        vehicleRepository.save(vehicle);
    }

    public boolean isDriverEligibleForAssignment(Long driverId, StringBuilder reasonOut) {
        if (driverId == null) {
            if (reasonOut != null) reasonOut.append("No driver selected");
            return false;
        }
        Driver driver = driverRepository.findById(driverId).orElse(null);
        if (driver == null) {
            if (reasonOut != null) reasonOut.append("Driver not found");
            return false;
        }
        if (driver.getStatus() != Driver.Status.AVAILABLE) {
            if (reasonOut != null) reasonOut.append("Driver is currently " + driver.getStatus().name());
            return false;
        }
        if (driver.getVerificationStatus() != Driver.VerificationStatus.VERIFIED) {
            if (reasonOut != null) reasonOut.append("Driver document verification is " + driver.getVerificationStatus().name() + (driver.getRejectionReason() != null ? " (" + driver.getRejectionReason() + ")" : ""));
            return false;
        }
        return true;
    }

    public boolean isVehicleEligibleForAssignment(Long vehicleId, Double cargoWeight, StringBuilder reasonOut) {
        if (vehicleId == null) {
            if (reasonOut != null) reasonOut.append("No vehicle selected");
            return false;
        }
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);
        if (vehicle == null) {
            if (reasonOut != null) reasonOut.append("Vehicle not found");
            return false;
        }
        if (vehicle.getStatus() != Vehicle.Status.AVAILABLE) {
            if (reasonOut != null) reasonOut.append("Vehicle is currently " + vehicle.getStatus().name());
            return false;
        }
        if (vehicle.getVerificationStatus() != Vehicle.VerificationStatus.VERIFIED) {
            if (reasonOut != null) reasonOut.append("Vehicle compliance verification is " + vehicle.getVerificationStatus().name() + (vehicle.getRejectionReason() != null ? " (" + vehicle.getRejectionReason() + ")" : ""));
            return false;
        }
        if (cargoWeight != null && vehicle.getRemainingCapacity() < cargoWeight) {
            if (reasonOut != null) reasonOut.append("Insufficient capacity: Vehicle remaining capacity is " + vehicle.getRemainingCapacity() + " kg (Cargo requires " + cargoWeight + " kg)");
            return false;
        }
        return true;
    }
}
