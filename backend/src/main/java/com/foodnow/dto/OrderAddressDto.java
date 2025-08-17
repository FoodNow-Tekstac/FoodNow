package com.foodnow.dto;

public class OrderAddressDto {
    private String line1;
    private String city;
    private String postalCode;


    // Add this inside the OrderAddressDto class
@Override
public String toString() {
    return "OrderAddressDto{" +
           "line1='" + line1 + '\'' +
           ", city='" + city + '\'' +
           ", postalCode='" + postalCode + '\'' +
           '}';
}
    // Getters and setters
    public String getLine1() { return line1; }
    public void setLine1(String line1) { this.line1 = line1; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
}
