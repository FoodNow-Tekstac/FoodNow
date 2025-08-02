package com.foodnow.service;

import com.foodnow.dto.RestaurantApplicationRequest;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.*;
import com.foodnow.repository.RestaurantApplicationRepository;
import com.foodnow.repository.RestaurantRepository;
import com.foodnow.repository.UserRepository;
import com.foodnow.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RestaurantApplicationService {

    @Autowired private RestaurantApplicationRepository applicationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;

    public RestaurantApplication applyForRestaurant(RestaurantApplicationRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User applicant = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Current user not found in database."));

        if (applicant.getRole() != Role.CUSTOMER) {
            throw new IllegalStateException("Only customers can apply to open a restaurant.");
        }

        applicationRepository.findByApplicantId(applicant.getId()).ifPresent(app -> {
            throw new IllegalStateException("You already have a pending or processed application.");
        });

        RestaurantApplication newApplication = new RestaurantApplication();
        newApplication.setRestaurantName(request.getRestaurantName());
        newApplication.setAddress(request.getRestaurantAddress());
        newApplication.setPhoneNumber(request.getRestaurantPhone());
        newApplication.setLocationPin(request.getLocationPin()); // Set location pin from DTO
            newApplication.setImageUrl(request.getImageUrl()); // ✅ Add this line

        newApplication.setApplicant(applicant);
        newApplication.setStatus(ApplicationStatus.PENDING);
        
        return applicationRepository.save(newApplication);
    }

    public List<RestaurantApplication> getPendingApplications() {
        return applicationRepository.findByStatus(ApplicationStatus.PENDING);
    }

    @Transactional
    public Restaurant approveApplication(int applicationId) {
        RestaurantApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Application is not in a pending state.");
        }
        application.setStatus(ApplicationStatus.APPROVED);
        applicationRepository.save(application);

        User applicant = application.getApplicant();
        applicant.setRole(Role.RESTAURANT_OWNER);
        userRepository.save(applicant);

        Restaurant restaurant = new Restaurant();
        restaurant.setName(application.getRestaurantName());
        restaurant.setAddress(application.getAddress());
        restaurant.setPhoneNumber(application.getPhoneNumber());
        restaurant.setLocationPin(application.getLocationPin()); // Set location pin from application
            restaurant.setImageUrl(application.getImageUrl());

        restaurant.setOwner(applicant);
        return restaurantRepository.save(restaurant);
    }

    @Transactional
    public void rejectApplication(int applicationId, String reason) {
        RestaurantApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Application is not in a pending state.");
        }

        application.setStatus(ApplicationStatus.REJECTED);
        application.setRejectionReason(reason);
        applicationRepository.save(application);
    }
}
