package com.foodnow.dto;

import java.util.Set;
//import com.foodnow.model.Address;

public class ProfileDto {
    private String name;
    private String email;
    private String phoneNumber;
    private String profileImageUrl;
    //private Set<Address> addresses;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    //public Set<Address> getAddresses() { return addresses; }
    //public void setAddresses(Set<Address> addresses) { this.addresses = addresses; }
}
