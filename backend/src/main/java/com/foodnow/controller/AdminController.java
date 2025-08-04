package com.foodnow.controller;

import com.foodnow.dto.AnalyticsDto;
import com.foodnow.dto.ApiResponse;
import com.foodnow.dto.DeliveryPersonnelSignUpRequest;
import com.foodnow.dto.OrderDto;
import com.foodnow.dto.RestaurantDto;
import com.foodnow.dto.UserDto;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.Restaurant;
import com.foodnow.model.RestaurantApplication;
import com.foodnow.model.User;
import com.foodnow.service.AdminService;
import com.foodnow.service.AuthenticationService;
import com.foodnow.service.RestaurantApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private RestaurantApplicationService applicationService;
    @Autowired private AuthenticationService authenticationService;
    @Autowired private AdminService adminService;

    // --- Restaurant Application Management ---

    @GetMapping("/applications/pending")
    public ResponseEntity<List<RestaurantApplication>> getPendingApplications() {
        return ResponseEntity.ok(applicationService.getPendingApplications());
    }

    @PostMapping("/applications/{applicationId}/approve")
    public ResponseEntity<?> approveRestaurantApplication(@PathVariable int applicationId) {
        try {
            Restaurant newRestaurant = applicationService.approveApplication(applicationId);
            return ResponseEntity.ok(newRestaurant);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/applications/{applicationId}/reject")
    public ResponseEntity<ApiResponse> rejectRestaurantApplication(@PathVariable int applicationId, @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Rejection reason is required."));
        }
        try {
            applicationService.rejectApplication(applicationId, reason);
            return ResponseEntity.ok(new ApiResponse(true, "Application rejected successfully."));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage()));
        }
    }

    // --- Delivery Personnel Management ---

    @PostMapping("/delivery-personnel")
    public ResponseEntity<?> createDeliveryPersonnel(@RequestBody DeliveryPersonnelSignUpRequest signUpRequest) {
        try {
            User newDeliveryUser = authenticationService.registerDeliveryPersonnel(signUpRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(newDeliveryUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to register delivery personnel: " + e.getMessage()));
        }
    }

    // --- Dashboard Endpoints ---

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants() {
        return ResponseEntity.ok(adminService.getAllRestaurants());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @GetMapping("/delivery-agents")
    public ResponseEntity<List<UserDto>> getDeliveryAgents() {
        return ResponseEntity.ok(adminService.getDeliveryAgents());
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
