package com.cargoconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Vehicle number is required")
    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    @NotBlank(message = "Model is required")
    @Column(nullable = false)
    private String model;

    @NotNull(message = "Capacity is required")
    @Column(nullable = false)
    private Double capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverAvailability availability = DriverAvailability.AVAILABLE;

    @OneToOne
    @JoinColumn(name = "driver_id", referencedColumnName = "id")
    private Driver driver;

    @OneToMany(mappedBy = "vehicle")
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();

    public Vehicle() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Double getCapacity() { return capacity; }
    public void setCapacity(Double capacity) { this.capacity = capacity; }

    public DriverAvailability getAvailability() { return availability; }
    public void setAvailability(DriverAvailability availability) { this.availability = availability; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}
