package com.cargoconnect.controller;

import com.cargoconnect.dto.*;
import com.cargoconnect.model.SupportSetting;
import com.cargoconnect.service.SupportContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class SupportContactController {

    @Autowired
    private SupportContactService supportContactService;

    // ================= PUBLIC / AUTHENTICATED ENDPOINTS =================

    // 1. Get published active support contacts and support email
    @GetMapping({"/support/contacts", "/support/contact"})
    public ResponseEntity<SupportContactsResponseDto> getPublishedContacts() {
        return ResponseEntity.ok(supportContactService.getPublishedSupportContacts());
    }

    // ================= ADMIN MANAGEMENT ENDPOINTS =================

    // 2. Admin get all support contacts (active & inactive) and email
    @GetMapping({"/admin/support/contacts", "/admin/support/contact"})
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<SupportContactsResponseDto> getAdminContacts() {
        return ResponseEntity.ok(supportContactService.getAdminSupportContacts());
    }

    // 3. Admin add new support contact
    @PostMapping("/admin/support/contacts")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<SupportContactDto> addSupportContact(
            @Valid @RequestBody SupportContactRequest request,
            Authentication authentication) {
        String adminUser = authentication != null ? authentication.getName() : "admin";
        return ResponseEntity.ok(supportContactService.addSupportContact(request, adminUser));
    }

    // 4. Admin update / replace / toggle support contact
    @PutMapping("/admin/support/contacts/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<SupportContactDto> updateSupportContact(
            @PathVariable Long id,
            @Valid @RequestBody SupportContactRequest request,
            Authentication authentication) {
        String adminUser = authentication != null ? authentication.getName() : "admin";
        return ResponseEntity.ok(supportContactService.updateSupportContact(id, request, adminUser));
    }

    // 5. Admin delete support contact (enforces >= 2 active numbers rule)
    @DeleteMapping("/admin/support/contacts/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<?> deleteSupportContact(
            @PathVariable Long id,
            Authentication authentication) {
        String adminUser = authentication != null ? authentication.getName() : "admin";
        supportContactService.deleteSupportContact(id, adminUser);
        return ResponseEntity.ok(Map.of("message", "Support contact deleted successfully.", "deletedId", id));
    }

    // 6. Admin update support email
    @PutMapping("/admin/support/email")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<SupportSetting> updateSupportEmail(
            @Valid @RequestBody SupportEmailUpdateRequest request,
            Authentication authentication) {
        String adminUser = authentication != null ? authentication.getName() : "admin";
        return ResponseEntity.ok(supportContactService.updateSupportEmail(request, adminUser));
    }

    // 7. Legacy batch update endpoint
    @PutMapping("/admin/support/contact")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<SupportSetting> updateContactsLegacy(
            @Valid @RequestBody SupportSettingRequest request,
            Authentication authentication) {
        String adminUser = authentication != null ? authentication.getName() : "admin";
        return ResponseEntity.ok(supportContactService.updateSupportContacts(request, adminUser));
    }

    // 8. Admin update company profile and office information
    @PutMapping({"/admin/support/company-info", "/admin/support/info"})
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<SupportSetting> updateCompanyInfo(
            @Valid @RequestBody SupportCompanyInfoRequest request,
            Authentication authentication) {
        String adminUser = authentication != null ? authentication.getName() : "admin";
        return ResponseEntity.ok(supportContactService.updateCompanyInfo(request, adminUser));
    }
}
