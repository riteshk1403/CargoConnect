package com.cargoconnect.dto;


public class NearbyVehicleDto {
    private Long vehicleId;
    private String vehicleNumber;
    private String vehicleType;
    private Double capacity;
    private Double usedCapacity;
    private Double remainingCapacity;
    private Double latitude;
    private Double longitude;
    private Double distanceKm; // Calculated Haversine distance from pickup location
    private String vehicleStatus;
    private String vehicleVerificationStatus;

    // Associated driver details if available
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private Double driverRating;
    private String driverStatus;
    private String driverVerificationStatus;

    private boolean isSuitable; // true if capacity >= weight & verified & valid docs
    private String suitabilityReason;


    // --- Standard Constructors ---
    public NearbyVehicleDto() {}

    public NearbyVehicleDto(Long vehicleId, String vehicleNumber, String vehicleType, Double capacity, Double usedCapacity, Double remainingCapacity, Double latitude, Double longitude, Double distanceKm, String vehicleStatus, String vehicleVerificationStatus, Long driverId, String driverName, String driverPhone, Double driverRating, String driverStatus, String driverVerificationStatus, boolean isSuitable, String suitabilityReason) {
        this.vehicleId = vehicleId;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.capacity = capacity;
        this.usedCapacity = usedCapacity;
        this.remainingCapacity = remainingCapacity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceKm = distanceKm;
        this.vehicleStatus = vehicleStatus;
        this.vehicleVerificationStatus = vehicleVerificationStatus;
        this.driverId = driverId;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.driverRating = driverRating;
        this.driverStatus = driverStatus;
        this.driverVerificationStatus = driverVerificationStatus;
        this.isSuitable = isSuitable;
        this.suitabilityReason = suitabilityReason;
    }


    // --- Getters & Setters ---
    public Long getVehicleId() { return this.vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public String getVehicleNumber() { return this.vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public String getVehicleType() { return this.vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public Double getCapacity() { return this.capacity; }
    public void setCapacity(Double capacity) { this.capacity = capacity; }
    public Double getUsedCapacity() { return this.usedCapacity; }
    public void setUsedCapacity(Double usedCapacity) { this.usedCapacity = usedCapacity; }
    public Double getRemainingCapacity() { return this.remainingCapacity; }
    public void setRemainingCapacity(Double remainingCapacity) { this.remainingCapacity = remainingCapacity; }
    public Double getLatitude() { return this.latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return this.longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getDistanceKm() { return this.distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public String getVehicleStatus() { return this.vehicleStatus; }
    public void setVehicleStatus(String vehicleStatus) { this.vehicleStatus = vehicleStatus; }
    public String getVehicleVerificationStatus() { return this.vehicleVerificationStatus; }
    public void setVehicleVerificationStatus(String vehicleVerificationStatus) { this.vehicleVerificationStatus = vehicleVerificationStatus; }
    public Long getDriverId() { return this.driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    public String getDriverName() { return this.driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getDriverPhone() { return this.driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }
    public Double getDriverRating() { return this.driverRating; }
    public void setDriverRating(Double driverRating) { this.driverRating = driverRating; }
    public String getDriverStatus() { return this.driverStatus; }
    public void setDriverStatus(String driverStatus) { this.driverStatus = driverStatus; }
    public String getDriverVerificationStatus() { return this.driverVerificationStatus; }
    public void setDriverVerificationStatus(String driverVerificationStatus) { this.driverVerificationStatus = driverVerificationStatus; }
    public boolean isSuitable() { return this.isSuitable; }
    public void setIsSuitable(boolean isSuitable) { this.isSuitable = isSuitable; }
    public String getSuitabilityReason() { return this.suitabilityReason; }
    public void setSuitabilityReason(String suitabilityReason) { this.suitabilityReason = suitabilityReason; }


    // --- Builder Pattern ---
    public static NearbyVehicleDtoBuilder builder() {
        return new NearbyVehicleDtoBuilder();
    }

    public static class NearbyVehicleDtoBuilder {
        private Long vehicleId;
        private String vehicleNumber;
        private String vehicleType;
        private Double capacity;
        private Double usedCapacity;
        private Double remainingCapacity;
        private Double latitude;
        private Double longitude;
        private Double distanceKm;
        private String vehicleStatus;
        private String vehicleVerificationStatus;
        private Long driverId;
        private String driverName;
        private String driverPhone;
        private Double driverRating;
        private String driverStatus;
        private String driverVerificationStatus;
        private boolean isSuitable;
        private String suitabilityReason;

        public NearbyVehicleDtoBuilder() {}

        public NearbyVehicleDtoBuilder vehicleId(Long vehicleId) {
            this.vehicleId = vehicleId;
            return this;
        }

        public NearbyVehicleDtoBuilder vehicleNumber(String vehicleNumber) {
            this.vehicleNumber = vehicleNumber;
            return this;
        }

        public NearbyVehicleDtoBuilder vehicleType(String vehicleType) {
            this.vehicleType = vehicleType;
            return this;
        }

        public NearbyVehicleDtoBuilder capacity(Double capacity) {
            this.capacity = capacity;
            return this;
        }

        public NearbyVehicleDtoBuilder usedCapacity(Double usedCapacity) {
            this.usedCapacity = usedCapacity;
            return this;
        }

        public NearbyVehicleDtoBuilder remainingCapacity(Double remainingCapacity) {
            this.remainingCapacity = remainingCapacity;
            return this;
        }

        public NearbyVehicleDtoBuilder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public NearbyVehicleDtoBuilder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public NearbyVehicleDtoBuilder distanceKm(Double distanceKm) {
            this.distanceKm = distanceKm;
            return this;
        }

        public NearbyVehicleDtoBuilder vehicleStatus(String vehicleStatus) {
            this.vehicleStatus = vehicleStatus;
            return this;
        }

        public NearbyVehicleDtoBuilder vehicleVerificationStatus(String vehicleVerificationStatus) {
            this.vehicleVerificationStatus = vehicleVerificationStatus;
            return this;
        }

        public NearbyVehicleDtoBuilder driverId(Long driverId) {
            this.driverId = driverId;
            return this;
        }

        public NearbyVehicleDtoBuilder driverName(String driverName) {
            this.driverName = driverName;
            return this;
        }

        public NearbyVehicleDtoBuilder driverPhone(String driverPhone) {
            this.driverPhone = driverPhone;
            return this;
        }

        public NearbyVehicleDtoBuilder driverRating(Double driverRating) {
            this.driverRating = driverRating;
            return this;
        }

        public NearbyVehicleDtoBuilder driverStatus(String driverStatus) {
            this.driverStatus = driverStatus;
            return this;
        }

        public NearbyVehicleDtoBuilder driverVerificationStatus(String driverVerificationStatus) {
            this.driverVerificationStatus = driverVerificationStatus;
            return this;
        }

        public NearbyVehicleDtoBuilder isSuitable(boolean isSuitable) {
            this.isSuitable = isSuitable;
            return this;
        }

        public NearbyVehicleDtoBuilder suitabilityReason(String suitabilityReason) {
            this.suitabilityReason = suitabilityReason;
            return this;
        }

        public NearbyVehicleDto build() {
            NearbyVehicleDto instance = new NearbyVehicleDto();
            instance.vehicleId = this.vehicleId;
            instance.vehicleNumber = this.vehicleNumber;
            instance.vehicleType = this.vehicleType;
            instance.capacity = this.capacity;
            instance.usedCapacity = this.usedCapacity;
            instance.remainingCapacity = this.remainingCapacity;
            instance.latitude = this.latitude;
            instance.longitude = this.longitude;
            instance.distanceKm = this.distanceKm;
            instance.vehicleStatus = this.vehicleStatus;
            instance.vehicleVerificationStatus = this.vehicleVerificationStatus;
            instance.driverId = this.driverId;
            instance.driverName = this.driverName;
            instance.driverPhone = this.driverPhone;
            instance.driverRating = this.driverRating;
            instance.driverStatus = this.driverStatus;
            instance.driverVerificationStatus = this.driverVerificationStatus;
            instance.isSuitable = this.isSuitable;
            instance.suitabilityReason = this.suitabilityReason;
            return instance;
        }
    }

}
