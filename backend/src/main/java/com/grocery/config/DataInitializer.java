package com.grocery.config;

import com.grocery.entity.Address;
import com.grocery.entity.Cart;
import com.grocery.entity.Category;
import com.grocery.entity.Coupon;
import com.grocery.entity.DeliveryPerson;
import com.grocery.entity.DeliverySlot;
import com.grocery.entity.Notification;
import com.grocery.entity.Order;
import com.grocery.entity.OrderItem;
import com.grocery.entity.OrderStatus;
import com.grocery.entity.PaymentMethod;
import com.grocery.entity.PaymentStatus;
import com.grocery.entity.Product;
import com.grocery.entity.Review;
import com.grocery.entity.Role;
import com.grocery.entity.User;
import com.grocery.repository.AddressRepository;
import com.grocery.repository.CartRepository;
import com.grocery.repository.CategoryRepository;
import com.grocery.repository.CouponRepository;
import com.grocery.repository.DeliveryPersonRepository;
import com.grocery.repository.DeliverySlotRepository;
import com.grocery.repository.NotificationRepository;
import com.grocery.repository.OrderItemRepository;
import com.grocery.repository.OrderRepository;
import com.grocery.repository.ProductRepository;
import com.grocery.repository.ReviewRepository;
import com.grocery.repository.UserRepository;
import com.grocery.repository.ExpiryRuleRepository;
import com.grocery.entity.ExpiryRule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CouponRepository couponRepository;
    private final DeliverySlotRepository deliverySlotRepository;
    private final DeliveryPersonRepository deliveryPersonRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;
    private final ExpiryRuleRepository expiryRuleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (expiryRuleRepository.count() == 0) {
            expiryRuleRepository.save(ExpiryRule.builder().minDays(3).maxDays(7).discountPercentage(BigDecimal.valueOf(20.0)).active(true).build());
            expiryRuleRepository.save(ExpiryRule.builder().minDays(1).maxDays(2).discountPercentage(BigDecimal.valueOf(43.0)).active(true).build());
        }

        if (userRepository.count() > 0) {
            log.info("Database already initialized with seed data.");
            return;
        }

        log.info("Starting Namma Kart database seed data initialization...");

        // 1. Users (Admin, Customers, Delivery Persons)
        User admin = userRepository.save(User.builder()
                .name("Admin Manager")
                .email("admin@grocery.com")
                .phone("9876543210")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ROLE_ADMIN)
                .build());

        User cust1 = userRepository.save(User.builder()
                .name("Nandini Sharma")
                .email("customer@grocery.com")
                .phone("9880011223")
                .password(passwordEncoder.encode("Customer@123"))
                .role(Role.ROLE_CUSTOMER)
                .build());

        User cust2 = userRepository.save(User.builder()
                .name("Rahul Hegde")
                .email("rahul@grocery.com")
                .phone("9845012345")
                .password(passwordEncoder.encode("Customer@123"))
                .role(Role.ROLE_CUSTOMER)
                .build());

        User cust3 = userRepository.save(User.builder()
                .name("Priya Rao")
                .email("priya@grocery.com")
                .phone("9900123456")
                .password(passwordEncoder.encode("Customer@123"))
                .role(Role.ROLE_CUSTOMER)
                .build());

        User cust4 = userRepository.save(User.builder()
                .name("Ananya Bhat")
                .email("ananya@grocery.com")
                .phone("9740112233")
                .password(passwordEncoder.encode("Customer@123"))
                .role(Role.ROLE_CUSTOMER)
                .build());

        User cust5 = userRepository.save(User.builder()
                .name("Karthik Shetty")
                .email("karthik@grocery.com")
                .phone("9632011224")
                .password(passwordEncoder.encode("Customer@123"))
                .role(Role.ROLE_CUSTOMER)
                .build());

        // Create empty carts for customers
        for (User u : List.of(cust1, cust2, cust3, cust4, cust5)) {
            cartRepository.save(Cart.builder().user(u).items(new ArrayList<>()).build());
        }

        // 2. Delivery Person Users & Entities
        User dpUser1 = userRepository.save(User.builder()
                .name("Raghuveer Gowda")
                .email("delivery@grocery.com")
                .phone("9123456780")
                .password(passwordEncoder.encode("Delivery@123"))
                .role(Role.ROLE_DELIVERY_PERSON)
                .build());

        DeliveryPerson dp1 = deliveryPersonRepository.save(DeliveryPerson.builder()
                .user(dpUser1)
                .name("Raghuveer Gowda")
                .phone("9123456780")
                .vehicleType("Electric Scooter")
                .vehicleNumber("KA-04-EV-1024")
                .active(true)
                .build());

        User dpUser2 = userRepository.save(User.builder()
                .name("Suresh Kumar")
                .email("suresh@delivery.com")
                .phone("9871234567")
                .password(passwordEncoder.encode("Delivery@123"))
                .role(Role.ROLE_DELIVERY_PERSON)
                .build());

        DeliveryPerson dp2 = deliveryPersonRepository.save(DeliveryPerson.builder()
                .user(dpUser2)
                .name("Suresh Kumar")
                .phone("9871234567")
                .vehicleType("Honda Activa 6G")
                .vehicleNumber("KA-05-HL-4521")
                .active(true)
                .build());

        User dpUser3 = userRepository.save(User.builder()
                .name("Ramesh Nayak")
                .email("ramesh@delivery.com")
                .phone("9988776655")
                .password(passwordEncoder.encode("Delivery@123"))
                .role(Role.ROLE_DELIVERY_PERSON)
                .build());

        DeliveryPerson dp3 = deliveryPersonRepository.save(DeliveryPerson.builder()
                .user(dpUser3)
                .name("Ramesh Nayak")
                .phone("9988776655")
                .vehicleType("TVS iQube Electric")
                .vehicleNumber("KA-01-EQ-8890")
                .active(true)
                .build());

        // 3. Customer Addresses
        Address addr1 = addressRepository.save(Address.builder()
                .user(cust1)
                .addressLine("Flat 302, Green Glen Layout, Bellandur")
                .city("Bengaluru")
                .state("Karnataka")
                .pincode("560103")
                .isDefault(true)
                .build());

        Address addr2 = addressRepository.save(Address.builder()
                .user(cust1)
                .addressLine("#45, 12th Main, 4th Block, Koramangala")
                .city("Bengaluru")
                .state("Karnataka")
                .pincode("560034")
                .isDefault(false)
                .build());

        Address addr3 = addressRepository.save(Address.builder()
                .user(cust2)
                .addressLine("Villa 12, Palm Meadows, Whitefield")
                .city("Bengaluru")
                .state("Karnataka")
                .pincode("560066")
                .isDefault(true)
                .build());

        Address addr4 = addressRepository.save(Address.builder()
                .user(cust3)
                .addressLine("No 88, 100ft Road, Indiranagar")
                .city("Bengaluru")
                .state("Karnataka")
                .pincode("560038")
                .isDefault(true)
                .build());

        // 4. Delivery Slots
        DeliverySlot slot1 = deliverySlotRepository.save(DeliverySlot.builder()
                .slotName("Early Morning Express")
                .startTime("06:00 AM")
                .endTime("09:00 AM")
                .maximumOrders(40)
                .available(true)
                .active(true)
                .build());

        DeliverySlot slot2 = deliverySlotRepository.save(DeliverySlot.builder()
                .slotName("Morning Slot")
                .startTime("09:00 AM")
                .endTime("12:00 PM")
                .maximumOrders(50)
                .available(true)
                .active(true)
                .build());

        DeliverySlot slot3 = deliverySlotRepository.save(DeliverySlot.builder()
                .slotName("Afternoon Slot")
                .startTime("02:00 PM")
                .endTime("05:00 PM")
                .maximumOrders(50)
                .available(true)
                .active(true)
                .build());

        DeliverySlot slot4 = deliverySlotRepository.save(DeliverySlot.builder()
                .slotName("Evening Prime")
                .startTime("06:00 PM")
                .endTime("09:00 PM")
                .maximumOrders(60)
                .available(true)
                .active(true)
                .build());

        // 5. Coupons
        Coupon c1 = couponRepository.save(Coupon.builder()
                .code("WELCOME50")
                .discountType("PERCENTAGE")
                .discountValue(BigDecimal.valueOf(50))
                .minimumOrderAmount(BigDecimal.valueOf(199))
                .maximumDiscount(BigDecimal.valueOf(100))
                .expiryDate(LocalDate.now().plusMonths(3))
                .active(true)
                .build());

        Coupon c2 = couponRepository.save(Coupon.builder()
                .code("FRESH20")
                .discountType("PERCENTAGE")
                .discountValue(BigDecimal.valueOf(20))
                .minimumOrderAmount(BigDecimal.valueOf(299))
                .maximumDiscount(BigDecimal.valueOf(150))
                .expiryDate(LocalDate.now().plusMonths(2))
                .active(true)
                .build());

        Coupon c3 = couponRepository.save(Coupon.builder()
                .code("NAMMA100")
                .discountType("FLAT")
                .discountValue(BigDecimal.valueOf(100))
                .minimumOrderAmount(BigDecimal.valueOf(699))
                .expiryDate(LocalDate.now().plusMonths(6))
                .active(true)
                .build());

        Coupon c4 = couponRepository.save(Coupon.builder()
                .code("VEGGIE10")
                .discountType("PERCENTAGE")
                .discountValue(BigDecimal.valueOf(10))
                .minimumOrderAmount(BigDecimal.valueOf(149))
                .maximumDiscount(BigDecimal.valueOf(50))
                .expiryDate(LocalDate.now().plusMonths(1))
                .active(true)
                .build());

        Coupon c5 = couponRepository.save(Coupon.builder()
                .code("SUPERKART")
                .discountType("FLAT")
                .discountValue(BigDecimal.valueOf(150))
                .minimumOrderAmount(BigDecimal.valueOf(999))
                .expiryDate(LocalDate.now().plusMonths(4))
                .active(true)
                .build());

        // 6. Categories (8+ categories)
        Category catFV = categoryRepository.save(Category.builder()
                .name("Fruits & Vegetables")
                .description("Farm fresh organic fruits and crisp seasonal vegetables")
                .imageUrl("https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80")
                .active(true)
                .build());

        Category catDairy = categoryRepository.save(Category.builder()
                .name("Dairy, Bread & Eggs")
                .description("Fresh milk, cultured butter, paneer, brown bread & farm eggs")
                .imageUrl("https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80")
                .active(true)
                .build());

        Category catSnacks = categoryRepository.save(Category.builder()
                .name("Snacks & Munchies")
                .description("Crunchy chips, roasted nuts, namkeen, wafers and bites")
                .imageUrl("https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80")
                .active(true)
                .build());

        Category catDrinks = categoryRepository.save(Category.builder()
                .name("Cold Drinks & Juices")
                .description("Refreshing natural juices, coconut water, sodas and mocktails")
                .imageUrl("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80")
                .active(true)
                .build());

        Category catInstant = categoryRepository.save(Category.builder()
                .name("Instant & Frozen Food")
                .description("Ready-to-eat meals, instant noodles, frozen snacks and peas")
                .imageUrl("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80")
                .active(true)
                .build());

        Category catTeaCoffee = categoryRepository.save(Category.builder()
                .name("Tea, Coffee & Health Drinks")
                .description("Authentic filter coffee, green tea, masala chai and protein drinks")
                .imageUrl("https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80")
                .active(true)
                .build());

        Category catBakery = categoryRepository.save(Category.builder()
                .name("Bakery & Biscuits")
                .description("Freshly baked cookies, rusks, cakes, artisanal breads and buns")
                .imageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80")
                .active(true)
                .build());

        Category catStaples = categoryRepository.save(Category.builder()
                .name("Atta, Rice & Dal")
                .description("Pure chakki whole wheat atta, Sona Masoori rice, organic pulses and lentils")
                .imageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80")
                .active(true)
                .build());

        Category catOrganic = categoryRepository.save(Category.builder()
                .name("Organic & Gourmet")
                .description("Cold-pressed virgin oils, wildflower honey, and artisan spices")
                .imageUrl("https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80")
                .active(true)
                .build());

        // 7. Products (30+ products)
        List<Product> products = new ArrayList<>();

        // Fruits & Veg
        products.add(Product.builder().category(catFV).name("Tomato").description("Locally sourced ripe, firm tomatoes rich in vitamins.").price(BigDecimal.valueOf(38.00)).stock(120).unit("1 kg").minQuantity(1).maxQuantity(10).imageUrl("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(15)).rating(BigDecimal.valueOf(4.8)).active(true).build());
        products.add(Product.builder().category(catFV).name("Red Onion").description("Crisp, pungent onions perfect for everyday curries and salads.").price(BigDecimal.valueOf(42.00)).stock(150).unit("1 kg").minQuantity(1).maxQuantity(10).imageUrl("https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(10)).rating(BigDecimal.valueOf(4.6)).active(true).build());
        products.add(Product.builder().category(catFV).name("Baby Potato").description("Freshly harvested small potatoes ideal for roasting and curries.").price(BigDecimal.valueOf(32.00)).stock(95).unit("1 kg").minQuantity(1).maxQuantity(10).imageUrl("https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.ZERO).rating(BigDecimal.valueOf(4.5)).active(true).build());
        products.add(Product.builder().category(catFV).name("Banana").description("Naturally ripened golden yellow sweet bananas.").price(BigDecimal.valueOf(48.00)).stock(80).unit("1 kg").minQuantity(1).maxQuantity(10).imageUrl("https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(12)).rating(BigDecimal.valueOf(4.9)).active(true).build());
        products.add(Product.builder().category(catFV).name("Apple").description("Crisp, juicy and fragrant mountain apples from Himachal.").price(BigDecimal.valueOf(160.00)).stock(50).unit("1 kg").minQuantity(1).maxQuantity(10).imageUrl("https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(10)).rating(BigDecimal.valueOf(4.7)).active(true).build());
        products.add(Product.builder().category(catFV).name("Coriander & Mint").description("Aromatic fresh kitchen herbs delivered chilled.").price(BigDecimal.valueOf(25.00)).stock(60).unit("1 pack").minQuantity(1).maxQuantity(10).imageUrl("https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.ZERO).rating(BigDecimal.valueOf(4.4)).active(true).build());

        // Dairy & Eggs
        products.add(Product.builder().category(catDairy).name("Milk").description("Fresh pasteurized standardized milk with 4.5% fat from KMF dairy.").price(BigDecimal.valueOf(28.00)).stock(200).unit("500 ml").imageUrl("https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.ZERO).rating(BigDecimal.valueOf(4.9)).active(true).build());
        products.add(Product.builder().category(catDairy).name("Butter").description("Delicious creamy butter made from pure milk fat.").price(BigDecimal.valueOf(56.00)).stock(110).unit("100 g").imageUrl("https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(5)).rating(BigDecimal.valueOf(4.8)).active(true).build());
        products.add(Product.builder().category(catDairy).name("Paneer").description("Super soft and melt-in-mouth cottage cheese blocks.").price(BigDecimal.valueOf(95.00)).stock(65).unit("200 g").imageUrl("https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(8)).rating(BigDecimal.valueOf(4.7)).active(true).build());
        products.add(Product.builder().category(catDairy).name("Brown Eggs").description("Nutrient rich free range brown eggs with golden yolk.").price(BigDecimal.valueOf(85.00)).stock(90).unit("6 pcs").imageUrl("https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(10)).rating(BigDecimal.valueOf(4.8)).active(true).build());
        products.add(Product.builder().category(catDairy).name("Curd").description("Thick, rich and creamy homemade-style probiotic curd.").price(BigDecimal.valueOf(35.00)).stock(80).unit("400 g").imageUrl("https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.ZERO).rating(BigDecimal.valueOf(4.6)).active(true).build());

        // Staples (Atta, Rice, Dal)
        products.add(Product.builder().category(catStaples).name("Atta").description("100% pure whole wheat flour processed with traditional stone chakki.").price(BigDecimal.valueOf(245.00)).stock(75).unit("5 kg").imageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(12)).rating(BigDecimal.valueOf(4.8)).active(true).build());
        products.add(Product.builder().category(catStaples).name("Sona Masoori Rice").description("Aged fragrant polished grain rice ideal for South Indian meals.").price(BigDecimal.valueOf(340.00)).stock(60).unit("5 kg").imageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(15)).rating(BigDecimal.valueOf(4.7)).active(true).build());
        products.add(Product.builder().category(catStaples).name("Toor Dal").description("Rich in dietary protein without artificial chemical polish.").price(BigDecimal.valueOf(175.00)).stock(85).unit("1 kg").imageUrl("https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(10)).rating(BigDecimal.valueOf(4.9)).active(true).build());
        products.add(Product.builder().category(catStaples).name("Sunflower Oil").description("Enriched with vitamins A & D for healthy heart cooking.").price(BigDecimal.valueOf(135.00)).stock(95).unit("1 L").imageUrl("https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(8)).rating(BigDecimal.valueOf(4.6)).active(true).build());
        products.add(Product.builder().category(catStaples).name("Salt").description("Desh ka namak with vacuum evaporated purity.").price(BigDecimal.valueOf(28.00)).stock(150).unit("1 kg").imageUrl("https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.ZERO).rating(BigDecimal.valueOf(4.9)).active(true).build());

        // Snacks & Munchies
        products.add(Product.builder().category(catSnacks).name("Lay's Chips").description("Crispy spiced potato chips seasoned with authentic Indian herbs.").price(BigDecimal.valueOf(20.00)).stock(180).unit("50 g").imageUrl("https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.ZERO).rating(BigDecimal.valueOf(4.7)).active(true).build());
        products.add(Product.builder().category(catSnacks).name("Bhujia Sev").description("Classic spicy moth bean and besan noodle snack.").price(BigDecimal.valueOf(65.00)).stock(100).unit("200 g").imageUrl("https://images.unsplash.com/photo-1621996346565-e3d5d62810b7?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(5)).rating(BigDecimal.valueOf(4.6)).active(true).build());
        products.add(Product.builder().category(catSnacks).name("Almonds").description("Crunchy lightly salted California whole almonds.").price(BigDecimal.valueOf(299.00)).stock(40).unit("200 g").imageUrl("https://images.unsplash.com/photo-1508061252966-f72fb9822365?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(20)).rating(BigDecimal.valueOf(4.9)).active(true).build());
        products.add(Product.builder().category(catSnacks).name("Kurkure").description("Chatpata crunchy corn puff namkeen snack.").price(BigDecimal.valueOf(20.00)).stock(140).unit("75 g").imageUrl("https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.ZERO).rating(BigDecimal.valueOf(4.5)).active(true).build());

        // Cold Drinks & Juices
        products.add(Product.builder().category(catDrinks).name("Coconut Water").description("100% pure tender coconut water with naturally balanced electrolytes.").price(BigDecimal.valueOf(60.00)).stock(90).unit("200 ml").imageUrl("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(10)).rating(BigDecimal.valueOf(4.8)).active(true).build());
        products.add(Product.builder().category(catDrinks).name("Orange Juice").description("No added sugar, pure Valencia orange juice rich in vitamin C.").price(BigDecimal.valueOf(130.00)).stock(70).unit("1 L").imageUrl("https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(15)).rating(BigDecimal.valueOf(4.6)).active(true).build());
        products.add(Product.builder().category(catDrinks).name("Thums Up").description("Taste the thunder with bold fizzy cola kick.").price(BigDecimal.valueOf(40.00)).stock(120).unit("750 ml").imageUrl("https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.ZERO).rating(BigDecimal.valueOf(4.7)).active(true).build());

        // Instant & Frozen
        products.add(Product.builder().category(catInstant).name("Maggi 2-Minute Masala Noodles").description("Favorite instant noodles enriched with iron and 10 spices.").price(BigDecimal.valueOf(55.00)).stock(160).unit("Pack of 4 (280g)").imageUrl("https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(5)).rating(BigDecimal.valueOf(4.9)).active(true).build());
        products.add(Product.builder().category(catInstant).name("ID Fresh 100% Natural Idly & Dosa Batter").description("Traditional stone ground naturally fermented ready batter.").price(BigDecimal.valueOf(80.00)).stock(60).unit("1 kg pack").imageUrl("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(10)).rating(BigDecimal.valueOf(4.8)).active(true).build());
        products.add(Product.builder().category(catInstant).name("McCain French Fries (Crispy Golden)").description("Crunchy frozen potato fries ready in 3 minutes.").price(BigDecimal.valueOf(125.00)).stock(50).unit("420 g").imageUrl("https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(12)).rating(BigDecimal.valueOf(4.6)).active(true).build());

        // Tea, Coffee & Health
        products.add(Product.builder().category(catTeaCoffee).name("Cothas Coffee Special Filter Blend").description("85% Coffee and 15% Chicory rich South Indian traditional filter coffee.").price(BigDecimal.valueOf(140.00)).stock(85).unit("500 g").imageUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(10)).rating(BigDecimal.valueOf(4.9)).active(true).build());
        products.add(Product.builder().category(catTeaCoffee).name("Wagh Bakri Premium CTC Leaf Tea").description("Strong aroma, rich liquor and deep invigorating taste.").price(BigDecimal.valueOf(155.00)).stock(90).unit("500 g").imageUrl("https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(8)).rating(BigDecimal.valueOf(4.7)).active(true).build());
        products.add(Product.builder().category(catTeaCoffee).name("Bournvita Cadbury Chocolate Health Drink").description("Inner strength formula with vitamin D and calcium.").price(BigDecimal.valueOf(225.00)).stock(60).unit("500 g jar").imageUrl("https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(15)).rating(BigDecimal.valueOf(4.6)).active(true).build());

        // Bakery & Biscuits
        products.add(Product.builder().category(catBakery).name("Modern 100% Whole Wheat Brown Bread").description("High fiber freshly baked daily brown sandwich bread.").price(BigDecimal.valueOf(45.00)).stock(75).unit("400 g loaf").imageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.ZERO).rating(BigDecimal.valueOf(4.5)).active(true).build());
        products.add(Product.builder().category(catBakery).name("Britannia Good Day Butter Cookies").description("Rich melt-in-mouth cashew butter biscuits.").price(BigDecimal.valueOf(35.00)).stock(130).unit("200 g pack").imageUrl("https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(5)).rating(BigDecimal.valueOf(4.7)).active(true).build());
        products.add(Product.builder().category(catBakery).name("Sunfeast Dark Fantasy Choco Fills").description("Crispy chocolate biscuit filled with luscious molten choco lava.").price(BigDecimal.valueOf(75.00)).stock(110).unit("300 g").imageUrl("https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(15)).rating(BigDecimal.valueOf(4.9)).active(true).build());

        // Organic & Gourmet
        products.add(Product.builder().category(catOrganic).name("24 Mantra Organic Extra Virgin Cold Pressed Coconut Oil").description("100% pure organic edible coconut oil from fresh coconuts.").price(BigDecimal.valueOf(270.00)).stock(45).unit("500 ml glass bottle").imageUrl("https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(10)).rating(BigDecimal.valueOf(4.8)).active(true).build());
        products.add(Product.builder().category(catOrganic).name("Dabur 100% Pure Wildflower Honey").description("Natural source of immunity booster antioxidants.").price(BigDecimal.valueOf(199.00)).stock(65).unit("400 g squeezy").imageUrl("https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80").discount(BigDecimal.valueOf(20)).rating(BigDecimal.valueOf(4.7)).active(true).build());

        List<Product> savedProducts = productRepository.saveAll(products);

        // 8. Sample Demo Orders in various stages for realistic hackathon demonstration!

        // Order 1: Delivered Order (Cust1 -> DP1) with review
        Order o1 = Order.builder()
                .user(cust1)
                .address(addr1)
                .deliverySlot(slot1)
                .deliveryPerson(dp1)
                .subtotal(BigDecimal.valueOf(460.00))
                .deliveryCharge(BigDecimal.valueOf(30.00))
                .discount(BigDecimal.valueOf(45.00))
                .couponDiscount(BigDecimal.ZERO)
                .totalAmount(BigDecimal.valueOf(490.00))
                .paymentMethod(PaymentMethod.UPI)
                .paymentStatus(PaymentStatus.PAID)
                .status(OrderStatus.DELIVERED)
                .notes("Please ring the bell twice and leave at the doorstep.")
                .assignedAt(LocalDateTime.now().minusDays(1).withHour(7).withMinute(15))
                .pickedUpAt(LocalDateTime.now().minusDays(1).withHour(7).withMinute(45))
                .deliveredAt(LocalDateTime.now().minusDays(1).withHour(8).withMinute(20))
                .createdAt(LocalDateTime.now().minusDays(1).withHour(6).withMinute(30))
                .items(new ArrayList<>())
                .build();
        Order savedO1 = orderRepository.save(o1);

        OrderItem oi1 = orderItemRepository.save(OrderItem.builder().order(savedO1).product(savedProducts.get(0)).productName(savedProducts.get(0).getName()).quantity(2).price(BigDecimal.valueOf(32.30)).subtotal(BigDecimal.valueOf(64.60)).build());
        OrderItem oi2 = orderItemRepository.save(OrderItem.builder().order(savedO1).product(savedProducts.get(6)).productName(savedProducts.get(6).getName()).quantity(4).price(BigDecimal.valueOf(28.00)).subtotal(BigDecimal.valueOf(112.00)).build());
        OrderItem oi3 = orderItemRepository.save(OrderItem.builder().order(savedO1).product(savedProducts.get(11)).productName(savedProducts.get(11).getName()).quantity(1).price(BigDecimal.valueOf(215.60)).subtotal(BigDecimal.valueOf(215.60)).build());
        savedO1.getItems().addAll(List.of(oi1, oi2, oi3));

        // Sample Review on O1
        reviewRepository.save(Review.builder()
                .user(cust1)
                .product(savedProducts.get(0))
                .order(savedO1)
                .rating(5)
                .comment("Extremely fresh tomatoes delivered right on time! Super quality from Namma Kart.")
                .build());

        // Order 2: Active Out for Delivery Order (Cust1 -> DP1) for live demo
        Order o2 = Order.builder()
                .user(cust1)
                .address(addr1)
                .deliverySlot(slot2)
                .deliveryPerson(dp1)
                .subtotal(BigDecimal.valueOf(540.00))
                .deliveryCharge(BigDecimal.ZERO)
                .discount(BigDecimal.valueOf(60.00))
                .couponDiscount(BigDecimal.valueOf(50.00))
                .totalAmount(BigDecimal.valueOf(490.00))
                .paymentMethod(PaymentMethod.COD)
                .paymentStatus(PaymentStatus.PENDING)
                .status(OrderStatus.OUT_FOR_DELIVERY)
                .notes("Fresh bread and eggs needed urgently.")
                .assignedAt(LocalDateTime.now().minusHours(1))
                .pickedUpAt(LocalDateTime.now().minusMinutes(25))
                .createdAt(LocalDateTime.now().minusHours(2))
                .items(new ArrayList<>())
                .build();
        Order savedO2 = orderRepository.save(o2);

        OrderItem oi4 = orderItemRepository.save(OrderItem.builder().order(savedO2).product(savedProducts.get(7)).productName(savedProducts.get(7).getName()).quantity(2).price(BigDecimal.valueOf(53.20)).subtotal(BigDecimal.valueOf(106.40)).build());
        OrderItem oi5 = orderItemRepository.save(OrderItem.builder().order(savedO2).product(savedProducts.get(9)).productName(savedProducts.get(9).getName()).quantity(2).price(BigDecimal.valueOf(76.50)).subtotal(BigDecimal.valueOf(153.00)).build());
        OrderItem oi6 = orderItemRepository.save(OrderItem.builder().order(savedO2).product(savedProducts.get(27)).productName(savedProducts.get(27).getName()).quantity(2).price(BigDecimal.valueOf(45.00)).subtotal(BigDecimal.valueOf(90.00)).build());
        savedO2.getItems().addAll(List.of(oi4, oi5, oi6));

        // Order 3: Preparing / Assigned Order (Cust2 -> DP1)
        Order o3 = Order.builder()
                .user(cust2)
                .address(addr3)
                .deliverySlot(slot3)
                .deliveryPerson(dp1)
                .subtotal(BigDecimal.valueOf(780.00))
                .deliveryCharge(BigDecimal.ZERO)
                .discount(BigDecimal.valueOf(80.00))
                .couponDiscount(BigDecimal.valueOf(100.00))
                .totalAmount(BigDecimal.valueOf(680.00))
                .paymentMethod(PaymentMethod.UPI)
                .paymentStatus(PaymentStatus.PAID)
                .status(OrderStatus.PREPARING)
                .notes("Please do not ring bell if baby is sleeping, call on phone.")
                .assignedAt(LocalDateTime.now().minusMinutes(30))
                .createdAt(LocalDateTime.now().minusMinutes(45))
                .items(new ArrayList<>())
                .build();
        Order savedO3 = orderRepository.save(o3);

        OrderItem oi7 = orderItemRepository.save(OrderItem.builder().order(savedO3).product(savedProducts.get(12)).productName(savedProducts.get(12).getName()).quantity(1).price(BigDecimal.valueOf(289.00)).subtotal(BigDecimal.valueOf(289.00)).build());
        OrderItem oi8 = orderItemRepository.save(OrderItem.builder().order(savedO3).product(savedProducts.get(18)).productName(savedProducts.get(18).getName()).quantity(1).price(BigDecimal.valueOf(239.20)).subtotal(BigDecimal.valueOf(239.20)).build());
        savedO3.getItems().addAll(List.of(oi7, oi8));

        // Order 4: Placed / Unassigned Order (Cust3) - ready for Admin assignment demo
        Order o4 = Order.builder()
                .user(cust3)
                .address(addr4)
                .deliverySlot(slot4)
                .deliveryPerson(null) // Unassigned
                .subtotal(BigDecimal.valueOf(320.00))
                .deliveryCharge(BigDecimal.valueOf(30.00))
                .discount(BigDecimal.valueOf(25.00))
                .couponDiscount(BigDecimal.ZERO)
                .totalAmount(BigDecimal.valueOf(350.00))
                .paymentMethod(PaymentMethod.COD)
                .paymentStatus(PaymentStatus.PENDING)
                .status(OrderStatus.PLACED)
                .notes("Kindly deliver before 8 PM.")
                .createdAt(LocalDateTime.now().minusMinutes(10))
                .items(new ArrayList<>())
                .build();
        Order savedO4 = orderRepository.save(o4);

        OrderItem oi9 = orderItemRepository.save(OrderItem.builder().order(savedO4).product(savedProducts.get(3)).productName(savedProducts.get(3).getName()).quantity(2).price(BigDecimal.valueOf(42.24)).subtotal(BigDecimal.valueOf(84.48)).build());
        OrderItem oi10 = orderItemRepository.save(OrderItem.builder().order(savedO4).product(savedProducts.get(23)).productName(savedProducts.get(23).getName()).quantity(2).price(BigDecimal.valueOf(52.25)).subtotal(BigDecimal.valueOf(104.50)).build());
        savedO4.getItems().addAll(List.of(oi9, oi10));

        // 9. Initial Notifications
        notificationRepository.save(Notification.builder()
                .user(cust1)
                .orderId(savedO2.getId())
                .message("Your order #NK" + savedO2.getId() + " is now out for delivery with Raghuveer Gowda.")
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(dpUser1)
                .orderId(savedO3.getId())
                .message("New delivery assigned: Order #NK" + savedO3.getId() + " to Palm Meadows, Whitefield")
                .isRead(false)
                .build());

        log.info("Namma Kart database successfully initialized with rich seed data!");
    }
}
