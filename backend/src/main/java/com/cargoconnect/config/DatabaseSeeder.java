package com.cargoconnect.config;

import com.cargoconnect.model.*;
import com.cargoconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CargoPartnerRepository cargoPartnerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private CommissionSettingRepository commissionSettingRepository;

    @Autowired
    private CommissionSettlementRepository commissionSettlementRepository;

    @Autowired
    private SupportSettingRepository supportSettingRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("[CARGOCONNECT DB] Initializing / Updating B2B Cargo Partner Marketplace data in MySQL...");

        // 1. Support Settings (Mandatory 2+ active phone numbers)
        if (supportSettingRepository.count() == 0) {
            SupportSetting support = SupportSetting.builder()
                    .primaryPhone("+91 98220 11223")
                    .secondaryPhone("+91 98220 44556")
                    .supportEmail("support@cargoconnect.com")
                    .primaryActive(true)
                    .secondaryActive(true)
                    .isActive(true)
                    .updatedBy("admin")
                    .updatedAt(LocalDateTime.now())
                    .build();
            supportSettingRepository.save(support);
        }

        // 2. Commission Setting (Global 10%)
        if (commissionSettingRepository.count() == 0) {
            CommissionSetting comm = CommissionSetting.builder()
                    .commissionType(CommissionSetting.CommissionType.PERCENTAGE)
                    .commissionRate(10.0)
                    .updatedBy("admin")
                    .updatedAt(LocalDateTime.now())
                    .build();
            commissionSettingRepository.save(comm);
        }

        // 2. Customers / Shippers
        Customer customer1 = customerRepository.findByEmail("shipper@apexlogix.com").orElse(null);
        if (customer1 == null) {
            customer1 = Customer.builder()
                    .name("Vikram Mehta")
                    .email("shipper@apexlogix.com")
                    .phone("+91 98765 43210")
                    .companyName("Apex Global Logix Pvt Ltd")
                    .address("Pashan-Sus Road, Pune, Maharashtra 411021")
                    .isCorporate(true)
                    .creditLimit(150000.0)
                    .outstandingBalance(0.0)
                    .build();
            customer1 = customerRepository.save(customer1);
        }

        Customer customer2 = customerRepository.findByEmail("customer@indiacargo.com").orElse(null);
        if (customer2 == null) {
            customer2 = Customer.builder()
                    .name("Ananya Sharma")
                    .email("customer@indiacargo.com")
                    .phone("+91 98220 99887")
                    .companyName("Sharma Manufacturing Hub")
                    .address("Baner IT Park, Pune, Maharashtra 411045")
                    .isCorporate(false)
                    .creditLimit(50000.0)
                    .outstandingBalance(0.0)
                    .build();
            customer2 = customerRepository.save(customer2);
        }

        // 3. Cargo Partners (Fleet Owners) in Pune Territory
        CargoPartner partner1 = cargoPartnerRepository.findByEmail("partner1@mahalaxmi.com").orElse(null);
        if (partner1 == null) {
            partner1 = CargoPartner.builder()
                    .companyName("Mahalaxmi Freight Carriers")
                    .ownerName("Rajesh Patil")
                    .email("partner1@mahalaxmi.com")
                    .phone("+91 98220 11223")
                    .address("Plot 42, Pashan Industrial Area, Pune")
                    .city("Pune")
                    .latitude(18.5362)
                    .longitude(73.7929)
                    .rating(4.9)
                    .totalTrips(128)
                    .verificationStatus(CargoPartner.VerificationStatus.VERIFIED)
                    .status(CargoPartner.Status.ACTIVE)
                    .build();
            partner1 = cargoPartnerRepository.save(partner1);
        }

        CargoPartner partner2 = cargoPartnerRepository.findByEmail("partner2@punesupercargo.com").orElse(null);
        if (partner2 == null) {
            partner2 = CargoPartner.builder()
                    .companyName("Pune SuperCargo Logistics")
                    .ownerName("Sanjay Deshmukh")
                    .email("partner2@punesupercargo.com")
                    .phone("+91 98221 33445")
                    .address("Sector 7, Baner-Balewadi Road, Pune")
                    .city("Pune")
                    .latitude(18.5590)
                    .longitude(73.7868)
                    .rating(4.8)
                    .totalTrips(94)
                    .verificationStatus(CargoPartner.VerificationStatus.VERIFIED)
                    .status(CargoPartner.Status.ACTIVE)
                    .build();
            partner2 = cargoPartnerRepository.save(partner2);
        }

        CargoPartner partner3 = cargoPartnerRepository.findByEmail("partner3@speedway.com").orElse(null);
        if (partner3 == null) {
            partner3 = CargoPartner.builder()
                    .companyName("Speedway Fleet Solutions")
                    .ownerName("Mahesh Gaikwad")
                    .email("partner3@speedway.com")
                    .phone("+91 98222 55667")
                    .address("Kothrud Depot Road, Pune")
                    .city("Pune")
                    .latitude(18.5074)
                    .longitude(73.8077)
                    .rating(4.7)
                    .totalTrips(62)
                    .verificationStatus(CargoPartner.VerificationStatus.VERIFIED)
                    .status(CargoPartner.Status.ACTIVE)
                    .build();
            partner3 = cargoPartnerRepository.save(partner3);
        }

        // 4. Partner Fleet Vehicles
        if (vehicleRepository.count() == 0 || vehicleRepository.findByCargoPartnerId(partner1.getId()).isEmpty()) {
            Vehicle v1 = Vehicle.builder()
                    .cargoPartnerId(partner1.getId())
                    .vehicleNumber("MH-12-QX-4010")
                    .type("14 FT Truck")
                    .capacity(3500.0)
                    .usedCapacity(0.0)
                    .status(Vehicle.Status.AVAILABLE)
                    .verificationStatus(Vehicle.VerificationStatus.VERIFIED)
                    .latitude(18.5362)
                    .longitude(73.7929)
                    .build();
            vehicleRepository.save(v1);

            Vehicle v2 = Vehicle.builder()
                    .cargoPartnerId(partner1.getId())
                    .vehicleNumber("MH-12-QX-4020")
                    .type("Tata Ace")
                    .capacity(1200.0)
                    .usedCapacity(0.0)
                    .status(Vehicle.Status.AVAILABLE)
                    .verificationStatus(Vehicle.VerificationStatus.VERIFIED)
                    .latitude(18.5370)
                    .longitude(73.7940)
                    .build();
            vehicleRepository.save(v2);

            Vehicle v3 = Vehicle.builder()
                    .cargoPartnerId(partner2.getId())
                    .vehicleNumber("MH-14-BT-8890")
                    .type("17 FT Heavy Truck")
                    .capacity(5000.0)
                    .usedCapacity(0.0)
                    .status(Vehicle.Status.AVAILABLE)
                    .verificationStatus(Vehicle.VerificationStatus.VERIFIED)
                    .latitude(18.5590)
                    .longitude(73.7868)
                    .build();
            vehicleRepository.save(v3);

            Vehicle v4 = Vehicle.builder()
                    .cargoPartnerId(partner3.getId())
                    .vehicleNumber("MH-12-LK-2211")
                    .type("20 FT Container")
                    .capacity(8000.0)
                    .usedCapacity(0.0)
                    .status(Vehicle.Status.AVAILABLE)
                    .verificationStatus(Vehicle.VerificationStatus.VERIFIED)
                    .latitude(18.5074)
                    .longitude(73.8077)
                    .build();
            vehicleRepository.save(v4);
        }

        // 5. Partner Drivers
        Driver d1 = driverRepository.findByPhone("+91 98901 11223").orElse(null);
        if (d1 == null) {
            d1 = Driver.builder()
                    .cargoPartnerId(partner1.getId())
                    .name("Rahul Shinde")
                    .licenseNumber("DL-MH-102948")
                    .licenseExpiryDate(LocalDate.now().plusYears(3))
                    .phone("+91 98901 11223")
                    .status(Driver.Status.AVAILABLE)
                    .verificationStatus(Driver.VerificationStatus.VERIFIED)
                    .latitude(18.5362)
                    .longitude(73.7929)
                    .rating(4.9)
                    .totalDeliveries(94)
                    .build();
            d1 = driverRepository.save(d1);
        }

        Driver d2 = driverRepository.findByPhone("+91 98902 22334").orElse(null);
        if (d2 == null) {
            d2 = Driver.builder()
                    .cargoPartnerId(partner1.getId())
                    .name("Amit Kulkarni")
                    .licenseNumber("DL-MH-123456")
                    .licenseExpiryDate(LocalDate.now().plusYears(2))
                    .phone("+91 98902 22334")
                    .status(Driver.Status.AVAILABLE)
                    .verificationStatus(Driver.VerificationStatus.VERIFIED)
                    .latitude(18.5380)
                    .longitude(73.7950)
                    .rating(4.8)
                    .totalDeliveries(34)
                    .build();
            d2 = driverRepository.save(d2);
        }

        Driver d3 = driverRepository.findByPhone("+91 98903 33445").orElse(null);
        if (d3 == null) {
            d3 = Driver.builder()
                    .cargoPartnerId(partner2.getId())
                    .name("Suresh Patil")
                    .licenseNumber("DL-MH-149921")
                    .licenseExpiryDate(LocalDate.now().plusYears(4))
                    .phone("+91 98903 33445")
                    .status(Driver.Status.AVAILABLE)
                    .verificationStatus(Driver.VerificationStatus.VERIFIED)
                    .latitude(18.5590)
                    .longitude(73.7868)
                    .rating(4.8)
                    .totalDeliveries(86)
                    .build();
            d3 = driverRepository.save(d3);
        }

        Driver d4 = driverRepository.findByPhone("+91 98904 44556").orElse(null);
        if (d4 == null) {
            d4 = Driver.builder()
                    .cargoPartnerId(partner3.getId())
                    .name("Ramesh Jadhav")
                    .licenseNumber("DL-MH-128833")
                    .licenseExpiryDate(LocalDate.now().plusYears(3))
                    .phone("+91 98904 44556")
                    .status(Driver.Status.AVAILABLE)
                    .verificationStatus(Driver.VerificationStatus.VERIFIED)
                    .latitude(18.5074)
                    .longitude(73.8077)
                    .rating(4.7)
                    .totalDeliveries(45)
                    .build();
            d4 = driverRepository.save(d4);
        }

        // 6. Users (Admin, Shipper, Partners)
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@cargoconnect.com")
                    .password(encoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .emailVerified(true)
                    .active(true)
                    .build());
        }

        if (userRepository.findByUsername("employee").isEmpty()) {
            userRepository.save(User.builder()
                    .username("employee")
                    .email("employee@cargoconnect.com")
                    .password(encoder.encode("employee123"))
                    .role(Role.ROLE_EMPLOYEE)
                    .emailVerified(true)
                    .active(true)
                    .build());
        }

        if (userRepository.findByUsername("partner1").isEmpty()) {
            userRepository.save(User.builder()
                    .username("partner1")
                    .email("partner1@mahalaxmi.com")
                    .password(encoder.encode("partner123"))
                    .role(Role.ROLE_CARGO_PARTNER)
                    .cargoPartnerId(partner1.getId())
                    .emailVerified(true)
                    .active(true)
                    .build());
        }

        if (userRepository.findByUsername("partner2").isEmpty()) {
            userRepository.save(User.builder()
                    .username("partner2")
                    .email("partner2@punesupercargo.com")
                    .password(encoder.encode("partner123"))
                    .role(Role.ROLE_CARGO_PARTNER)
                    .cargoPartnerId(partner2.getId())
                    .emailVerified(true)
                    .active(true)
                    .build());
        }

        if (userRepository.findByUsername("partner3").isEmpty()) {
            userRepository.save(User.builder()
                    .username("partner3")
                    .email("partner3@speedway.com")
                    .password(encoder.encode("partner123"))
                    .role(Role.ROLE_CARGO_PARTNER)
                    .cargoPartnerId(partner3.getId())
                    .emailVerified(true)
                    .active(true)
                    .build());
        }

        System.out.println("[CARGOCONNECT DB] Seeding completed successfully. Ready for B2B Cargo Partner marketplace operations.");
    }
}
