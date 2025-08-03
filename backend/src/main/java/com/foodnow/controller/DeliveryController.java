package com.foodnow.controller;

import com.foodnow.model.DeliveryAgentStatus;
import com.foodnow.model.User;
import com.foodnow.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@PreAuthorize("hasRole('DELIVERY_PERSONNEL')")
public class DeliveryController {
    @Autowired private DeliveryService deliveryService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, DeliveryAgentStatus>> getStatus() {
        return ResponseEntity.ok(Map.of("status", deliveryService.getMyStatus()));
    }

    @PatchMapping("/status")
    public ResponseEntity<User> updateStatus(@RequestBody Map<String, String> payload) {
        DeliveryAgentStatus newStatus = DeliveryAgentStatus.valueOf(payload.get("status"));
        User updatedAgent = deliveryService.updateDeliveryStatus(newStatus);
        return ResponseEntity.ok(updatedAgent);
    }
}
