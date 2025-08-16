package com.foodnow.repository;

import com.foodnow.model.DeliveryAgentStatus;
import com.foodnow.model.Role;
import com.foodnow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);
    Boolean existsByPhoneNumber(String phoneNumber);

    // New method to find all users with a specific role
    List<User> findByRole(Role role);
        List<User> findByRoleAndDeliveryStatus(Role role, DeliveryAgentStatus status);

}
