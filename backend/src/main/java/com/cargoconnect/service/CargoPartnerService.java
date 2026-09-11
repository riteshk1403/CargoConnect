package com.cargoconnect.service;

import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.CargoPartner;
import com.cargoconnect.model.Driver;
import com.cargoconnect.model.Vehicle;
import com.cargoconnect.repository.CargoPartnerRepository;
import com.cargoconnect.repository.DriverRepository;
import com.cargoconnect.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CargoPartnerService {
    @Autowired
    private CargoPartnerRepository cargoPartnerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DocumentService documentService;

    @Autowired
    private AuditLogService auditLogService;

    public List<CargoPartner> getAllPartners() {
        return cargoPartnerRepository.findAll();
    }

    public CargoPartner getPartnerById(Long id) {
        return cargoPartnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo Partner not found with id: " + id));
    }

    public CargoPartner createPartner(CargoPartner partner) {
        if (cargoPartnerRepository.findByEmail(partner.getEmail()).isPresent()) {
            throw new BadRequestException("Email already registered for a Cargo Partner.");
        }
        CargoPartner saved = cargoPartnerRepository.save(partner);
        auditLogService.log("system", "ROLE_ADMIN", "PARTNER_REGISTERED", "CARGO_PARTNER",
                String.valueOf(saved.getId()), "Cargo partner company registered: " + saved.getCompanyName());
        return saved;
    }

    public CargoPartner updatePartner(Long id, CargoPartner req) {
        CargoPartner partner = getPartnerById(id);
        partner.setCompanyName(req.getCompanyName());
        partner.setOwnerName(req.getOwnerName());
        partner.setPhone(req.getPhone());
        partner.setAddress(req.getAddress());
        partner.setCity(req.getCity());
        if (req.getLatitude() != null) partner.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) partner.setLongitude(req.getLongitude());
        if (req.getStatus() != null) partner.setStatus(req.getStatus());
        return cargoPartnerRepository.save(partner);
    }

    public CargoPartner verifyPartner(Long id, CargoPartner.VerificationStatus status, String reason, String admin) {
        CargoPartner partner = getPartnerById(id);
        partner.setVerificationStatus(status);
        partner.setRejectionReason(reason);
        CargoPartner saved = cargoPartnerRepository.save(partner);
        auditLogService.log(admin, "ROLE_ADMIN", "PARTNER_VERIFIED", "CARGO_PARTNER",
                String.valueOf(saved.getId()), "Partner status updated to " + status + ". Reason: " + reason);
        return saved;
    }

    // ================= FLEET MANAGEMENT =================
    public List<Vehicle> getPartnerVehicles(Long partnerId) {
        return vehicleRepository.findByCargoPartnerId(partnerId);
    }

    public Vehicle addVehicle(Long partnerId, Vehicle vehicle) {
        getPartnerById(partnerId); // Validate partner exists
        vehicle.setCargoPartnerId(partnerId);
        if (vehicleRepository.findByVehicleNumber(vehicle.getVehicleNumber()).isPresent()) {
            throw new BadRequestException("Vehicle number already registered.");
        }
        Vehicle saved = vehicleRepository.save(vehicle);
        auditLogService.log("partner-" + partnerId, "ROLE_CARGO_PARTNER", "VEHICLE_ADDED",
                "VEHICLE", String.valueOf(saved.getId()), "Vehicle added to fleet: " + saved.getVehicleNumber());
        return saved;
    }

    public Vehicle updateVehicle(Long partnerId, Long vehicleId, Vehicle req) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));
        if (!partnerId.equals(vehicle.getCargoPartnerId())) {
            throw new BadRequestException("Vehicle does not belong to this Cargo Partner.");
        }
        vehicle.setType(req.getType());
        vehicle.setCapacity(req.getCapacity());
        if (req.getStatus() != null) vehicle.setStatus(req.getStatus());
        if (req.getLatitude() != null) vehicle.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) vehicle.setLongitude(req.getLongitude());
        return vehicleRepository.save(vehicle);
    }

    // ================= DRIVER MANAGEMENT =================
    public List<Driver> getPartnerDrivers(Long partnerId) {
        return driverRepository.findByCargoPartnerId(partnerId);
    }

    public Driver addDriver(Long partnerId, Driver driver) {
        getPartnerById(partnerId); // Validate partner exists
        driver.setCargoPartnerId(partnerId);
        if (driverRepository.findByLicenseNumber(driver.getLicenseNumber()).isPresent()) {
            throw new BadRequestException("Driver license number already registered.");
        }
        Driver saved = driverRepository.save(driver);
        auditLogService.log("partner-" + partnerId, "ROLE_CARGO_PARTNER", "DRIVER_ADDED",
                "DRIVER", String.valueOf(saved.getId()), "Driver registered under partner: " + saved.getName());
        return saved;
    }

    public Driver updateDriver(Long partnerId, Long driverId, Driver req) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        if (!partnerId.equals(driver.getCargoPartnerId())) {
            throw new BadRequestException("Driver does not belong to this Cargo Partner.");
        }
        driver.setName(req.getName());
        driver.setPhone(req.getPhone());
        driver.setLicenseExpiryDate(req.getLicenseExpiryDate());
        if (req.getStatus() != null) driver.setStatus(req.getStatus());
        return driverRepository.save(driver);
    }
}
