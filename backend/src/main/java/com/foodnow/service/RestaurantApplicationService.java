package com.foodnow.service;

import com.foodnow.dto.PendingApplicationDto;
import com.foodnow.dto.RestaurantApplicationRequest;
import com.foodnow.dto.UserDto;
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
import java.util.stream.Collectors;

@Service
public class RestaurantApplicationService {

    @Autowired private RestaurantApplicationRepository applicationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private EmailService emailService; 

    @Transactional(readOnly = true)
    public List<PendingApplicationDto> getPendingApplicationsForAdmin() {
        return applicationRepository.findByStatus(ApplicationStatus.PENDING).stream()
            .map(this::toPendingApplicationDto)
            .collect(Collectors.toList());
    }

    // FIX #1 is in this method
    @Transactional // It's good practice to make this whole method a single transaction
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
        newApplication.setBusinessId(request.getBusinessId());
        newApplication.setImageUrl(request.getImageUrl());
        newApplication.setApplicant(applicant);
        newApplication.setStatus(ApplicationStatus.PENDING);
        
        // First and ONLY save for the application
        RestaurantApplication savedApplication = applicationRepository.save(newApplication);

        emailService.sendApplicationConfirmationEmail(
            applicant.getEmail(),
            applicant.getName(),
            savedApplication.getRestaurantName()
        );

        // --- FIX #1: Return the ALREADY saved object, don't save it again. ---
        return savedApplication;
    }

    // FIX #2 is in this method
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
        restaurant.setBusinessId(application.getBusinessId());
        restaurant.setImageUrl(application.getImageUrl());
        restaurant.setOwner(applicant);

        // First and ONLY save for the restaurant
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        
        emailService.sendApplicationApprovalEmail(
            applicant.getEmail(),
            applicant.getName(),
            savedRestaurant.getName()
        );

        // --- FIX #2: Return the ALREADY saved object, don't save it again. ---
        return savedRestaurant;
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

        User applicant = application.getApplicant();
        emailService.sendApplicationRejectionEmail(
            applicant.getEmail(),
            applicant.getName(),
            application.getRestaurantName(),
            reason
        );
    }
    
    // --- Helper methods remain the same ---
    private PendingApplicationDto toPendingApplicationDto(RestaurantApplication app) {
        PendingApplicationDto dto = new PendingApplicationDto();
        dto.setId(app.getId());
        dto.setRestaurantName(app.getRestaurantName());
        dto.setPhoneNumber(app.getPhoneNumber());
        dto.setAddress(app.getAddress());
        dto.setBusinessId(app.getBusinessId());
        if (app.getApplicant() != null) {
            dto.setApplicant(toUserDto(app.getApplicant()));
        }
        return dto;
    }

    private UserDto toUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }
}