package com.foodnow.service;

import com.foodnow.dto.CartDto;
import com.foodnow.dto.CartItemDto;
import com.foodnow.dto.FoodItemDto;
import com.foodnow.exception.ResourceNotFoundException;
import com.foodnow.model.*;
import com.foodnow.repository.*;
import com.foodnow.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private FoodItemRepository foodItemRepository;
    @Autowired private UserRepository userRepository;

    @Transactional
    public CartDto getCartForCurrentUser() {
        Cart cart = getCartEntityForCurrentUser();
        return toCartDto(cart);
    }

    @Transactional
    public Cart getCartEntityForCurrentUser() {
        User currentUser = getCurrentUser();
        return cartRepository.findByUserId(currentUser.getId()).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(currentUser);
            return cartRepository.save(newCart);
        });
    }

    @Transactional
    public CartDto addItemToCart(int foodItemId, int quantity) {
        Cart cart = getCartEntityForCurrentUser();
        FoodItem foodItem = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found"));

        if (!cart.getItems().isEmpty() && 
            cart.getItems().get(0).getFoodItem().getRestaurant().getId() != foodItem.getRestaurant().getId()) {
            throw new IllegalStateException("You can only order from one restaurant at a time. Please clear your cart first.");
        }

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getFoodItem().getId() == foodItemId)
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setFoodItem(foodItem);
            newItem.setQuantity(quantity);
            cart.getItems().add(cartItemRepository.save(newItem));
        }
        
        Cart updatedCart = updateCartTotal(cart);
        return toCartDto(updatedCart);
    }

    // THIS IS A NEW METHOD
    @Transactional
    public CartDto updateItemQuantity(int cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (cartItem.getCart().getUser().getId() != getCurrentUser().getId()) {
            throw new SecurityException("Unauthorized access to cart item");
        }
        
        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        Cart updatedCart = updateCartTotal(cartItem.getCart());
        return toCartDto(updatedCart);
    }

    // THIS IS A NEW METHOD
    @Transactional
    public CartDto removeItemFromCart(int cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (cartItem.getCart().getUser().getId() != getCurrentUser().getId()) {
            throw new SecurityException("Unauthorized access to cart item");
        }
        
        Cart cart = cartItem.getCart();
        cart.getItems().remove(cartItem); // Important for lazy loading
        cartItemRepository.delete(cartItem);
        Cart updatedCart = updateCartTotal(cart);
        return toCartDto(updatedCart);
    }

    private Cart updateCartTotal(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getFoodItem().getPrice() * item.getQuantity())
                .sum();
        cart.setTotalPrice(total);
        return cartRepository.save(cart);
    }
    
    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // --- DTO Conversion Helper Methods ---
    private CartDto toCartDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setTotalPrice(cart.getTotalPrice());
        dto.setItems(cart.getItems().stream().map(this::toCartItemDto).collect(Collectors.toList()));
        return dto;
    }

    private CartItemDto toCartItemDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setFoodItem(toFoodItemDto(cartItem.getFoodItem()));
        return dto;
    }

    private FoodItemDto toFoodItemDto(FoodItem foodItem) {
        FoodItemDto dto = new FoodItemDto();
        dto.setId(foodItem.getId());
        dto.setName(foodItem.getName());
        dto.setPrice(foodItem.getPrice());
        // Add other fields if needed by the cart frontend
        return dto;
    }
}
