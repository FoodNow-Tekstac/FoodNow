package com.foodnow.repository;

import com.foodnow.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    // THIS IS THE MISSING METHOD
    Optional<Payment> findByOrderId(int orderId);
}
