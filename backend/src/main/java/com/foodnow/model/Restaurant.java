package com.foodnow.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "restaurants")
public class Restaurant {
    public enum RestaurantStatus { ACTIVE, INACTIVE, SUSPENDED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private int id;
    @Column(nullable = false, unique = true) private String name;
    @Column(nullable = false) private String address;
    @Column(nullable = false) private String phoneNumber;
    @Column(nullable = false) private String locationPin;
    @Enumerated(EnumType.STRING) private RestaurantStatus status = RestaurantStatus.ACTIVE;
    
    // ADD THIS FIELD for the restaurant's main image/logo
    private String imageUrl;

    @OneToOne @JoinColumn(name = "owner_id", referencedColumnName = "id") @JsonIgnore private User owner;
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true) @JsonIgnore private List<FoodItem> menu = new ArrayList<>();
    
        @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getLocationPin() { return locationPin; }
    public void setLocationPin(String locationPin) { this.locationPin = locationPin; }
    public RestaurantStatus getStatus() { return status; }
    public void setStatus(RestaurantStatus status) { this.status = status; }
    public String getImageUrl() { return imageUrl; } // ADD THIS GETTER
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; } // ADD THIS SETTER
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public List<FoodItem> getMenu() { return menu; }
    public void setMenu(List<FoodItem> menu) { this.menu = menu; }
     public List<Review> getReviews() { return reviews; } // ADD THIS GETTER
    public void setReviews(List<Review> reviews) { this.reviews = reviews; } // ADD THIS SETTER
}