package com.foodnow.repository;

import com.foodnow.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    @Transactional
    void deleteByCartId(int cartId);
}