package com.grocery.repository;

import com.grocery.entity.GroceryList;
import com.grocery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroceryListRepository extends JpaRepository<GroceryList, Long> {
    List<GroceryList> findByUserOrderByCreatedAtDesc(User user);
    Optional<GroceryList> findByIdAndUser(Long id, User user);
}
