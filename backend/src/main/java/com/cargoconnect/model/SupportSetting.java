package com.cargoconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "primary_phone", nullable = false)
    private String primaryPhone;

    @Column(name = "secondary_phone", nullable = false)
    private String secondaryPhone;

    @Column(name = "support_email", nullable = false)
    private String supportEmail;

    @Column(name = "primary_active", nullable = false)
    @Builder.Default
    private Boolean primaryActive = true;

    @Column(name = "secondary_active", nullable = false)
    @Builder.Default
    private Boolean secondaryActive = true;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "company_name")
    @Builder.Default
    private String companyName = "CargoConnect";

    @Column(name = "company_tagline")
    @Builder.Default
    private String companyTagline = "B2B Logistics & Fleet Management";

    @Column(name = "company_description", length = 1000)
    @Builder.Default
    private String companyDescription = "Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.";

    @Column(name = "office_address", length = 500)
    @Builder.Default
    private String officeAddress = "CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India";

    @Column(name = "support_hours")
    @Builder.Default
    private String supportHours = "Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)";

    @Column(name = "upi_id")
    @Builder.Default
    private String upiId = "cargoconnect@icici";

    @Column(name = "upi_holder_name")
    @Builder.Default
    private String upiHolderName = "CargoConnect Technologies Pvt Ltd";

    @Column(name = "bank_account_number")
    @Builder.Default
    private String bankAccountNumber = "002405012345";

    @Column(name = "bank_ifsc")
    @Builder.Default
    private String bankIfsc = "ICIC0000024";

    @Column(name = "bank_name")
    @Builder.Default
    private String bankName = "ICICI Bank Ltd";

    @Column(name = "updated_by")
    @Builder.Default
    private String updatedBy = "admin";


    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (primaryActive == null) primaryActive = true;
        if (secondaryActive == null) secondaryActive = true;
        if (isActive == null) isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
