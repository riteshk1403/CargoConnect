package com.cargoconnect.config;

import com.cargoconnect.entity.*;
import com.cargoconnect.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Component
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, DriverRepository driverRepository,
                      VehicleRepository vehicleRepository, BookingRepository bookingRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        createAdminUser();
        createSampleData();
    }

    private void createAdminUser() {
        Optional<User> existing = userRepository.findByEmail("admin@cargoconnect.com");
        if (existing.isPresent()) {
            return;
        }

        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@cargoconnect.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setUserType(UserType.ADMIN);
        admin.setPhone("9999999999");
        userRepository.save(admin);
    }

    private void createSampleData() {
        if (userRepository.count() > 1) {
            return;
        }

        User shipper1 = createUser("Shipper One", "shipper1@cargoconnect.com", "Shipper@123", UserType.SHIPPER, "9000000001");
        User shipper2 = createUser("Shipper Two", "shipper2@cargoconnect.com", "Shipper@123", UserType.SHIPPER, "9000000002");

        User driverUser1 = createUser("Driver One", "driver1@cargoconnect.com", "Driver@123", UserType.DRIVER, "9111111111");
        User driverUser2 = createUser("Driver Two", "driver2@cargoconnect.com", "Driver@123", UserType.DRIVER, "9111111112");

        Driver driver1 = createDriver(driverUser1, "D1001", "driver1@cargoconnect.com", "9111111111", "DL1001");
        Driver driver2 = createDriver(driverUser2, "D1002", "driver2@cargoconnect.com", "9111111112", "DL1002");

        Vehicle vehicle1 = createVehicle("MH12AB1234", VehicleType.MINI_TRUCK, "Tata Ace", 1.5, DriverAvailability.AVAILABLE, driver1);
        Vehicle vehicle2 = createVehicle("MH12CD5678", VehicleType.TRUCK, "Ashok Leyland", 5.0, DriverAvailability.AVAILABLE, driver2);

        driver1.setVehicle(vehicle1);
        driver2.setVehicle(vehicle2);
        driverRepository.save(driver1);
        driverRepository.save(driver2);

        createBooking(shipper1, driver1, vehicle1, "Pickup A", "Delivery A", "Parcel A");
        createBooking(shipper2, driver2, vehicle2, "Pickup B", "Delivery B", "Parcel B");
        createBooking(shipper1, null, null, "Pickup C", "Delivery C", "Parcel C");
    }

    private User createUser(String name, String email, String password, UserType type, String phone) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setUserType(type);
        user.setPhone(phone);
        return userRepository.save(user);
    }

    private Driver createDriver(User user, String name, String email, String phone, String licenseNumber) {
        Driver driver = new Driver();
        driver.setName(name);
        driver.setEmail(email);
        driver.setPhone(phone);
        driver.setLicenseNumber(licenseNumber);
        driver.setAvailability(DriverAvailability.AVAILABLE);
        driver.setRating(4.8);
        driver.setUser(user);
        return driverRepository.save(driver);
    }

    private Vehicle createVehicle(String number, VehicleType type, String model, double capacity, DriverAvailability availability, Driver driver) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(number);
        vehicle.setVehicleType(type);
        vehicle.setModel(model);
        vehicle.setCapacity(capacity);
        vehicle.setAvailability(availability);
        vehicle.setDriver(driver);
        return vehicleRepository.save(vehicle);
    }

    private void createBooking(User shipper, Driver driver, Vehicle vehicle, String pickup, String delivery, String packageName) {
        Booking booking = new Booking();
        booking.setShipper(shipper);
        booking.setDriver(driver);
        booking.setVehicle(vehicle);
        booking.setPickupAddress(pickup);
        booking.setDeliveryAddress(delivery);
        booking.setSenderName(shipper.getName());
        booking.setSenderPhone(shipper.getPhone());
        booking.setReceiverName("Receiver");
        booking.setReceiverPhone("9876500000");
        booking.setPackageType("DOCUMENT");
        booking.setPackageWeight(2.5);
        booking.setPackageDescription(packageName);
        booking.setBookingDate(LocalDate.now());
        booking.setPickupDate(LocalDate.now().plusDays(1));
        booking.setDeliveryDate(LocalDate.now().plusDays(3));
        booking.setPrice(new BigDecimal("500.00"));
        booking.setStatus(driver == null ? BookingStatus.PENDING : BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        bookingRepository.save(booking);
    }
}
