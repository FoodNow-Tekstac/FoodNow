package com.foodnow.service;

import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.DeliveryAgentStatus;
import com.foodnow.model.User;
import com.foodnow.repository.UserRepository;
import com.foodnow.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeliveryService {
    @Autowired private UserRepository userRepository;

    @Transactional
    public User updateDeliveryStatus(DeliveryAgentStatus status) {
        User currentUser = getCurrentUser();
        currentUser.setDeliveryStatus(status);
        return userRepository.save(currentUser);
    }
    
    public DeliveryAgentStatus getMyStatus() {
        return getCurrentUser().getDeliveryStatus();
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
