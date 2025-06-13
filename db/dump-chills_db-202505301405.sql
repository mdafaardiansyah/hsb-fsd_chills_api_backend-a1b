-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: xxx.xx.x.xx    Database: chills_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `content_badges`
--

DROP TABLE IF EXISTS `content_badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_badges` (
  `badge_id` int NOT NULL AUTO_INCREMENT,
  `content_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_id` int NOT NULL,
  `badge_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `badge_text` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`badge_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_badges`
--

LOCK TABLES `content_badges` WRITE;
/*!40000 ALTER TABLE `content_badges` DISABLE KEYS */;
INSERT INTO `content_badges` VALUES (1,'movie',3,'episode','Episode Baru',1,'2025-05-30 07:02:15',NULL),(2,'movie',4,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(3,'movie',5,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(4,'movie',6,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(5,'movie',7,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(6,'movie',8,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(7,'movie',9,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(8,'movie',10,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(9,'movie',8,'trending','Trending',1,'2025-05-30 07:02:15',NULL),(10,'movie',10,'trending','Trending',1,'2025-05-30 07:02:15',NULL),(11,'series',1,'episode','Episode Baru',1,'2025-05-30 07:02:15',NULL),(12,'series',2,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(13,'series',3,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(14,'series',4,'episode','Episode Baru',1,'2025-05-30 07:02:15',NULL),(15,'series',4,'trending','Trending',1,'2025-05-30 07:02:15',NULL),(16,'series',6,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(17,'series',7,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(18,'series',8,'top','Top 10',1,'2025-05-30 07:02:15',NULL),(19,'series',8,'trending','Trending',1,'2025-05-30 07:02:15',NULL);
/*!40000 ALTER TABLE `content_badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `episodes`
--

DROP TABLE IF EXISTS `episodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `episodes` (
  `episode_id` int NOT NULL AUTO_INCREMENT,
  `series_id` int NOT NULL,
  `season_number` int NOT NULL,
  `episode_number` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `overview` text COLLATE utf8mb4_unicode_ci,
  `duration_minutes` int DEFAULT NULL,
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `air_date` date DEFAULT NULL,
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`episode_id`),
  KEY `series_id` (`series_id`),
  CONSTRAINT `episodes_ibfk_1` FOREIGN KEY (`series_id`) REFERENCES `series` (`series_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `episodes`
--

LOCK TABLES `episodes` WRITE;
/*!40000 ALTER TABLE `episodes` DISABLE KEYS */;
INSERT INTO `episodes` VALUES (1,1,1,1,'Dream','Isagi Yoichi bergabung dengan program Blue Lock',24,'bluelock_s1e1.mp4',NULL,'2022-10-08',45000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(2,1,1,2,'Monster','Isagi menghadapi tantangan pertama di Blue Lock',24,'bluelock_s1e2.mp4',NULL,'2022-10-15',42000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(3,1,1,3,'Soccer\'s Zero','Kompetisi semakin ketat di Blue Lock',24,'bluelock_s1e3.mp4',NULL,'2022-10-22',38000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(4,2,1,1,'The Vanishing of Will Byers','Will Byers menghilang secara misterius',48,'st_s1e1.mp4',NULL,'2016-07-15',120000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(5,2,1,2,'The Weirdo on Maple Street','Eleven bertemu dengan Mike dan teman-temannya',55,'st_s1e2.mp4',NULL,'2016-07-15',115000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(6,2,4,1,'The Hellfire Club','Hawkins menghadapi ancaman baru dari Upside Down',78,'st_s4e1.mp4',NULL,'2022-05-27',180000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(7,4,1,1,'Wednesday\'s Child Is Full of Woe','Wednesday tiba di Nevermore Academy',51,'wednesday_s1e1.mp4',NULL,'2022-11-23',95000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(8,4,1,2,'Woe Is the Loneliest Number','Wednesday menyelidiki misteri di sekolah',49,'wednesday_s1e2.mp4',NULL,'2022-11-23',88000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(9,6,1,1,'To You, in 2000 Years','Titan menyerang Wall Maria',24,'aot_s1e1.mp4',NULL,'2013-04-07',85000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(10,6,4,28,'The Dawn of Humanity','Episode final Attack on Titan',87,'aot_s4e28.mp4',NULL,'2023-11-04',200000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(11,8,1,1,'Red Light, Green Light','Permainan pertama dimulai',60,'squid_s1e1.mp4',NULL,'2021-09-17',150000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(12,8,1,9,'One Lucky Day','Final dari season pertama',56,'squid_s1e9.mp4',NULL,'2021-09-17',180000,'2025-05-30 07:02:14','2025-05-30 07:02:14');
/*!40000 ALTER TABLE `episodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `genre_id` int NOT NULL AUTO_INCREMENT,
  `genre_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`genre_id`),
  UNIQUE KEY `genre_name` (`genre_name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Aksi','Film dengan adegan aksi dan petualangan','2025-05-30 07:02:14'),(2,'Komedi','Film yang menghibur dan lucu','2025-05-30 07:02:14'),(3,'Drama','Film dengan cerita mendalam dan emosional','2025-05-30 07:02:14'),(4,'Sains & Alam','Film dokumenter atau fiksi ilmiah','2025-05-30 07:02:14'),(5,'Kejahatan','Film bertemakan kriminal dan investigasi','2025-05-30 07:02:14'),(6,'Anime','Film atau series animasi Jepang','2025-05-30 07:02:14'),(7,'Fantasi','Film dengan elemen magis dan fantasi','2025-05-30 07:02:14'),(8,'Fantasi Ilmiah','Film fiksi ilmiah dengan teknologi masa depan','2025-05-30 07:02:14'),(9,'Petualangan','Film dengan perjalanan dan eksplorasi','2025-05-30 07:02:14'),(10,'Horor','Film yang menakutkan dan menegangkan','2025-05-30 07:02:14'),(11,'Romance','Film dengan tema percintaan','2025-05-30 07:02:14'),(12,'Thriller','Film dengan ketegangan dan suspense','2025-05-30 07:02:14');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_genres`
--

DROP TABLE IF EXISTS `movie_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_genres` (
  `movie_id` int NOT NULL,
  `genre_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`movie_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `movie_genres_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE,
  CONSTRAINT `movie_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`genre_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_genres`
--

LOCK TABLES `movie_genres` WRITE;
/*!40000 ALTER TABLE `movie_genres` DISABLE KEYS */;
INSERT INTO `movie_genres` VALUES (1,2,'2025-05-30 07:02:14'),(1,4,'2025-05-30 07:02:14'),(2,1,'2025-05-30 07:02:14'),(2,5,'2025-05-30 07:02:14'),(3,6,'2025-05-30 07:02:14'),(3,7,'2025-05-30 07:02:14'),(4,1,'2025-05-30 07:02:14'),(4,8,'2025-05-30 07:02:14'),(5,1,'2025-05-30 07:02:14'),(5,7,'2025-05-30 07:02:14'),(6,1,'2025-05-30 07:02:14'),(6,8,'2025-05-30 07:02:14'),(6,9,'2025-05-30 07:02:14'),(7,2,'2025-05-30 07:02:14'),(7,3,'2025-05-30 07:02:14'),(8,1,'2025-05-30 07:02:14'),(8,3,'2025-05-30 07:02:14'),(8,8,'2025-05-30 07:02:14'),(9,3,'2025-05-30 07:02:14'),(9,5,'2025-05-30 07:02:14'),(9,12,'2025-05-30 07:02:14'),(10,1,'2025-05-30 07:02:14'),(10,8,'2025-05-30 07:02:14'),(10,9,'2025-05-30 07:02:14');
/*!40000 ALTER TABLE `movie_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `movie_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `overview` text COLLATE utf8mb4_unicode_ci,
  `poster_landscape` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poster_portrait` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `release_year` year DEFAULT NULL,
  `duration_minutes` int DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT '0.0',
  `director` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cast_list` text COLLATE utf8mb4_unicode_ci,
  `trailer_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_trending` tinyint(1) DEFAULT '0',
  `is_top_rated` tinyint(1) DEFAULT '0',
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1,'Don\'t Look Up','Film tentang dua astronom yang mencoba memperingatkan dunia tentang komet yang mendekat','poster1.png',NULL,2021,138,4.5,'Adam McKay','Leonardo DiCaprio, Jennifer Lawrence, Meryl Streep',NULL,NULL,0,0,250000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(2,'The Batman','Film tentang Batman di tahun-tahun awalnya sebagai pejuang kejahatan','poster2.png',NULL,2022,176,4.8,'Matt Reeves','Robert Pattinson, Zoë Kravitz, Paul Dano',NULL,NULL,0,1,450000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(3,'Suzume','Film animasi Jepang tentang gadis yang menemukan pintu misterius',NULL,'portraitPoster14.png',2022,122,4.7,'Makoto Shinkai','Nanoka Hara, Hokuto Matsumura',NULL,NULL,0,1,380000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(4,'The Tomorrow War','Film tentang manusia dari masa depan yang kembali untuk merekrut tentara melawan alien',NULL,'portraitPoster7.png',2021,140,4.3,'Chris McKay','Chris Pratt, Yvonne Strahovski, J.K. Simmons',NULL,NULL,1,0,320000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(5,'Black Adam','Film tentang anti-hero dengan kekuatan dewa Mesir kuno',NULL,'portraitPoster21.png',2022,125,4.1,'Jaume Collet-Serra','Dwayne Johnson, Aldis Hodge, Noah Centineo',NULL,NULL,1,0,290000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(6,'Guardians of the Galaxy','Film tentang kelompok penjahat luar angkasa yang bersatu untuk menyelamatkan galaksi',NULL,'portraitPoster30.png',2014,121,4.6,'James Gunn','Chris Pratt, Zoe Saldana, Dave Bautista',NULL,NULL,1,0,520000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(7,'A Man Called Otto','Film tentang seorang pria tua pemarah yang menemukan tujuan baru dalam hidup','poster9.png','portraitPoster10.png',2022,126,4.6,'Marc Forster','Tom Hanks, Mariana Treviño, Rachel Keller',NULL,NULL,1,0,210000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(8,'Avengers: Endgame','Film superhero tentang pertarungan final melawan Thanos','avengers_landscape.png','avengers_portrait.png',2019,181,4.9,'Russo Brothers','Robert Downey Jr., Chris Evans, Scarlett Johansson',NULL,NULL,0,1,890000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(9,'Parasite','Film thriller Korea tentang kesenjangan sosial','parasite_landscape.png','parasite_portrait.png',2019,132,4.8,'Bong Joon-ho','Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong',NULL,NULL,0,1,340000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(10,'Spider-Man: No Way Home','Film superhero tentang Spider-Man menghadapi multiverse','spiderman_landscape.png','spiderman_portrait.png',2021,148,4.7,'Jon Watts','Tom Holland, Zendaya, Benedict Cumberbatch',NULL,NULL,1,1,750000,'2025-05-30 07:02:14','2025-05-30 07:02:14');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `package_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `package_id` (`package_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,2,79000.00,'2025-05-30 07:02:14','paid','2024-07-30 23:59:59'),(2,2,3,129000.00,'2025-05-30 07:02:14','paid','2024-07-30 23:59:59'),(3,4,1,49000.00,'2025-05-30 07:02:14','paid','2024-07-30 23:59:59'),(4,7,2,79000.00,'2025-05-30 07:02:14','paid','2024-07-30 23:59:59'),(5,3,1,49000.00,'2025-05-30 07:02:14','pending','2024-07-01 23:59:59'),(6,6,3,129000.00,'2025-05-30 07:02:14','failed','2024-06-30 23:59:59'),(7,8,5,29000.00,'2025-05-30 07:02:14','pending','2024-07-05 23:59:59');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packages` (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `package_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration_days` int NOT NULL,
  `max_devices` int DEFAULT '1',
  `features` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` VALUES (1,'Basic',49000.00,30,1,'HD Quality, With Ads, No Downloads',1,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(2,'Standard',79000.00,30,2,'Full HD Quality, No Ads, Downloads Available',1,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(3,'Premium',129000.00,30,4,'4K Quality, No Ads, Downloads, Exclusive Content',1,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(4,'Family',159000.00,30,6,'4K Quality, No Ads, Downloads, Kids Profile',1,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(5,'Student',29000.00,30,1,'HD Quality, Limited Ads, Student Discount',1,'2025-05-30 07:02:14','2025-05-30 07:02:14');
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_date` timestamp NULL DEFAULT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_details` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'credit_card','success','2024-06-30 10:15:00','TXN001234567890','Visa ending 1234, Bank BCA','2025-05-30 07:02:14'),(2,2,'e_wallet','success','2024-06-30 14:30:00','TXN001234567891','GoPay Payment','2025-05-30 07:02:14'),(3,3,'bank_transfer','success','2024-06-30 09:45:00','TXN001234567892','Transfer from BRI','2025-05-30 07:02:14'),(4,4,'debit_card','success','2024-06-30 16:20:00','TXN001234567893','Debit Mandiri ending 5678','2025-05-30 07:02:14'),(5,5,'credit_card','pending',NULL,'TXN001234567894','Payment in process','2025-05-30 07:02:14'),(6,6,'e_wallet','failed','2024-06-25 12:00:00','TXN001234567895','Insufficient balance','2025-05-30 07:02:14'),(7,7,'bank_transfer','pending',NULL,'TXN001234567896','Waiting for transfer confirmation','2025-05-30 07:02:14');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `series`
--

DROP TABLE IF EXISTS `series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `series` (
  `series_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `overview` text COLLATE utf8mb4_unicode_ci,
  `poster_landscape` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poster_portrait` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `release_year` year DEFAULT NULL,
  `total_seasons` int DEFAULT '1',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'ongoing',
  `rating` decimal(2,1) DEFAULT '0.0',
  `director` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cast_list` text COLLATE utf8mb4_unicode_ci,
  `trailer_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_trending` tinyint(1) DEFAULT '0',
  `is_top_rated` tinyint(1) DEFAULT '0',
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`series_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `series`
--

LOCK TABLES `series` WRITE;
/*!40000 ALTER TABLE `series` DISABLE KEYS */;
INSERT INTO `series` VALUES (1,'Blue Lock','Anime tentang program pelatihan striker sepak bola Jepang','poster5.png',NULL,2022,1,'ongoing',4.7,'Tetsuaki Watanabe','Kazuki Ura, Tasuku Kaito, Yuki Ono',NULL,0,0,180000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(2,'Stranger Things','Serial tentang anak-anak yang menghadapi kekuatan supernatural','stranger_landscape.png','stranger_portrait.png',2016,4,'completed',4.8,'Duffer Brothers','Millie Bobby Brown, Finn Wolfhard, David Harbour',NULL,1,1,650000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(3,'The Crown','Drama sejarah tentang keluarga kerajaan Inggris','crown_landscape.png','crown_portrait.png',2016,6,'completed',4.5,'Peter Morgan','Claire Foy, Olivia Colman, Imelda Staunton',NULL,0,1,420000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(4,'Wednesday','Serial tentang Wednesday Addams di Nevermore Academy','wednesday_landscape.png','wednesday_portrait.png',2022,1,'ongoing',4.6,'James Lovato','Jenna Ortega, Hunter Doohan, Percy Hynes White',NULL,1,0,380000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(5,'Money Heist','Serial tentang perampokan bank dengan dalang misterius','money_landscape.png','money_portrait.png',2017,5,'completed',4.4,'Álex Pina','Álvaro Morte, Úrsula Corberó, Pedro Alonso',NULL,0,1,490000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(6,'Attack on Titan','Anime tentang manusia melawan titan raksasa','aot_landscape.png','aot_portrait.png',2013,4,'completed',4.9,'Wit Studio','Yuki Kaji, Marina Inoue, Yui Ishikawa',NULL,1,1,720000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(7,'Breaking Bad','Drama tentang guru kimia yang menjadi pembuat narkoba','bb_landscape.png','bb_portrait.png',2008,5,'completed',4.9,'Vince Gilligan','Bryan Cranston, Aaron Paul, Anna Gunn',NULL,0,1,580000,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(8,'Squid Game','Serial thriller Korea tentang permainan mematikan','squid_landscape.png','squid_portrait.png',2021,2,'ongoing',4.6,'Hwang Dong-hyuk','Lee Jung-jae, Park Hae-soo, Wi Ha-jun',NULL,1,1,890000,'2025-05-30 07:02:14','2025-05-30 07:02:14');
/*!40000 ALTER TABLE `series` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `series_genres`
--

DROP TABLE IF EXISTS `series_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `series_genres` (
  `series_id` int NOT NULL,
  `genre_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`series_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `series_genres_ibfk_1` FOREIGN KEY (`series_id`) REFERENCES `series` (`series_id`) ON DELETE CASCADE,
  CONSTRAINT `series_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`genre_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `series_genres`
--

LOCK TABLES `series_genres` WRITE;
/*!40000 ALTER TABLE `series_genres` DISABLE KEYS */;
INSERT INTO `series_genres` VALUES (1,1,'2025-05-30 07:02:14'),(1,6,'2025-05-30 07:02:14'),(2,3,'2025-05-30 07:02:14'),(2,7,'2025-05-30 07:02:14'),(2,10,'2025-05-30 07:02:14'),(3,3,'2025-05-30 07:02:14'),(3,11,'2025-05-30 07:02:14'),(4,3,'2025-05-30 07:02:14'),(4,7,'2025-05-30 07:02:14'),(4,10,'2025-05-30 07:02:14'),(5,1,'2025-05-30 07:02:14'),(5,5,'2025-05-30 07:02:14'),(5,12,'2025-05-30 07:02:14'),(6,1,'2025-05-30 07:02:14'),(6,3,'2025-05-30 07:02:14'),(6,6,'2025-05-30 07:02:14'),(7,3,'2025-05-30 07:02:14'),(7,5,'2025-05-30 07:02:14'),(7,12,'2025-05-30 07:02:14'),(8,3,'2025-05-30 07:02:14'),(8,10,'2025-05-30 07:02:14'),(8,12,'2025-05-30 07:02:14');
/*!40000 ALTER TABLE `series_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_ratings`
--

DROP TABLE IF EXISTS `user_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_ratings` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `content_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_id` int NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `review` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`rating_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_ratings`
--

LOCK TABLES `user_ratings` WRITE;
/*!40000 ALTER TABLE `user_ratings` DISABLE KEYS */;
INSERT INTO `user_ratings` VALUES (1,1,'movie',1,4.5,'Film yang sangat menghibur dan penuh pesan moral!','2025-05-30 07:02:15','2025-05-30 07:02:15'),(2,1,'movie',8,5.0,'Masterpiece! Endgame yang sempurna untuk MCU','2025-05-30 07:02:15','2025-05-30 07:02:15'),(3,1,'series',2,4.8,'Nostalgia 80an yang dikemas dengan sempurna','2025-05-30 07:02:15','2025-05-30 07:02:15'),(4,2,'movie',2,4.9,'Robert Pattinson luar biasa sebagai Batman','2025-05-30 07:02:15','2025-05-30 07:02:15'),(5,2,'movie',3,4.7,'Animasi yang indah dengan cerita yang menyentuh','2025-05-30 07:02:15','2025-05-30 07:02:15'),(6,2,'series',4,4.6,'Jenna Ortega perfect sebagai Wednesday!','2025-05-30 07:02:15','2025-05-30 07:02:15'),(7,4,'movie',6,4.6,'Soundtrack amazing! Cerita yang fun','2025-05-30 07:02:15','2025-05-30 07:02:15'),(8,4,'series',6,5.0,'Anime terbaik sepanjang masa! Ending yang epic','2025-05-30 07:02:15','2025-05-30 07:02:15'),(9,7,'movie',9,4.8,'Film Korea yang brilian tentang kesenjangan sosial','2025-05-30 07:02:15','2025-05-30 07:02:15'),(10,7,'series',7,4.9,'Character development Walter White luar biasa','2025-05-30 07:02:15','2025-05-30 07:02:15'),(11,3,'movie',4,4.2,'Action yang seru tapi cerita agak predictable','2025-05-30 07:02:15','2025-05-30 07:02:15'),(12,3,'series',5,4.4,'Plot twist yang tidak terduga di setiap episode','2025-05-30 07:02:15','2025-05-30 07:02:15');
/*!40000 ALTER TABLE `user_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_subscriptions`
--

DROP TABLE IF EXISTS `user_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_subscriptions` (
  `subscription_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `package_id` int NOT NULL,
  `order_id` int NOT NULL,
  `start_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` timestamp NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `auto_renewal` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`subscription_id`),
  KEY `user_id` (`user_id`),
  KEY `package_id` (`package_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `user_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_subscriptions_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`),
  CONSTRAINT `user_subscriptions_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subscriptions`
--

LOCK TABLES `user_subscriptions` WRITE;
/*!40000 ALTER TABLE `user_subscriptions` DISABLE KEYS */;
INSERT INTO `user_subscriptions` VALUES (1,1,2,1,'2024-06-30 10:15:00','2024-07-30 10:15:00','active',0,'2025-05-30 07:02:15'),(2,2,3,2,'2024-06-30 14:30:00','2024-07-30 14:30:00','active',0,'2025-05-30 07:02:15'),(3,4,1,3,'2024-06-30 09:45:00','2024-07-30 09:45:00','active',0,'2025-05-30 07:02:15'),(4,7,2,4,'2024-06-30 16:20:00','2024-07-30 16:20:00','active',0,'2025-05-30 07:02:15'),(5,6,3,6,'2024-05-01 00:00:00','2024-05-31 23:59:59','expired',0,'2025-05-30 07:02:15');
/*!40000 ALTER TABLE `user_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscription_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'inactive',
  `profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john_doe','john@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa','John Doe','1990-05-15','081234567890','active',NULL,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(2,'jane_smith','jane@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa','Jane Smith','1992-08-20','081234567891','active',NULL,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(3,'mike_wilson','mike@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa','Mike Wilson','1988-12-03','081234567892','inactive',NULL,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(4,'sarah_jones','sarah@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa','Sarah Jones','1995-03-10','081234567893','active',NULL,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(5,'admin_user','admin@chill.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa','Admin User','1985-01-01','081234567894','active',NULL,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(6,'david_brown','david@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa','David Brown','1993-07-22','081234567895','expired',NULL,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(7,'lisa_davis','lisa@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa','Lisa Davis','1991-11-18','081234567896','active',NULL,'2025-05-30 07:02:14','2025-05-30 07:02:14'),(8,'tom_miller','tom@example.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa','Tom Miller','1987-09-05','081234567897','inactive',NULL,'2025-05-30 07:02:14','2025-05-30 07:02:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch_history`
--

DROP TABLE IF EXISTS `watch_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `content_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_id` int NOT NULL,
  `watch_progress` int DEFAULT '0',
  `total_duration` int DEFAULT '0',
  `last_watched` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`history_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `watch_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_history`
--

LOCK TABLES `watch_history` WRITE;
/*!40000 ALTER TABLE `watch_history` DISABLE KEYS */;
INSERT INTO `watch_history` VALUES (1,1,'movie',1,8280,8280,'2025-05-30 07:02:15',1),(2,1,'movie',8,10860,10860,'2025-05-30 07:02:15',1),(3,1,'series',2,2880,2880,'2025-05-30 07:02:15',1),(4,1,'episode',3,3300,3300,'2025-05-30 07:02:15',1),(5,2,'movie',2,10560,10560,'2025-05-30 07:02:15',1),(6,2,'movie',3,7320,7320,'2025-05-30 07:02:15',1),(7,2,'series',4,3060,3060,'2025-05-30 07:02:15',1),(8,2,'episode',7,2940,2940,'2025-05-30 07:02:15',1),(9,4,'movie',6,7260,7260,'2025-05-30 07:02:15',1),(10,4,'series',6,1440,1440,'2025-05-30 07:02:15',1),(11,4,'episode',9,5220,5220,'2025-05-30 07:02:15',1),(12,7,'movie',9,7920,7920,'2025-05-30 07:02:15',1),(13,7,'movie',10,8880,8880,'2025-05-30 07:02:15',1),(14,7,'series',8,3600,3600,'2025-05-30 07:02:15',1),(15,3,'movie',4,4200,8400,'2025-05-30 07:02:15',0),(16,3,'series',5,1800,3600,'2025-05-30 07:02:15',0);
/*!40000 ALTER TABLE `watch_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watchlist`
--

DROP TABLE IF EXISTS `watchlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watchlist` (
  `watchlist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `content_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_id` int NOT NULL,
  `added_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`watchlist_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `watchlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watchlist`
--

LOCK TABLES `watchlist` WRITE;
/*!40000 ALTER TABLE `watchlist` DISABLE KEYS */;
INSERT INTO `watchlist` VALUES (1,1,'movie',1,'2025-05-30 07:02:15'),(2,1,'movie',8,'2025-05-30 07:02:15'),(3,1,'series',2,'2025-05-30 07:02:15'),(4,2,'movie',2,'2025-05-30 07:02:15'),(5,2,'movie',3,'2025-05-30 07:02:15'),(6,2,'series',4,'2025-05-30 07:02:15'),(7,2,'series',8,'2025-05-30 07:02:15'),(8,4,'movie',6,'2025-05-30 07:02:15'),(9,4,'series',6,'2025-05-30 07:02:15'),(10,7,'movie',9,'2025-05-30 07:02:15'),(11,7,'movie',10,'2025-05-30 07:02:15'),(12,7,'series',7,'2025-05-30 07:02:15'),(13,3,'movie',4,'2025-05-30 07:02:15'),(14,3,'series',5,'2025-05-30 07:02:15');
/*!40000 ALTER TABLE `watchlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'chills_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-30 14:05:13
