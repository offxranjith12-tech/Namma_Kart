package com.grocery.service;

import com.grocery.dto.GroceryListDTO;
import com.grocery.dto.GroceryListItemDTO;
import com.grocery.dto.GroceryListItemRequestDTO;
import com.grocery.dto.GroceryListRequestDTO;
import com.grocery.entity.GroceryList;
import com.grocery.entity.GroceryListItem;
import com.grocery.entity.Product;
import com.grocery.entity.User;
import com.grocery.exception.BadRequestException;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.repository.GroceryListItemRepository;
import com.grocery.repository.GroceryListRepository;
import com.grocery.repository.ProductRepository;
import com.grocery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroceryListService {

    private final GroceryListRepository groceryListRepository;
    private final GroceryListItemRepository groceryListItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<GroceryListDTO> getUserLists(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return groceryListRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public GroceryListDTO createList(Long userId, GroceryListRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        GroceryList groceryList = GroceryList.builder()
                .user(user)
                .name(request.getName())
                .build();

        return mapToDTO(groceryListRepository.save(groceryList));
    }

    @Transactional
    public GroceryListDTO addOrUpdateItem(Long userId, Long listId, GroceryListItemRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        GroceryList groceryList = groceryListRepository.findByIdAndUser(listId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery list not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<GroceryListItem> existingItemOpt = groceryListItemRepository.findByGroceryListAndProduct(groceryList, product);

        if (existingItemOpt.isPresent()) {
            GroceryListItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(request.getQuantity());
            groceryListItemRepository.save(existingItem);
        } else {
            GroceryListItem newItem = GroceryListItem.builder()
                    .groceryList(groceryList)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            groceryList.getItems().add(newItem);
            groceryListItemRepository.save(newItem);
        }

        return mapToDTO(groceryListRepository.findById(listId).get());
    }

    @Transactional
    public GroceryListDTO removeItem(Long userId, Long listId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        GroceryList groceryList = groceryListRepository.findByIdAndUser(listId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery list not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        GroceryListItem item = groceryListItemRepository.findByGroceryListAndProduct(groceryList, product)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in the list"));

        groceryList.getItems().remove(item);
        groceryListItemRepository.delete(item);

        return mapToDTO(groceryListRepository.findById(listId).get());
    }

    @Transactional
    public void deleteList(Long userId, Long listId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        GroceryList groceryList = groceryListRepository.findByIdAndUser(listId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery list not found"));

        groceryListRepository.delete(groceryList);
    }

    private GroceryListDTO mapToDTO(GroceryList list) {
        return GroceryListDTO.builder()
                .id(list.getId())
                .name(list.getName())
                .items(list.getItems() != null ? list.getItems().stream().map(this::mapItemToDTO).collect(Collectors.toList()) : List.of())
                .build();
    }

    private GroceryListItemDTO mapItemToDTO(GroceryListItem item) {
        Product p = item.getProduct();
        java.math.BigDecimal discountedPrice = p.getPrice();
        if (p.getDiscount() != null && p.getDiscount().compareTo(java.math.BigDecimal.ZERO) > 0) {
            java.math.BigDecimal multiplier = java.math.BigDecimal.ONE.subtract(p.getDiscount().divide(java.math.BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP));
            discountedPrice = p.getPrice().multiply(multiplier).setScale(2, java.math.RoundingMode.HALF_UP);
        }
        return GroceryListItemDTO.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .imageUrl(p.getImageUrl())
                .price(p.getPrice())
                .discountedPrice(discountedPrice)
                .quantity(item.getQuantity())
                .build();
    }
}
