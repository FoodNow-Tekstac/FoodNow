
// File: src/main/java/com/foodnow/controller/OrderController.java (UPDATED)
package com.foodnow.controller;

import com.foodnow.dto.OrderDto;
import com.foodnow.dto.OrderTrackingDto;
import com.foodnow.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("hasRole('CUSTOMER')")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder() {
        try {
            // The service now returns the DTO directly.
            OrderDto orderDto = orderService.placeOrderFromCart();
            return ResponseEntity.ok(orderDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDto>> getMyOrders() {
        // The service now returns a List<OrderDto> directly.
        List<OrderDto> dtoList = orderService.getMyOrders();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/my-orders/{orderId}")
    public ResponseEntity<OrderTrackingDto> getOrderById(@PathVariable int orderId) {
        return ResponseEntity.ok(orderService.getOrderForTracking(orderId));
    }
    
    // The DTO conversion logic is now correctly handled in the service layer,
    // so the helper methods are no longer needed in the controller.
}