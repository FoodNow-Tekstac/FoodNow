package com.foodnow.service;

import com.foodnow.model.Order;
import com.foodnow.model.OrderStatus;
import com.foodnow.model.Payment;
import com.foodnow.model.PaymentStatus;
import com.foodnow.repository.OrderRepository;
import com.foodnow.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public Payment processPaymentForOrder(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Payment can only be processed for PENDING orders.");
        }

        // --- This is our Mock Payment Gateway Logic ---
        // We'll simulate a 90% success rate.
        boolean isPaymentSuccessful = Math.random() > 0.1;

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalPrice());
        payment.setPaymentTime(LocalDateTime.now());
        payment.setTransactionId("txn_" + UUID.randomUUID().toString().replace("-", ""));

        if (isPaymentSuccessful) {
            payment.setStatus(PaymentStatus.SUCCESSFUL);
            order.setStatus(OrderStatus.CONFIRMED); // Update the order status
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            // We could also set the order to CANCELLED here if we wanted.
        }

        orderRepository.save(order);
        return paymentRepository.save(payment);
    }
}
