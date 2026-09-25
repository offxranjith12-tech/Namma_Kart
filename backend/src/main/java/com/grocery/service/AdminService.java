package com.grocery.service;

import com.grocery.dto.*;
import com.grocery.entity.*;
import com.grocery.exception.BadRequestException;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final DeliveryPersonRepository deliveryPersonRepository;
    private final ProductService productService;
    private final OrderService orderService;
    private final PasswordEncoder passwordEncoder;

    public AdminDashboardDTO getAdminDashboard() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.findByRole(Role.ROLE_CUSTOMER).size();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        long placed = orderRepository.countByStatus(OrderStatus.PLACED);
        long confirmed = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long preparing = orderRepository.countByStatus(OrderStatus.PREPARING);
        long outForDelivery = orderRepository.countByStatus(OrderStatus.OUT_FOR_DELIVERY);
        long completedOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        long pendingOrders = placed + confirmed + preparing + outForDelivery;

        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        BigDecimal todayRevenue = orderRepository.sumTodayRevenue(startOfToday);
        if (todayRevenue == null) todayRevenue = BigDecimal.ZERO;

        LocalDateTime startOfWeek = LocalDate.now().with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).atStartOfDay();
        BigDecimal thisWeekRevenue = orderRepository.sumTodayRevenue(startOfWeek);
        if (thisWeekRevenue == null) thisWeekRevenue = BigDecimal.ZERO;

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        BigDecimal thisMonthRevenue = orderRepository.sumTodayRevenue(startOfMonth);
        if (thisMonthRevenue == null) thisMonthRevenue = BigDecimal.ZERO;

        List<ProductDTO> lowStockProducts = productService.getLowStockProducts(10);
        long lowStockCount = lowStockProducts.size();

        long totalDeliveryPersons = deliveryPersonRepository.count();
        long activeDeliveryPersons = deliveryPersonRepository.findAllByActiveTrue().size();

        long pendingDeliveries = preparing + outForDelivery;
        long completedDeliveries = completedOrders;

        List<OrderResponseDTO> recentOrders = orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(10)
                .map(orderService::mapToDTO)
                .collect(Collectors.toList());

        return AdminDashboardDTO.builder()
                .totalUsers(totalUsers)
                .totalCustomers(totalCustomers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .thisWeekRevenue(thisWeekRevenue)
                .thisMonthRevenue(thisMonthRevenue)
                .lowStockCount(lowStockCount)
                .totalDeliveryPersons(totalDeliveryPersons)
                .activeDeliveryPersons(activeDeliveryPersons)
                .pendingDeliveries(pendingDeliveries)
                .completedDeliveries(completedDeliveries)
                .recentOrders(recentOrders)
                .lowStockProducts(lowStockProducts)
                .build();
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserDTO.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .phone(u.getPhone())
                        .role(u.getRole())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<DeliveryPersonDTO> getAllDeliveryPersons() {
        return deliveryPersonRepository.findAll().stream()
                .map(this::mapDeliveryPersonToDTO)
                .collect(Collectors.toList());
    }

    public DeliveryPersonDTO getDeliveryPersonById(Long id) {
        DeliveryPerson dp = deliveryPersonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery person not found with id: " + id));
        return mapDeliveryPersonToDTO(dp);
    }

    @Transactional
    public DeliveryPersonDTO createDeliveryPerson(DeliveryPersonCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("User already exists with email: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phone(request.getPhone().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_DELIVERY_PERSON)
                .build();

        User savedUser = userRepository.save(user);

        DeliveryPerson deliveryPerson = DeliveryPerson.builder()
                .user(savedUser)
                .name(request.getName().trim())
                .phone(request.getPhone().trim())
                .vehicleType(request.getVehicleType())
                .vehicleNumber(request.getVehicleNumber())
                .licenseNumber(request.getLicenseNumber())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        DeliveryPerson savedDp = deliveryPersonRepository.save(deliveryPerson);
        return mapDeliveryPersonToDTO(savedDp);
    }

    @Transactional
    public DeliveryPersonDTO updateDeliveryPerson(Long id, DeliveryPersonDTO dto) {
        DeliveryPerson dp = deliveryPersonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery person not found with id: " + id));

        dp.setName(dto.getName());
        dp.setPhone(dto.getPhone());
        dp.setVehicleType(dto.getVehicleType());
        dp.setVehicleNumber(dto.getVehicleNumber());
        dp.setLicenseNumber(dto.getLicenseNumber());
        if (dto.getActive() != null) dp.setActive(dto.getActive());

        User user = dp.getUser();
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        userRepository.save(user);

        return mapDeliveryPersonToDTO(deliveryPersonRepository.save(dp));
    }

    @Transactional
    public DeliveryPersonDTO toggleDeliveryPersonStatus(Long id, boolean active) {
        DeliveryPerson dp = deliveryPersonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery person not found with id: " + id));
        dp.setActive(active);
        return mapDeliveryPersonToDTO(deliveryPersonRepository.save(dp));
    }

    @Transactional
    public void deleteDeliveryPerson(Long id) {
        DeliveryPerson dp = deliveryPersonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery person not found with id: " + id));
        dp.setActive(false);
        deliveryPersonRepository.save(dp);
    }

    public DeliveryPersonDTO mapDeliveryPersonToDTO(DeliveryPerson dp) {
        long assignedCount = orderRepository.countByDeliveryPerson(dp);
        long completedCount = orderRepository.countByDeliveryPersonAndStatus(dp, OrderStatus.DELIVERED);

        return DeliveryPersonDTO.builder()
                .id(dp.getId())
                .userId(dp.getUser().getId())
                .name(dp.getName())
                .email(dp.getUser().getEmail())
                .phone(dp.getPhone())
                .vehicleType(dp.getVehicleType())
                .vehicleNumber(dp.getVehicleNumber())
                .licenseNumber(dp.getLicenseNumber())
                .active(dp.getActive())
                .assignedOrdersCount(assignedCount)
                .completedOrdersCount(completedCount)
                .createdAt(dp.getCreatedAt())
                .build();
    }
}
