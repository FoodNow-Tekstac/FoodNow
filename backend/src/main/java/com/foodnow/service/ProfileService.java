package com.foodnow.service;

import com.foodnow.dto.ProfileDto;
import com.foodnow.dto.UpdateProfileRequest;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.User;
import com.foodnow.repository.UserRepository;
import com.foodnow.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public ProfileDto getProfile() {
        User currentUser = getCurrentUser();
        return toProfileDto(currentUser);
    }

    @Transactional
    public ProfileDto updateProfile(UpdateProfileRequest request) {
        User currentUser = getCurrentUser();
        currentUser.setName(request.getName());
        currentUser.setPhoneNumber(request.getPhoneNumber());
        
        // Only update the image URL if a new one was provided
        if (request.getProfileImageUrl() != null && !request.getProfileImageUrl().isEmpty()) {
            currentUser.setProfileImageUrl(request.getProfileImageUrl());
        }

        User updatedUser = userRepository.save(currentUser);
        return toProfileDto(updatedUser);
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ProfileDto toProfileDto(User user) {
        ProfileDto dto = new ProfileDto();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        //dto.setAddresses(user.getAddresses());
        return dto;
    }
}
