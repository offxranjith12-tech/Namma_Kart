package com.grocery.repository;

import com.grocery.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByActiveTrue();
    
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(UPPER(p.name) LIKE UPPER(CONCAT('%', :keyword, '%')) OR " +
           "UPPER(p.description) LIKE UPPER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.stock <= :threshold")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);
}
