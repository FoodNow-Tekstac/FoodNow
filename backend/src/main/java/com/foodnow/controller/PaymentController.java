package com.foodnow.controller;

import com.foodnow.dto.PaymentDto;
import com.foodnow.model.Payment;
import com.foodnow.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@PreAuthorize("hasRole('CUSTOMER')")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

@PostMapping("/process")
public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> payload) { // Changed to Object
    // In PaymentController.java
try {
    // Safely get the orderId as a Number and convert it to an int
    int orderId = ((Number) payload.get("orderId")).intValue(); // <-- This is the fix
    String paymentMethod = (String) payload.get("paymentMethod");
    Payment payment = paymentService.processPaymentForOrder(orderId, paymentMethod);
    return ResponseEntity.ok(toPaymentDto(payment));
} catch (Exception e) {
    e.printStackTrace(); 
    return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
}
}
    private PaymentDto toPaymentDto(Payment payment) {
        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        dto.setOrderId(payment.getOrder().getId());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaymentTime(payment.getPaymentTime());
        return dto;
    }
}
