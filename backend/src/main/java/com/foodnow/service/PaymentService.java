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
import java.util.Optional;
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

        // Simulates a successful payment
        boolean isPaymentSuccessful = Math.random() > 0.1;

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalPrice());
        payment.setPaymentTime(LocalDateTime.now());
        payment.setTransactionId("txn_" + UUID.randomUUID().toString().replace("-", ""));

        if (isPaymentSuccessful) {
            payment.setStatus(PaymentStatus.SUCCESSFUL);
            // THE FIX: The line below has been removed.
            // The order status will now remain PENDING after payment.
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        orderRepository.save(order);
        return paymentRepository.save(payment);
    }

    @Transactional
    public void initiateRefund(int orderId) {
        Optional<Payment> paymentOptional = paymentRepository.findByOrderId(orderId);
        if (paymentOptional.isPresent() && paymentOptional.get().getStatus() == PaymentStatus.SUCCESSFUL) {
            Payment paymentToRefund = paymentOptional.get();
            paymentToRefund.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(paymentToRefund);
            System.out.println("✅ Refund processed for order ID: " + orderId);
        } else {
            System.out.println("ℹ️ No successful payment found for order ID " + orderId + ". No refund required.");
        }
    }
}
