package com.foodnow.dto;

/**
 * DTO for creating a new delivery personnel user account.
 * This is used by the AdminController.
 */
public class DeliveryPersonnelSignUpRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
