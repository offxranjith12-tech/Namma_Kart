package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.ProductDTO;
import com.grocery.entity.ExpiryRule;
import com.grocery.repository.ExpiryRuleRepository;
import com.grocery.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/expiry")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ExpiryManagementController {

    private final ProductService productService;
    private final ExpiryRuleRepository expiryRuleRepository;

    @GetMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByExpiryStatus(@RequestParam(required = false) String status) {
        List<ProductDTO> allProducts = productService.getAllProductsAdmin();
        
        if (status != null) {
            allProducts = allProducts.stream().filter(p -> {
                if (p.getDaysRemaining() == null) return "SAFE".equalsIgnoreCase(status);
                
                if (p.getIsExpired()) {
                    return "EXPIRED".equalsIgnoreCase(status);
                } else if (p.getIsNearExpiry()) {
                    return "NEAR_EXPIRY".equalsIgnoreCase(status);
                } else if (p.getDaysRemaining() <= 15) {
                    return "EXPIRING_SOON".equalsIgnoreCase(status); // Arbitrary soon limit
                } else {
                    return "SAFE".equalsIgnoreCase(status);
                }
            }).collect(Collectors.toList());
        }

        return ResponseEntity.ok(ApiResponse.success("Expiry products fetched", allProducts));
    }

    @GetMapping("/rules")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ExpiryRule>>> getExpiryRules() {
        return ResponseEntity.ok(ApiResponse.success("Rules fetched", expiryRuleRepository.findAll()));
    }

    @PostMapping("/rules")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExpiryRule>> createRule(@RequestBody ExpiryRule rule) {
        return ResponseEntity.ok(ApiResponse.success("Rule created", expiryRuleRepository.save(rule)));
    }

    @PutMapping("/rules/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExpiryRule>> updateRule(@PathVariable Long id, @RequestBody ExpiryRule rule) {
        ExpiryRule existing = expiryRuleRepository.findById(id).orElseThrow();
        existing.setMinDays(rule.getMinDays());
        existing.setMaxDays(rule.getMaxDays());
        existing.setDiscountPercentage(rule.getDiscountPercentage());
        existing.setActive(rule.getActive());
        return ResponseEntity.ok(ApiResponse.success("Rule updated", expiryRuleRepository.save(existing)));
    }

    @DeleteMapping("/rules/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRule(@PathVariable Long id) {
        expiryRuleRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Rule deleted", null));
    }
}
