package com.foodnow.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

  

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();
    private String profileImageUrl;


       // ADD THIS RELATIONSHIP for password reset tokens
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private PasswordResetToken passwordResetToken;
    @Enumerated(EnumType.STRING)
    private DeliveryAgentStatus deliveryStatus;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
     public DeliveryAgentStatus getDeliveryStatus() { return deliveryStatus; } // ADD THIS GETTER
    public void setDeliveryStatus(DeliveryAgentStatus status) { this.deliveryStatus = status; } // ADD THIS SETTER
    //public Set<Address> getAddresses() { return addresses; }
    public String getProfileImageUrl() { return profileImageUrl; } // ADD THIS GETTER
    public void setProfileImageUrl(String url) { this.profileImageUrl = url; } // ADD THIS SETTER
    //public void setAddresses(Set<Address> addresses) { this.addresses = addresses; }
    public List<Review> getReviews() { return reviews; } // ADD THIS GETTER
    public void setReviews(List<Review> reviews) { this.reviews = reviews; } // ADD THIS SETTER
    public PasswordResetToken getPasswordResetToken() { return passwordResetToken; } // ADD THIS GETTER
    public void setPasswordResetToken(PasswordResetToken token) { this.passwordResetToken = token; } // ADD THIS SETTER

}

