package com.cargoconnect.service;

import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.Driver;
import com.cargoconnect.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {
    @Autowired
    private DriverRepository driverRepository;

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
    }

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public Driver updateDriver(Long id, Driver updated) {
        Driver driver = getDriverById(id);
        driver.setName(updated.getName());
        driver.setPhone(updated.getPhone());
        driver.setLicenseNumber(updated.getLicenseNumber());
        driver.setLicenseExpiryDate(updated.getLicenseExpiryDate());
        if (updated.getStatus() != null) driver.setStatus(updated.getStatus());
        if (updated.getLatitude() != null) driver.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) driver.setLongitude(updated.getLongitude());
        return driverRepository.save(driver);
    }

    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }
}
