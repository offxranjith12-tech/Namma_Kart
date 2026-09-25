package com.grocery.repository;

import com.grocery.entity.Cart;
import com.grocery.entity.CartItem;
import com.grocery.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
    void deleteByCartAndProduct(Cart cart, Product product);
}
