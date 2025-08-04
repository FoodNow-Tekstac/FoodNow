package com.foodnow.controller;

import com.foodnow.dto.ApiResponse;
import com.foodnow.dto.RestaurantApplicationRequest;
import com.foodnow.model.RestaurantApplication;
import com.foodnow.service.RestaurantApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurant") // Changed path for consistency
public class RestaurantApplicationController {

    @Autowired
    private RestaurantApplicationService applicationService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> applyForRestaurant(@RequestBody RestaurantApplicationRequest request) {
        try {
            RestaurantApplication newApplication = applicationService.applyForRestaurant(request);
            return ResponseEntity.ok(newApplication);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(false, e.getMessage()));
        }
    }
}
