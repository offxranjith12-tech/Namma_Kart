-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: nammakart_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address_line` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `is_default` bit(1) DEFAULT NULL,
  `pincode` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'Flat 302, Green Glen Layout, Bellandur','Bengaluru',_binary '','560103','Karnataka',2),(2,'#45, 12th Main, 4th Block, Koramangala','Bengaluru',_binary '\0','560034','Karnataka',2),(3,'Villa 12, Palm Meadows, Whitefield','Bengaluru',_binary '','560066','Karnataka',3),(4,'No 88, 100ft Road, Indiranagar','Bengaluru',_binary '','560038','Karnataka',4);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_9emlp6m95v5er2bcqkjsw48he` (`user_id`),
  CONSTRAINT `FKg5uhi8vpsuy0lgloxk2h4w5o6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,'2026-09-25 23:25:27.414125','2026-09-25 23:25:27.414125',2),(2,'2026-09-25 23:25:27.421915','2026-09-25 23:25:27.421915',3),(3,'2026-09-25 23:25:27.425293','2026-09-25 23:25:27.425293',4),(4,'2026-09-25 23:25:27.428534','2026-09-25 23:25:27.428534',5),(5,'2026-09-25 23:25:27.432315','2026-09-25 23:25:27.432315',6);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK99e0am9jpriwxcm6is7xfedy3` (`cart_id`),
  KEY `FK1re40cjegsfvw58xrkdp6bac6` (`product_id`),
  CONSTRAINT `FK1re40cjegsfvw58xrkdp6bac6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FK99e0am9jpriwxcm6is7xfedy3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `image_url` varchar(1000) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_t8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,_binary '','Farm fresh organic fruits and crisp seasonal vegetables','https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80','Fruits & Vegetables'),(2,_binary '','Fresh milk, cultured butter, paneer, brown bread & farm eggs','https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80','Dairy, Bread & Eggs'),(3,_binary '','Crunchy chips, roasted nuts, namkeen, wafers and bites','https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80','Snacks & Munchies'),(4,_binary '','Refreshing natural juices, coconut water, sodas and mocktails','https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80','Cold Drinks & Juices'),(5,_binary '','Ready-to-eat meals, instant noodles, frozen snacks and peas','https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80','Instant & Frozen Food'),(6,_binary '','Authentic filter coffee, green tea, masala chai and protein drinks','https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80','Tea, Coffee & Health Drinks'),(7,_binary '','Freshly baked cookies, rusks, cakes, artisanal breads and buns','https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80','Bakery & Biscuits'),(8,_binary '','Pure chakki whole wheat atta, Sona Masoori rice, organic pulses and lentils','https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80','Atta, Rice & Dal'),(9,_binary '','Cold-pressed virgin oils, wildflower honey, and artisan spices','https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80','Organic & Gourmet');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_type` varchar(255) NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `maximum_discount` decimal(10,2) DEFAULT NULL,
  `minimum_order_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_eplt0kkm9yf2of2lnx6c1oy9b` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,_binary '','WELCOME50','PERCENTAGE',50.00,'2026-12-26',100.00,199.00),(2,_binary '','FRESH20','PERCENTAGE',20.00,'2026-11-26',150.00,299.00),(3,_binary '','NAMMA100','FLAT',100.00,'2027-03-26',NULL,699.00),(4,_binary '','VEGGIE10','PERCENTAGE',10.00,'2026-10-26',50.00,149.00),(5,_binary '','SUPERKART','FLAT',150.00,'2027-01-26',NULL,999.00);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_persons`
--

DROP TABLE IF EXISTS `delivery_persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_persons` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `vehicle_number` varchar(255) DEFAULT NULL,
  `vehicle_type` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_eqopk21gq61rkfso6p23il8r` (`user_id`),
  CONSTRAINT `FKfrxt1p46rlcff256odj9gm287` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_persons`
--

LOCK TABLES `delivery_persons` WRITE;
/*!40000 ALTER TABLE `delivery_persons` DISABLE KEYS */;
INSERT INTO `delivery_persons` VALUES (1,_binary '','2026-09-25 23:25:27.645437',NULL,'Raghuveer Gowda','9123456780','KA-04-EV-1024','Electric Scooter',7),(2,_binary '','2026-09-25 23:25:27.857398',NULL,'Suresh Kumar','9871234567','KA-05-HL-4521','Honda Activa 6G',8),(3,_binary '','2026-09-25 23:25:28.111277',NULL,'Ramesh Nayak','9988776655','KA-01-EQ-8890','TVS iQube Electric',9);
/*!40000 ALTER TABLE `delivery_persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_slots`
--

DROP TABLE IF EXISTS `delivery_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_slots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `available` bit(1) NOT NULL,
  `end_time` varchar(255) NOT NULL,
  `maximum_orders` int DEFAULT NULL,
  `slot_name` varchar(255) NOT NULL,
  `start_time` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_slots`
--

LOCK TABLES `delivery_slots` WRITE;
/*!40000 ALTER TABLE `delivery_slots` DISABLE KEYS */;
INSERT INTO `delivery_slots` VALUES (1,_binary '',_binary '','09:00 AM',40,'Early Morning Express','06:00 AM'),(2,_binary '',_binary '','12:00 PM',50,'Morning Slot','09:00 AM'),(3,_binary '',_binary '','05:00 PM',50,'Afternoon Slot','02:00 PM'),(4,_binary '',_binary '','09:00 PM',60,'Evening Prime','06:00 PM');
/*!40000 ALTER TABLE `delivery_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expiry_rules`
--

DROP TABLE IF EXISTS `expiry_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expiry_rules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `max_days` int NOT NULL,
  `min_days` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expiry_rules`
--

LOCK TABLES `expiry_rules` WRITE;
/*!40000 ALTER TABLE `expiry_rules` DISABLE KEYS */;
INSERT INTO `expiry_rules` VALUES (1,_binary '',20.00,7,3),(2,_binary '',43.00,2,1);
/*!40000 ALTER TABLE `expiry_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grocery_list_items`
--

DROP TABLE IF EXISTS `grocery_list_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grocery_list_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `grocery_list_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpp1qpm8qnc015nqkpj0cmte92` (`grocery_list_id`),
  KEY `FKrxo0ar04l2jqwlyvh10avjles` (`product_id`),
  CONSTRAINT `FKpp1qpm8qnc015nqkpj0cmte92` FOREIGN KEY (`grocery_list_id`) REFERENCES `grocery_lists` (`id`),
  CONSTRAINT `FKrxo0ar04l2jqwlyvh10avjles` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grocery_list_items`
--

LOCK TABLES `grocery_list_items` WRITE;
/*!40000 ALTER TABLE `grocery_list_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `grocery_list_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grocery_lists`
--

DROP TABLE IF EXISTS `grocery_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grocery_lists` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlso1guk97uhg6gvlf0qc33id4` (`user_id`),
  CONSTRAINT `FKlso1guk97uhg6gvlf0qc33id4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grocery_lists`
--

LOCK TABLES `grocery_lists` WRITE;
/*!40000 ALTER TABLE `grocery_lists` DISABLE KEYS */;
/*!40000 ALTER TABLE `grocery_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `order_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'2026-09-25 23:25:28.355598',_binary '\0','Your order #NK2 is now out for delivery with Raghuveer Gowda.',2,2),(2,'2026-09-25 23:25:28.358163',_binary '\0','New delivery assigned: Order #NK3 to Palm Meadows, Whitefield',3,7);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(10,2) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,32.30,'Tomato',2,64.60,1,1),(2,28.00,'Milk',4,112.00,1,7),(3,215.60,'Atta',1,215.60,1,12),(4,53.20,'Butter',2,106.40,2,8),(5,76.50,'Brown Eggs',2,153.00,2,10),(6,45.00,'Wagh Bakri Premium CTC Leaf Tea',2,90.00,2,28),(7,289.00,'Sona Masoori Rice',1,289.00,3,13),(8,239.20,'Almonds',1,239.20,3,19),(9,42.24,'Banana',2,84.48,4,4),(10,52.25,'Maggi 2-Minute Masala Noodles',2,104.50,4,24);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_at` datetime(6) DEFAULT NULL,
  `coupon_discount` decimal(10,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `delivered_at` datetime(6) DEFAULT NULL,
  `delivery_charge` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `payment_method` enum('COD','UPI','CARD') NOT NULL,
  `payment_status` enum('PENDING','PAID','FAILED') NOT NULL,
  `picked_up_at` datetime(6) DEFAULT NULL,
  `status` enum('PLACED','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `address_id` bigint NOT NULL,
  `coupon_id` bigint DEFAULT NULL,
  `delivery_person_id` bigint DEFAULT NULL,
  `delivery_slot_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhlglkvf5i60dv6dn397ethgpt` (`address_id`),
  KEY `FKn1d1gkxckw648m2n2d5gx0yx5` (`coupon_id`),
  KEY `FKlubga8dmt0t3sqvgmsp3tr7ws` (`delivery_person_id`),
  KEY `FK9oc4i2eawmub9pfjymrbxtw27` (`delivery_slot_id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK9oc4i2eawmub9pfjymrbxtw27` FOREIGN KEY (`delivery_slot_id`) REFERENCES `delivery_slots` (`id`),
  CONSTRAINT `FKhlglkvf5i60dv6dn397ethgpt` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `FKlubga8dmt0t3sqvgmsp3tr7ws` FOREIGN KEY (`delivery_person_id`) REFERENCES `delivery_persons` (`id`),
  CONSTRAINT `FKn1d1gkxckw648m2n2d5gx0yx5` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-09-25 01:45:28.283253',0.00,'2026-09-25 23:25:28.285173','2026-09-25 02:50:28.283253',30.00,45.00,'Please ring the bell twice and leave at the doorstep.','UPI','PAID','2026-09-25 02:15:28.283253','DELIVERED',460.00,490.00,'2026-09-25 23:25:28.285173',1,NULL,1,1,2),(2,'2026-09-25 22:25:28.326071',50.00,'2026-09-25 23:25:28.326850',NULL,0.00,60.00,'Fresh bread and eggs needed urgently.','COD','PENDING','2026-09-25 23:00:28.326071','OUT_FOR_DELIVERY',540.00,490.00,'2026-09-25 23:25:28.326850',1,NULL,1,2,2),(3,'2026-09-25 22:55:28.336780',100.00,'2026-09-25 23:25:28.338142',NULL,0.00,80.00,'Please do not ring bell if baby is sleeping, call on phone.','UPI','PAID',NULL,'PREPARING',780.00,680.00,'2026-09-25 23:25:28.338142',3,NULL,1,3,3),(4,NULL,0.00,'2026-09-25 23:25:28.346434',NULL,30.00,25.00,'Kindly deliver before 8 PM.','COD','PENDING',NULL,'PLACED',320.00,350.00,'2026-09-25 23:25:28.347060',4,NULL,NULL,4,4);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `image_url` longtext,
  `manufacturing_date` date DEFAULT NULL,
  `max_quantity` int NOT NULL,
  `min_quantity` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `stock` int NOT NULL,
  `unit` varchar(255) NOT NULL,
  `category_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,_binary '','2026-09-25 23:25:28.182186','Locally sourced ripe, firm tomatoes rich in vitamins.',15.00,NULL,'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',NULL,10,1,'Tomato',38.00,4.80,120,'1 kg',1),(2,_binary '','2026-09-25 23:25:28.184824','Crisp, pungent onions perfect for everyday curries and salads.',10.00,NULL,'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80',NULL,10,1,'Red Onion',42.00,4.60,150,'1 kg',1),(3,_binary '','2026-09-25 23:25:28.188194','Freshly harvested small potatoes ideal for roasting and curries.',0.00,NULL,'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',NULL,10,1,'Baby Potato',32.00,4.50,95,'1 kg',1),(4,_binary '','2026-09-25 23:25:28.191449','Naturally ripened golden yellow sweet bananas.',12.00,NULL,'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',NULL,10,1,'Banana',48.00,4.90,80,'1 kg',1),(5,_binary '','2026-09-25 23:25:28.194751','Crisp, juicy and fragrant mountain apples from Himachal.',10.00,NULL,'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',NULL,10,1,'Apple',160.00,4.70,50,'1 kg',1),(6,_binary '','2026-09-25 23:25:28.198144','Aromatic fresh kitchen herbs delivered chilled.',0.00,NULL,'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80',NULL,10,1,'Coriander & Mint',25.00,4.40,60,'1 pack',1),(7,_binary '','2026-09-25 23:25:28.200617','Fresh pasteurized standardized milk with 4.5% fat from KMF dairy.',0.00,NULL,'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Milk',28.00,4.90,200,'500 ml',2),(8,_binary '','2026-09-25 23:25:28.203372','Delicious creamy butter made from pure milk fat.',5.00,NULL,'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Butter',56.00,4.80,110,'100 g',2),(9,_binary '','2026-09-25 23:25:28.205829','Super soft and melt-in-mouth cottage cheese blocks.',8.00,NULL,'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Paneer',95.00,4.70,65,'200 g',2),(10,_binary '','2026-09-25 23:25:28.209010','Nutrient rich free range brown eggs with golden yolk.',10.00,NULL,'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Brown Eggs',85.00,4.80,90,'6 pcs',2),(11,_binary '','2026-09-25 23:25:28.211893','Thick, rich and creamy homemade-style probiotic curd.',0.00,NULL,'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Curd',35.00,4.60,80,'400 g',2),(12,_binary '','2026-09-25 23:25:28.214690','100% pure whole wheat flour processed with traditional stone chakki.',12.00,NULL,'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Atta',245.00,4.80,75,'5 kg',8),(13,_binary '','2026-09-25 23:25:28.217817','Aged fragrant polished grain rice ideal for South Indian meals.',15.00,NULL,'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Sona Masoori Rice',340.00,4.70,60,'5 kg',8),(14,_binary '','2026-09-25 23:25:28.220662','Rich in dietary protein without artificial chemical polish.',10.00,NULL,'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Toor Dal',175.00,4.90,85,'1 kg',8),(15,_binary '','2026-09-25 23:25:28.223071','Enriched with vitamins A & D for healthy heart cooking.',8.00,NULL,'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Sunflower Oil',135.00,4.60,95,'1 L',8),(16,_binary '','2026-09-25 23:25:28.225851','Desh ka namak with vacuum evaporated purity.',0.00,NULL,'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Salt',28.00,4.90,150,'1 kg',8),(17,_binary '','2026-09-25 23:25:28.229487','Crispy spiced potato chips seasoned with authentic Indian herbs.',0.00,NULL,'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Lay\'s Chips',20.00,4.70,180,'50 g',3),(18,_binary '','2026-09-25 23:25:28.231954','Classic spicy moth bean and besan noodle snack.',5.00,NULL,'https://images.unsplash.com/photo-1621996346565-e3d5d62810b7?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Bhujia Sev',65.00,4.60,100,'200 g',3),(19,_binary '','2026-09-25 23:25:28.235428','Crunchy lightly salted California whole almonds.',20.00,NULL,'https://images.unsplash.com/photo-1508061252966-f72fb9822365?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Almonds',299.00,4.90,40,'200 g',3),(20,_binary '','2026-09-25 23:25:28.238459','Chatpata crunchy corn puff namkeen snack.',0.00,NULL,'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Kurkure',20.00,4.50,140,'75 g',3),(21,_binary '','2026-09-25 23:25:28.240869','100% pure tender coconut water with naturally balanced electrolytes.',10.00,NULL,'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Coconut Water',60.00,4.80,90,'200 ml',4),(22,_binary '','2026-09-25 23:25:28.244224','No added sugar, pure Valencia orange juice rich in vitamin C.',15.00,NULL,'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Orange Juice',130.00,4.60,70,'1 L',4),(23,_binary '','2026-09-25 23:25:28.247399','Taste the thunder with bold fizzy cola kick.',0.00,NULL,'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Thums Up',40.00,4.70,120,'750 ml',4),(24,_binary '','2026-09-25 23:25:28.250757','Favorite instant noodles enriched with iron and 10 spices.',5.00,NULL,'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Maggi 2-Minute Masala Noodles',55.00,4.90,160,'Pack of 4 (280g)',5),(25,_binary '','2026-09-25 23:25:28.253627','Traditional stone ground naturally fermented ready batter.',10.00,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',NULL,50,1,'ID Fresh 100% Natural Idly & Dosa Batter',80.00,4.80,60,'1 kg pack',5),(26,_binary '','2026-09-25 23:25:28.256087','Crunchy frozen potato fries ready in 3 minutes.',12.00,NULL,'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',NULL,50,1,'McCain French Fries (Crispy Golden)',125.00,4.60,50,'420 g',5),(27,_binary '','2026-09-25 23:25:28.258127','85% Coffee and 15% Chicory rich South Indian traditional filter coffee.',10.00,NULL,'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Cothas Coffee Special Filter Blend',140.00,4.90,85,'500 g',6),(28,_binary '','2026-09-25 23:25:28.261004','Strong aroma, rich liquor and deep invigorating taste.',8.00,NULL,'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Wagh Bakri Premium CTC Leaf Tea',155.00,4.70,90,'500 g',6),(29,_binary '','2026-09-25 23:25:28.263534','Inner strength formula with vitamin D and calcium.',15.00,NULL,'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Bournvita Cadbury Chocolate Health Drink',225.00,4.60,60,'500 g jar',6),(30,_binary '','2026-09-25 23:25:28.265552','High fiber freshly baked daily brown sandwich bread.',0.00,NULL,'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Modern 100% Whole Wheat Brown Bread',45.00,4.50,75,'400 g loaf',7),(31,_binary '','2026-09-25 23:25:28.269939','Rich melt-in-mouth cashew butter biscuits.',5.00,NULL,'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Britannia Good Day Butter Cookies',35.00,4.70,130,'200 g pack',7),(32,_binary '','2026-09-25 23:25:28.272714','Crispy chocolate biscuit filled with luscious molten choco lava.',15.00,NULL,'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Sunfeast Dark Fantasy Choco Fills',75.00,4.90,110,'300 g',7),(33,_binary '','2026-09-25 23:25:28.276046','100% pure organic edible coconut oil from fresh coconuts.',10.00,NULL,'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80',NULL,50,1,'24 Mantra Organic Extra Virgin Cold Pressed Coconut Oil',270.00,4.80,45,'500 ml glass bottle',9),(34,_binary '','2026-09-25 23:25:28.279383','Natural source of immunity booster antioxidants.',20.00,NULL,'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',NULL,50,1,'Dabur 100% Pure Wildflower Honey',199.00,4.70,65,'400 g squeezy',9);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` varchar(1000) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqwgq1lxgahsxdspnwqfac6sv6` (`order_id`),
  KEY `FKpl51cejpw4gy5swfar8br9ngi` (`product_id`),
  KEY `FKcgy7qjc1r99dp117y9en6lxye` (`user_id`),
  CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKpl51cejpw4gy5swfar8br9ngi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKqwgq1lxgahsxdspnwqfac6sv6` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'Extremely fresh tomatoes delivered right on time! Super quality from Namma Kart.','2026-09-25 23:25:28.321376',5,1,1,2);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ROLE_CUSTOMER','ROLE_ADMIN','ROLE_DELIVERY_PERSON') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-09-25 23:25:26.274307','admin@grocery.com','Admin Manager','$2a$10$GA4Vp23R9Bl9YYS3usXpb..aRTUziaICLoEvg3YLhQwtMu2ogVFwK','9876543210','ROLE_ADMIN'),(2,'2026-09-25 23:25:26.519973','customer@grocery.com','Nandini Sharma','$2a$10$mqXKOL4FwTEp0oYJPr.HAO0W8M.UWTXjcTdaTndKwxurpd9GgYgXa','9880011223','ROLE_CUSTOMER'),(3,'2026-09-25 23:25:26.754433','rahul@grocery.com','Rahul Hegde','$2a$10$eFdZNYDn76mXrmmnaKKO1uDnxZJNKlcySU0R5AlBWM2iePBJzNM0y','9845012345','ROLE_CUSTOMER'),(4,'2026-09-25 23:25:26.975657','priya@grocery.com','Priya Rao','$2a$10$kz4Nr3KoRVcl9dxVhwE3AuxkGly3ACnI6F0z/AegoVr6UMypMUF/m','9900123456','ROLE_CUSTOMER'),(5,'2026-09-25 23:25:27.189291','ananya@grocery.com','Ananya Bhat','$2a$10$Z1ENM43C.PxhAOvcSoJANuGic3pqvWrfH18udjtDyJjdGmDODN0fK','9740112233','ROLE_CUSTOMER'),(6,'2026-09-25 23:25:27.387111','karthik@grocery.com','Karthik Shetty','$2a$10$MtBCvRdBHe5ZT1PaBjlGAehvoq7qJUSm6wC0M21Xv5hWDAVZ1nHDq','9632011224','ROLE_CUSTOMER'),(7,'2026-09-25 23:25:27.640128','delivery@grocery.com','Raghuveer Gowda','$2a$10$5JXc39riys2RGqwuCAFjsufyQjC3eB6UDVVkvvTlx0bE.T6WOo7vq','9123456780','ROLE_DELIVERY_PERSON'),(8,'2026-09-25 23:25:27.854142','suresh@delivery.com','Suresh Kumar','$2a$10$tAN/sLAMPl.ltNq.FmibyuMDBT6kjb8CaycwLDFtU1xIHQzDs33S6','9871234567','ROLE_DELIVERY_PERSON'),(9,'2026-09-25 23:25:28.108763','ramesh@delivery.com','Ramesh Nayak','$2a$10$pWL7O8Qd8.X3lB1dfU0WB.oWC7Z6XxeknofrNmIq7eac4Aq4LsM4y','9988776655','ROLE_DELIVERY_PERSON');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq85ckb2tlq3h7k56ovtqnjls2` (`user_id`,`product_id`),
  KEY `FK6p7qhvy1bfkri13u29x6pu8au` (`product_id`),
  CONSTRAINT `FK6p7qhvy1bfkri13u29x6pu8au` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKtrd6335blsefl2gxpb8lr0gr7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-26  5:09:07
