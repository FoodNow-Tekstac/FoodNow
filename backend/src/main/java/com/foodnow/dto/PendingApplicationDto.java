package com.foodnow.dto;

public class PendingApplicationDto {
    private int id;
    private String restaurantName;
    private String phoneNumber;
    private String address;
    private String businessId;
    private UserDto applicant;

    // Getters and Setters for all fields
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getBusinessId() { return businessId; }
    public void setBusinessId(String businessId) { this.businessId = businessId; }
    public UserDto getApplicant() { return applicant; }
    public void setApplicant(UserDto applicant) { this.applicant = applicant; }
}