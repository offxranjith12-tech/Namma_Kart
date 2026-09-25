package com.grocery.repository;

import com.grocery.entity.GroceryList;
import com.grocery.entity.GroceryListItem;
import com.grocery.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroceryListItemRepository extends JpaRepository<GroceryListItem, Long> {
    Optional<GroceryListItem> findByGroceryListAndProduct(GroceryList groceryList, Product product);
}
