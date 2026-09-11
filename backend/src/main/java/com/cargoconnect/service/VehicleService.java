package com.cargoconnect.service;

import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.Vehicle;
import com.cargoconnect.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {
    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle updated) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setVehicleNumber(updated.getVehicleNumber());
        vehicle.setType(updated.getType());
        if (updated.getCapacity() != null) vehicle.setCapacity(updated.getCapacity());
        if (updated.getLatitude() != null) vehicle.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) vehicle.setLongitude(updated.getLongitude());
        if (updated.getStatus() != null) vehicle.setStatus(updated.getStatus());
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
