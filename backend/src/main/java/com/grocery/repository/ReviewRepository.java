package com.grocery.repository;

import com.grocery.entity.Order;
import com.grocery.entity.Product;
import com.grocery.entity.Review;
import com.grocery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductOrderByCreatedAtDesc(Product product);
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    Boolean existsByUserAndProductAndOrder(User user, Product product, Order order);
}
