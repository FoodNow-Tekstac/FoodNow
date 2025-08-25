package com.foodnow.dto;

import java.util.List;

public class RestaurantDto {
    private int id;
    private String name;
    private String address;
    private String phoneNumber;
    private String businessId; // Renamed from locationPin
    private String ownerName;
    private List<FoodItemDto> menu;
    private String imageUrl;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getBusinessId() { return businessId; } // Updated getter
    public void setBusinessId(String businessId) { this.businessId = businessId; } // Updated setter
    public List<FoodItemDto> getMenu() { return menu; }
    public void setMenu(List<FoodItemDto> menu) { this.menu = menu; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
}