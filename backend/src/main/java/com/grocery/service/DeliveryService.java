package com.grocery.service;

import com.grocery.dto.DeliveryDashboardDTO;
import com.grocery.dto.DeliveryPersonDTO;
import com.grocery.dto.OrderResponseDTO;
import com.grocery.dto.OrderStatusUpdateRequest;
import com.grocery.entity.DeliveryPerson;
import com.grocery.entity.Order;
import com.grocery.entity.OrderStatus;
import com.grocery.entity.PaymentStatus;
import com.grocery.entity.User;
import com.grocery.exception.BadRequestException;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.exception.UnauthorizedException;
import com.grocery.repository.DeliveryPersonRepository;
import com.grocery.repository.OrderRepository;
import com.grocery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryPersonRepository deliveryPersonRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;
    private final NotificationService notificationService;

    public DeliveryPerson getAuthenticatedDeliveryPerson(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return deliveryPersonRepository.findByUser(user)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user is not registered as a delivery person"));
    }

    public DeliveryDashboardDTO getDeliveryDashboard(Long userId) {
        DeliveryPerson dp = getAuthenticatedDeliveryPerson(userId);

        List<Order> allAssigned = orderRepository.findByDeliveryPersonOrderByCreatedAtDesc(dp);

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        long todayTotal = allAssigned.stream()
                .filter(o -> o.getAssignedAt() != null && o.getAssignedAt().isAfter(startOfToday))
                .count();

        long pending = allAssigned.stream()
                .filter(o -> o.getStatus() == OrderStatus.PREPARING || o.getStatus() == OrderStatus.CONFIRMED || o.getStatus() == OrderStatus.PLACED)
                .count();

        long outForDelivery = allAssigned.stream()
                .filter(o -> o.getStatus() == OrderStatus.OUT_FOR_DELIVERY)
                .count();

        long completed = allAssigned.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .count();

        List<OrderResponseDTO> assignedActiveOrders = allAssigned.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(orderService::mapToDTO)
                .collect(Collectors.toList());

        DeliveryPersonDTO dpDTO = DeliveryPersonDTO.builder()
                .id(dp.getId())
                .userId(dp.getUser().getId())
                .name(dp.getName())
                .email(dp.getUser().getEmail())
                .phone(dp.getPhone())
                .vehicleType(dp.getVehicleType())
                .vehicleNumber(dp.getVehicleNumber())
                .active(dp.getActive())
                .assignedOrdersCount((long) allAssigned.size())
                .completedOrdersCount(completed)
                .createdAt(dp.getCreatedAt())
                .build();

        return DeliveryDashboardDTO.builder()
                .deliveryPerson(dpDTO)
                .todayTotalDeliveries(todayTotal)
                .pendingDeliveries(pending)
                .outForDeliveryCount(outForDelivery)
                .completedDeliveries(completed)
                .assignedOrders(assignedActiveOrders)
                .build();
    }

    public List<OrderResponseDTO> getAssignedOrders(Long userId) {
        DeliveryPerson dp = getAuthenticatedDeliveryPerson(userId);
        return orderRepository.findByDeliveryPersonOrderByCreatedAtDesc(dp).stream()
                .map(orderService::mapToDTO)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderById(Long userId, Long orderId) {
        DeliveryPerson dp = getAuthenticatedDeliveryPerson(userId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getDeliveryPerson() == null || !order.getDeliveryPerson().getId().equals(dp.getId())) {
            throw new UnauthorizedException("You are not authorized to access this order");
        }

        return orderService.mapToDTO(order);
    }

    @Transactional
    public OrderResponseDTO acceptDelivery(Long userId, Long orderId) {
        DeliveryPerson dp = getAuthenticatedDeliveryPerson(userId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getDeliveryPerson() == null || !order.getDeliveryPerson().getId().equals(dp.getId())) {
            throw new UnauthorizedException("You are not assigned to this order");
        }

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot accept order with status " + order.getStatus());
        }

        // Notify customer that delivery agent acknowledged/accepted the pickup
        notificationService.createNotification(order.getUser(), order.getId(),
                "Your order #NK" + order.getId() + " has been accepted by delivery partner " + dp.getName() + " and is being prepared.");

        return orderService.mapToDTO(order);
    }

    @Transactional
    public OrderResponseDTO updateDeliveryStatus(Long userId, Long orderId, OrderStatusUpdateRequest request) {
        DeliveryPerson dp = getAuthenticatedDeliveryPerson(userId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getDeliveryPerson() == null || !order.getDeliveryPerson().getId().equals(dp.getId())) {
            throw new UnauthorizedException("You are not authorized to update this order");
        }

        OrderStatus current = order.getStatus();
        OrderStatus target = request.getStatus();

        if (target == OrderStatus.OUT_FOR_DELIVERY) {
            if (current != OrderStatus.PREPARING && current != OrderStatus.CONFIRMED && current != OrderStatus.PLACED) {
                throw new BadRequestException("Order cannot be marked OUT_FOR_DELIVERY from status " + current);
            }
            order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
            order.setPickedUpAt(LocalDateTime.now());

            notificationService.createNotification(order.getUser(), order.getId(),
                    "Your order #NK" + order.getId() + " is now out for delivery with " + dp.getName() + " (" + dp.getPhone() + ").");

        } else if (target == OrderStatus.DELIVERED) {
            if (current != OrderStatus.OUT_FOR_DELIVERY) {
                throw new BadRequestException("Order must be OUT_FOR_DELIVERY before marking as DELIVERED");
            }
            order.setStatus(OrderStatus.DELIVERED);
            order.setDeliveredAt(LocalDateTime.now());
            order.setPaymentStatus(PaymentStatus.PAID);

            notificationService.createNotification(order.getUser(), order.getId(),
                    "Your order #NK" + order.getId() + " has been delivered! Please rate your items.");

        } else {
            throw new BadRequestException("Delivery persons can only update status to OUT_FOR_DELIVERY or DELIVERED");
        }

        Order saved = orderRepository.save(order);
        return orderService.mapToDTO(saved);
    }

    public List<OrderResponseDTO> getDeliveryHistory(Long userId, String period) {
        DeliveryPerson dp = getAuthenticatedDeliveryPerson(userId);
        List<Order> orders = orderRepository.findByDeliveryPersonOrderByCreatedAtDesc(dp);

        LocalDateTime now = LocalDateTime.now();
        if ("today".equalsIgnoreCase(period)) {
            LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
            orders = orders.stream()
                    .filter(o -> o.getDeliveredAt() != null && o.getDeliveredAt().isAfter(startOfToday))
                    .collect(Collectors.toList());
        } else if ("week".equalsIgnoreCase(period)) {
            LocalDateTime weekAgo = now.minusDays(7);
            orders = orders.stream()
                    .filter(o -> o.getDeliveredAt() != null && o.getDeliveredAt().isAfter(weekAgo))
                    .collect(Collectors.toList());
        } else {
            orders = orders.stream()
                    .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                    .collect(Collectors.toList());
        }

        return orders.stream().map(orderService::mapToDTO).collect(Collectors.toList());
    }

    public DeliveryPersonDTO getDeliveryProfile(Long userId) {
        DeliveryPerson dp = getAuthenticatedDeliveryPerson(userId);
        long completed = orderRepository.countByDeliveryPersonAndStatus(dp, OrderStatus.DELIVERED);
        long total = orderRepository.countByDeliveryPerson(dp);

        return DeliveryPersonDTO.builder()
                .id(dp.getId())
                .userId(dp.getUser().getId())
                .name(dp.getName())
                .email(dp.getUser().getEmail())
                .phone(dp.getPhone())
                .vehicleType(dp.getVehicleType())
                .vehicleNumber(dp.getVehicleNumber())
                .active(dp.getActive())
                .assignedOrdersCount(total)
                .completedOrdersCount(completed)
                .createdAt(dp.getCreatedAt())
                .build();
    }

    @Transactional
    public DeliveryPersonDTO updateDeliveryProfile(Long userId, DeliveryPersonDTO dto) {
        DeliveryPerson dp = getAuthenticatedDeliveryPerson(userId);

        if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()) {
            dp.setPhone(dto.getPhone().trim());
            dp.getUser().setPhone(dto.getPhone().trim());
            userRepository.save(dp.getUser());
        }
        if (dto.getVehicleType() != null) dp.setVehicleType(dto.getVehicleType());
        if (dto.getVehicleNumber() != null) dp.setVehicleNumber(dto.getVehicleNumber());

        DeliveryPerson saved = deliveryPersonRepository.save(dp);
        return getDeliveryProfile(userId);
    }
}
