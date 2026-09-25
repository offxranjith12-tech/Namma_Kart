package com.grocery.service;

import com.grocery.dto.ProductDTO;
import com.grocery.entity.Category;
import com.grocery.entity.Product;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.repository.CategoryRepository;
import com.grocery.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductDTO> getAllActiveProducts() {
        return productRepository.findAllByActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getAllProductsAdmin() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDTO(product);
    }

    public List<ProductDTO> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllActiveProducts();
        }
        return productRepository.searchProducts(keyword.trim()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getLowStockProducts(Integer threshold) {
        int limit = threshold != null ? threshold : 10;
        return productRepository.findLowStockProducts(limit).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Product product = Product.builder()
                .category(category)
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .unit(dto.getUnit())
                .imageUrl(dto.getImageUrl())
                .discount(dto.getDiscount() != null ? dto.getDiscount() : BigDecimal.ZERO)
                .rating(dto.getRating() != null ? dto.getRating() : BigDecimal.valueOf(4.5))
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        return mapToDTO(productRepository.save(product));
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (dto.getCategoryId() != null && !dto.getCategoryId().equals(product.getCategory().getId())) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
            product.setCategory(category);
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setUnit(dto.getUnit());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getDiscount() != null) product.setDiscount(dto.getDiscount());
        if (dto.getRating() != null) product.setRating(dto.getRating());
        if (dto.getActive() != null) product.setActive(dto.getActive());

        return mapToDTO(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    public ProductDTO mapToDTO(Product product) {
        BigDecimal price = product.getPrice();
        BigDecimal discount = product.getDiscount() != null ? product.getDiscount() : BigDecimal.ZERO;
        BigDecimal discountedPrice = price;

        if (discount.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountMultiplier = BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
            discountedPrice = price.multiply(discountMultiplier).setScale(2, RoundingMode.HALF_UP);
        }

        return ProductDTO.builder()
                .id(product.getId())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .unit(product.getUnit())
                .imageUrl(product.getImageUrl())
                .discount(product.getDiscount())
                .discountedPrice(discountedPrice)
                .rating(product.getRating())
                .active(product.getActive())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
