package com.foodnow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurant_applications")
public class RestaurantApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String restaurantName;

    // This now correctly maps to the single 'restaurant_address' column
    @Column(name = "restaurant_address", nullable = false)
    private String address;

    // This now correctly maps to the single 'restaurant_phone' column
    @Column(name = "restaurant_phone", nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String locationPin;

    @OneToOne
    @JoinColumn(name = "applicant_user_id", referencedColumnName = "id")
    private User applicant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private String rejectionReason;

    // --- Getters and Setters ---
@Column(name = "image_url")
private String imageUrl;

public String getImageUrl() {
    return imageUrl;
}

public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getLocationPin() { return locationPin; }
    public void setLocationPin(String locationPin) { this.locationPin = locationPin; }
    public User getApplicant() { return applicant; }
    public void setApplicant(User applicant) { this.applicant = applicant; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
