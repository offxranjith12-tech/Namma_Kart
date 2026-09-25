package com.grocery.controller;

import com.grocery.dto.*;
import com.grocery.entity.OrderStatus;
import com.grocery.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final CouponService couponService;
    private final DeliverySlotService deliverySlotService;
    private final ReviewService reviewService;

    // Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDTO>> getDashboard() {
        AdminDashboardDTO dashboard = adminService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AdminDashboardDTO>> getAnalytics() {
        AdminDashboardDTO analytics = adminService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    // Orders Management
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status) {
        List<OrderResponseDTO> orders = orderService.getAllOrdersAdmin(status);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponseDTO updated = orderService.updateOrderStatusAdmin(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Order status updated to " + request.getStatus(), updated));
    }

    @PutMapping("/orders/{id}/assign-delivery")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> assignDeliveryPerson(
            @PathVariable Long id,
            @Valid @RequestBody AssignDeliveryRequest request) {
        OrderResponseDTO updated = orderService.assignDeliveryPersonAdmin(id, request.getDeliveryPersonId());
        return ResponseEntity.ok(ApiResponse.success("Delivery person assigned successfully", updated));
    }

    // Products Management
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProductsAdmin();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody ProductDTO dto) {
        ProductDTO created = productService.createProduct(dto);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", created));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO dto) {
        ProductDTO updated = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getLowStockProducts(
            @RequestParam(required = false, defaultValue = "10") Integer threshold) {
        List<ProductDTO> products = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    // Categories Management
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategoriesAdmin();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryDTO dto) {
        CategoryDTO created = categoryService.createCategory(dto);
        return ResponseEntity.ok(ApiResponse.success("Category created successfully", created));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO dto) {
        CategoryDTO updated = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }

    // Users Management
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // Coupons Management
    @GetMapping("/coupons")
    public ResponseEntity<ApiResponse<List<CouponDTO>>> getAllCoupons() {
        List<CouponDTO> coupons = couponService.getAllCouponsAdmin();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    @PostMapping("/coupons")
    public ResponseEntity<ApiResponse<CouponDTO>> createCoupon(@Valid @RequestBody CouponDTO dto) {
        CouponDTO created = couponService.createCoupon(dto);
        return ResponseEntity.ok(ApiResponse.success("Coupon created successfully", created));
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<CouponDTO>> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponDTO dto) {
        CouponDTO updated = couponService.updateCoupon(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Coupon updated successfully", updated));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully", null));
    }

    // Delivery Slots Management
    @GetMapping("/delivery-slots")
    public ResponseEntity<ApiResponse<List<DeliverySlotDTO>>> getAllDeliverySlots() {
        List<DeliverySlotDTO> slots = deliverySlotService.getAllSlotsAdmin();
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    @PostMapping("/delivery-slots")
    public ResponseEntity<ApiResponse<DeliverySlotDTO>> createDeliverySlot(@Valid @RequestBody DeliverySlotDTO dto) {
        DeliverySlotDTO created = deliverySlotService.createSlot(dto);
        return ResponseEntity.ok(ApiResponse.success("Delivery slot created successfully", created));
    }

    @PutMapping("/delivery-slots/{id}")
    public ResponseEntity<ApiResponse<DeliverySlotDTO>> updateDeliverySlot(
            @PathVariable Long id,
            @Valid @RequestBody DeliverySlotDTO dto) {
        DeliverySlotDTO updated = deliverySlotService.updateSlot(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Delivery slot updated successfully", updated));
    }

    @DeleteMapping("/delivery-slots/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDeliverySlot(@PathVariable Long id) {
        deliverySlotService.deleteSlot(id);
        return ResponseEntity.ok(ApiResponse.success("Delivery slot deleted successfully", null));
    }

    // Reviews Management
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getAllReviews() {
        List<ReviewDTO> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }
}
