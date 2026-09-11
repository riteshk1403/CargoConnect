package com.cargoconnect.service;

import com.cargoconnect.dto.*;
import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.SupportContact;
import com.cargoconnect.model.SupportSetting;
import com.cargoconnect.repository.SupportContactRepository;
import com.cargoconnect.repository.SupportSettingRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportContactService {

    @Autowired
    private SupportContactRepository supportContactRepository;

    @Autowired
    private SupportSettingRepository supportSettingRepository;

    @Autowired
    private AuditLogService auditLogService;

    @PostConstruct
    public void initDefaults() {
        initDefaultDataIfEmpty();
    }

    // 1. Initialize default records if database is empty
    @Transactional
    public synchronized void initDefaultDataIfEmpty() {
        if (supportContactRepository.count() == 0) {
            SupportContact c1 = SupportContact.builder()
                    .label("Primary Support Number")
                    .phoneNumber("+91 98220 11223")
                    .isActive(true)
                    .displayOrder(1)
                    .build();

            SupportContact c2 = SupportContact.builder()
                    .label("Secondary Support Number")
                    .phoneNumber("+91 98220 44556")
                    .isActive(true)
                    .displayOrder(2)
                    .build();

            SupportContact c3 = SupportContact.builder()
                    .label("Emergency Operations & Dispatch")
                    .phoneNumber("+91 98220 77889")
                    .isActive(true)
                    .displayOrder(3)
                    .build();

            supportContactRepository.saveAll(List.of(c1, c2, c3));
        }

        if (supportSettingRepository.count() == 0) {
            SupportSetting def = SupportSetting.builder()
                    .companyName("CargoConnect")
                    .companyTagline("B2B Logistics & Fleet Management")
                    .companyDescription("Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.")
                    .officeAddress("CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India")
                    .supportHours("Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)")
                    .primaryPhone("+91 98220 11223")
                    .secondaryPhone("+91 98220 44556")
                    .supportEmail("support@cargoconnect.com")
                    .primaryActive(true)
                    .secondaryActive(true)
                    .isActive(true)
                    .updatedBy("system")
                    .build();
            supportSettingRepository.save(def);
        }
    }

    // 2. Fetch SupportSetting (global config)
    public SupportSetting getSupportSetting() {
        initDefaultDataIfEmpty();
        return supportSettingRepository.findTopByOrderByIdAsc()
                .orElseGet(() -> {
                    SupportSetting def = SupportSetting.builder()
                            .companyName("CargoConnect")
                            .companyTagline("B2B Logistics & Fleet Management")
                            .companyDescription("Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.")
                            .officeAddress("CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India")
                            .supportHours("Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)")
                            .primaryPhone("+91 98220 11223")
                            .secondaryPhone("+91 98220 44556")
                            .supportEmail("support@cargoconnect.com")
                            .primaryActive(true)
                            .secondaryActive(true)
                            .isActive(true)
                            .updatedBy("system")
                            .build();
                    return supportSettingRepository.save(def);
                });
    }

    // 3. Public read endpoint for Shippers & Cargo Partners (Active contacts only)
    public SupportContactsResponseDto getPublishedSupportContacts() {
        initDefaultDataIfEmpty();
        List<SupportContact> activeContacts = supportContactRepository.findByIsActiveTrueOrderByDisplayOrderAscIdAsc();
        SupportSetting setting = getSupportSetting();

        List<SupportContactDto> dtos = activeContacts.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        String primary = !activeContacts.isEmpty() ? activeContacts.get(0).getPhoneNumber() : setting.getPrimaryPhone();
        String secondary = activeContacts.size() > 1 ? activeContacts.get(1).getPhoneNumber() : setting.getSecondaryPhone();

        return SupportContactsResponseDto.builder()
                .companyName(setting.getCompanyName() != null ? setting.getCompanyName() : "CargoConnect")
                .companyTagline(setting.getCompanyTagline() != null ? setting.getCompanyTagline() : "B2B Logistics & Fleet Management")
                .companyDescription(setting.getCompanyDescription() != null ? setting.getCompanyDescription() : "Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.")
                .officeAddress(setting.getOfficeAddress() != null ? setting.getOfficeAddress() : "CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India")
                .supportHours(setting.getSupportHours() != null ? setting.getSupportHours() : "Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)")
                .upiId(setting.getUpiId() != null ? setting.getUpiId() : "cargoconnect@icici")
                .upiHolderName(setting.getUpiHolderName() != null ? setting.getUpiHolderName() : "CargoConnect Technologies Pvt Ltd")
                .bankAccountNumber(setting.getBankAccountNumber() != null ? setting.getBankAccountNumber() : "002405012345")
                .bankIfsc(setting.getBankIfsc() != null ? setting.getBankIfsc() : "ICIC0000024")
                .bankName(setting.getBankName() != null ? setting.getBankName() : "ICICI Bank Ltd")
                .supportEmail(setting.getSupportEmail())
                .contacts(dtos)
                .totalActiveContacts(activeContacts.size())
                .primaryPhone(primary)
                .secondaryPhone(secondary)
                .primaryActive(true)
                .secondaryActive(activeContacts.size() > 1)
                .isActive(true)
                .updatedAt(setting.getUpdatedAt())
                .build();
    }

    // 4. Admin read endpoint (Returns all contacts: active & inactive + settings)
    public SupportContactsResponseDto getAdminSupportContacts() {
        initDefaultDataIfEmpty();
        List<SupportContact> allContacts = supportContactRepository.findAllByOrderByDisplayOrderAscIdAsc();
        long activeCount = supportContactRepository.countByIsActiveTrue();
        SupportSetting setting = getSupportSetting();

        List<SupportContactDto> dtos = allContacts.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return SupportContactsResponseDto.builder()
                .companyName(setting.getCompanyName() != null ? setting.getCompanyName() : "CargoConnect")
                .companyTagline(setting.getCompanyTagline() != null ? setting.getCompanyTagline() : "B2B Logistics & Fleet Management")
                .companyDescription(setting.getCompanyDescription() != null ? setting.getCompanyDescription() : "Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.")
                .officeAddress(setting.getOfficeAddress() != null ? setting.getOfficeAddress() : "CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India")
                .supportHours(setting.getSupportHours() != null ? setting.getSupportHours() : "Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)")
                .upiId(setting.getUpiId() != null ? setting.getUpiId() : "cargoconnect@icici")
                .upiHolderName(setting.getUpiHolderName() != null ? setting.getUpiHolderName() : "CargoConnect Technologies Pvt Ltd")
                .bankAccountNumber(setting.getBankAccountNumber() != null ? setting.getBankAccountNumber() : "002405012345")
                .bankIfsc(setting.getBankIfsc() != null ? setting.getBankIfsc() : "ICIC0000024")
                .bankName(setting.getBankName() != null ? setting.getBankName() : "ICICI Bank Ltd")
                .supportEmail(setting.getSupportEmail())
                .contacts(dtos)
                .totalActiveContacts(activeCount)
                .primaryPhone(setting.getPrimaryPhone())
                .secondaryPhone(setting.getSecondaryPhone())
                .primaryActive(setting.getPrimaryActive())
                .secondaryActive(setting.getSecondaryActive())
                .isActive(setting.getIsActive())
                .updatedAt(setting.getUpdatedAt())
                .build();

    }

    // 5. Add a new Support Contact
    @Transactional
    public SupportContactDto addSupportContact(SupportContactRequest request, String adminUsername) {
        if (request == null) {
            throw new BadRequestException("Support contact details cannot be empty.");
        }

        String label = request.getLabel() != null ? request.getLabel().trim() : "";
        String phone = request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : "";

        if (label.isEmpty()) {
            throw new BadRequestException("Contact label is required (e.g. Primary Support, Emergency Operations).");
        }
        if (phone.isEmpty() || phone.length() < 7) {
            throw new BadRequestException("Please enter a valid support phone number.");
        }

        String cleanPhone = phone.replaceAll("[^0-9+]", "");
        for (SupportContact existing : supportContactRepository.findAll()) {
            if (existing.getPhoneNumber().replaceAll("[^0-9+]", "").equals(cleanPhone)) {
                throw new BadRequestException("A support contact with phone number " + phone + " already exists.");
            }
        }

        int displayOrder = request.getDisplayOrder() != null && request.getDisplayOrder() > 0 
                ? request.getDisplayOrder() 
                : (int) supportContactRepository.count() + 1;

        SupportContact contact = SupportContact.builder()
                .label(label)
                .phoneNumber(phone)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .displayOrder(displayOrder)
                .build();

        SupportContact saved = supportContactRepository.save(contact);
        syncLegacySupportSetting(adminUsername);

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "SUPPORT_CONTACT_ADDED", "SUPPORT_CONTACT", String.valueOf(saved.getId()),
                "Added support contact: " + label + " (" + phone + ")");

        return mapToDto(saved);
    }

    // 6. Update / Edit / Replace a Support Contact with strict >= 2 active numbers rule
    @Transactional
    public SupportContactDto updateSupportContact(Long id, SupportContactRequest request, String adminUsername) {
        SupportContact contact = supportContactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Support contact not found with ID: " + id));

        if (request == null) {
            throw new BadRequestException("Support contact details cannot be empty.");
        }

        String label = request.getLabel() != null ? request.getLabel().trim() : "";
        String phone = request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : "";
        boolean targetActive = request.getIsActive() != null ? request.getIsActive() : contact.getIsActive();

        if (label.isEmpty()) {
            throw new BadRequestException("Contact label is required.");
        }
        if (phone.isEmpty() || phone.length() < 7) {
            throw new BadRequestException("Please enter a valid support phone number.");
        }

        // Enforce Minimum 2 Active Numbers rule on deactivation
        if (Boolean.TRUE.equals(contact.getIsActive()) && !targetActive) {
            long activeCount = supportContactRepository.countByIsActiveTrue();
            if (activeCount <= 2) {
                throw new BadRequestException("At least two active support numbers are required. Please add or activate another number before deactivating this one.");
            }
        }

        // Check duplicates if phone changed
        String cleanPhone = phone.replaceAll("[^0-9+]", "");
        for (SupportContact other : supportContactRepository.findAll()) {
            if (!other.getId().equals(id) && other.getPhoneNumber().replaceAll("[^0-9+]", "").equals(cleanPhone)) {
                throw new BadRequestException("Another support contact already has phone number " + phone);
            }
        }

        contact.setLabel(label);
        contact.setPhoneNumber(phone);
        contact.setIsActive(targetActive);
        if (request.getDisplayOrder() != null) {
            contact.setDisplayOrder(request.getDisplayOrder());
        }

        SupportContact updated = supportContactRepository.save(contact);
        syncLegacySupportSetting(adminUsername);

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "SUPPORT_CONTACT_UPDATED", "SUPPORT_CONTACT", String.valueOf(updated.getId()),
                "Updated support contact #" + id + ": " + label + " (" + phone + ") Active=" + targetActive);

        return mapToDto(updated);
    }

    // 7. Delete a Support Contact with strict >= 2 active numbers rule
    @Transactional
    public void deleteSupportContact(Long id, String adminUsername) {
        SupportContact contact = supportContactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Support contact not found with ID: " + id));

        if (Boolean.TRUE.equals(contact.getIsActive())) {
            long activeCount = supportContactRepository.countByIsActiveTrue();
            if (activeCount <= 2) {
                throw new BadRequestException("At least two active support numbers are required. Please add another number before deleting this one.");
            }
        }

        supportContactRepository.delete(contact);
        syncLegacySupportSetting(adminUsername);

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "SUPPORT_CONTACT_DELETED", "SUPPORT_CONTACT", String.valueOf(id),
                "Deleted support contact: " + contact.getLabel() + " (" + contact.getPhoneNumber() + ")");
    }

    // 8. Update Support Email
    @Transactional
    public SupportSetting updateSupportEmail(SupportEmailUpdateRequest request, String adminUsername) {
        if (request == null || request.getSupportEmail() == null || request.getSupportEmail().trim().isEmpty()) {
            throw new BadRequestException("Support email address is required.");
        }

        String email = request.getSupportEmail().trim();
        if (!email.contains("@") || !email.contains(".")) {
            throw new BadRequestException("Please provide a valid support email address.");
        }

        SupportSetting setting = getSupportSetting();
        setting.setSupportEmail(email);
        setting.setUpdatedBy(adminUsername != null ? adminUsername : "admin");
        setting.setUpdatedAt(LocalDateTime.now());

        SupportSetting saved = supportSettingRepository.save(setting);

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "SUPPORT_EMAIL_UPDATED", "SUPPORT_SETTING", String.valueOf(saved.getId()),
                "Updated support email to: " + email);

        return saved;
    }

    // 9. Legacy update endpoint for backward compatibility
    @Transactional
    public SupportSetting updateSupportContacts(SupportSettingRequest request, String adminUsername) {
        if (request == null) {
            throw new BadRequestException("Support contact details cannot be empty.");
        }

        String primary = request.getPrimaryPhone() != null ? request.getPrimaryPhone().trim() : "";
        String secondary = request.getSecondaryPhone() != null ? request.getSecondaryPhone().trim() : "";
        String email = request.getSupportEmail() != null ? request.getSupportEmail().trim() : "";

        if (primary.isEmpty() || secondary.isEmpty()) {
            throw new BadRequestException("Both primary and secondary support phone numbers are required.");
        }

        if (email.isEmpty() || !email.contains("@") || !email.contains(".")) {
            throw new BadRequestException("A valid support email address is required.");
        }

        SupportSetting setting = getSupportSetting();
        setting.setPrimaryPhone(primary);
        setting.setSecondaryPhone(secondary);
        setting.setSupportEmail(email);
        setting.setPrimaryActive(Boolean.TRUE.equals(request.getPrimaryActive()));
        setting.setSecondaryActive(Boolean.TRUE.equals(request.getSecondaryActive()));
        setting.setIsActive(true);
        setting.setUpdatedBy(adminUsername != null ? adminUsername : "admin");
        setting.setUpdatedAt(LocalDateTime.now());

        SupportSetting saved = supportSettingRepository.save(setting);

        // Also sync to support_contacts list
        List<SupportContact> contacts = supportContactRepository.findAllByOrderByDisplayOrderAscIdAsc();
        if (!contacts.isEmpty()) {
            SupportContact c0 = contacts.get(0);
            c0.setPhoneNumber(primary);
            c0.setIsActive(Boolean.TRUE.equals(request.getPrimaryActive()));
            supportContactRepository.save(c0);
        }
        if (contacts.size() > 1) {
            SupportContact c1 = contacts.get(1);
            c1.setPhoneNumber(secondary);
            c1.setIsActive(Boolean.TRUE.equals(request.getSecondaryActive()));
            supportContactRepository.save(c1);
        }

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "SUPPORT_CONTACT_UPDATED", "SUPPORT_SETTING", String.valueOf(saved.getId()),
                "Updated support contacts via batch: " + primary + ", " + secondary + ", " + email);

        return saved;
    }

    // Helper: Sync latest active contacts to SupportSetting for legacy clients
    private void syncLegacySupportSetting(String adminUsername) {
        List<SupportContact> active = supportContactRepository.findByIsActiveTrueOrderByDisplayOrderAscIdAsc();
        SupportSetting setting = getSupportSetting();
        if (!active.isEmpty()) {
            setting.setPrimaryPhone(active.get(0).getPhoneNumber());
            setting.setPrimaryActive(true);
        }
        if (active.size() > 1) {
            setting.setSecondaryPhone(active.get(1).getPhoneNumber());
            setting.setSecondaryActive(true);
        }
        setting.setUpdatedBy(adminUsername != null ? adminUsername : "admin");
        setting.setUpdatedAt(LocalDateTime.now());
        supportSettingRepository.save(setting);
    }

    // 10. Update Company Profile & Office Information
    @Transactional
    public SupportSetting updateCompanyInfo(SupportCompanyInfoRequest request, String adminUsername) {
        if (request == null) {
            throw new BadRequestException("Company profile details cannot be empty.");
        }

        String companyName = request.getCompanyName() != null ? request.getCompanyName().trim() : "CargoConnect";
        String tagline = request.getCompanyTagline() != null ? request.getCompanyTagline().trim() : "B2B Logistics & Fleet Management";
        String description = request.getCompanyDescription() != null ? request.getCompanyDescription().trim() : "";
        String address = request.getOfficeAddress() != null ? request.getOfficeAddress().trim() : "";
        String hours = request.getSupportHours() != null ? request.getSupportHours().trim() : "Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)";
        String email = request.getSupportEmail() != null ? request.getSupportEmail().trim() : null;

        if (companyName.isEmpty()) {
            throw new BadRequestException("Company name is required.");
        }
        if (address.isEmpty()) {
            throw new BadRequestException("Office address is required.");
        }
        if (hours.isEmpty()) {
            throw new BadRequestException("Support hours are required.");
        }

        SupportSetting setting = getSupportSetting();
        setting.setCompanyName(companyName);
        setting.setCompanyTagline(tagline);
        setting.setCompanyDescription(description);
        setting.setOfficeAddress(address);
        setting.setSupportHours(hours);
        if (email != null && !email.isEmpty() && email.contains("@")) {
            setting.setSupportEmail(email);
        }
        if (request.getUpiId() != null && !request.getUpiId().trim().isEmpty()) {
            setting.setUpiId(request.getUpiId().trim());
        }
        if (request.getUpiHolderName() != null && !request.getUpiHolderName().trim().isEmpty()) {
            setting.setUpiHolderName(request.getUpiHolderName().trim());
        }
        if (request.getBankAccountNumber() != null && !request.getBankAccountNumber().trim().isEmpty()) {
            setting.setBankAccountNumber(request.getBankAccountNumber().trim());
        }
        if (request.getBankIfsc() != null && !request.getBankIfsc().trim().isEmpty()) {
            setting.setBankIfsc(request.getBankIfsc().trim());
        }
        if (request.getBankName() != null && !request.getBankName().trim().isEmpty()) {
            setting.setBankName(request.getBankName().trim());
        }
        setting.setUpdatedBy(adminUsername != null ? adminUsername : "admin");
        setting.setUpdatedAt(LocalDateTime.now());

        SupportSetting saved = supportSettingRepository.save(setting);

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "COMPANY_INFO_UPDATED", "SUPPORT_SETTING", String.valueOf(saved.getId()),
                "Updated company details & UPI billing info: " + companyName + " / " + setting.getUpiId());


        return saved;
    }

    private SupportContactDto mapToDto(SupportContact contact) {
        return SupportContactDto.builder()
                .id(contact.getId())
                .label(contact.getLabel())
                .phoneNumber(contact.getPhoneNumber())
                .isActive(contact.getIsActive())
                .displayOrder(contact.getDisplayOrder())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }
}
