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

    @Column(name = "restaurant_address", nullable = false)
    private String address;

    @Column(name = "restaurant_phone", nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String businessId; 

    @OneToOne
    @JoinColumn(name = "applicant_user_id", referencedColumnName = "id")
    private User applicant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private String rejectionReason;

    @Column(name = "image_url")
    private String imageUrl;

    // --- Getters and Setters ---

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
    public String getBusinessId() { return businessId; } 
    public void setBusinessId(String businessId) { this.businessId = businessId; } 
    public User getApplicant() { return applicant; }
    public void setApplicant(User applicant) { this.applicant = applicant; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}