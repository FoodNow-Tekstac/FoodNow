package com.foodnow.controller;

import com.foodnow.dto.CartDto;
import com.foodnow.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    @Autowired 
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart() {
        return ResponseEntity.ok(cartService.getCartForCurrentUser());
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItemToCart(@RequestBody Map<String, Integer> payload) {
        int foodItemId = payload.get("foodItemId");
        int quantity = payload.get("quantity");
        return ResponseEntity.ok(cartService.addItemToCart(foodItemId, quantity));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartDto> updateItemQuantity(@PathVariable int cartItemId, @RequestBody Map<String, Integer> payload) {
        int quantity = payload.get("quantity");
        return ResponseEntity.ok(cartService.updateItemQuantity(cartItemId, quantity));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartDto> removeItemFromCart(@PathVariable int cartItemId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(cartItemId));
    }
}
