-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: foodnow_new
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `location_pin` varchar(255) NOT NULL,
  `owner_id` int DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `restaurants_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (2,'The Test Kitchen',NULL,'0.0,0.0',6,0,'2025-07-17 16:29:26','123 API Lane, Hyderabad','9988776655','ACTIVE'),(3,'Sitara',NULL,'0.0,0.0',7,0,'2025-07-18 08:09:13','ABCD','6958525455','ACTIVE'),(4,'Priya\'s Kitchen',NULL,'0.0,0.0',8,0,'2025-07-18 09:09:36','123 Jubilee Hills, Hyderabad','1122334455','ACTIVE'),(5,'Priya\'s Kitchen',NULL,'17.4334,78.4069',15,0,'2025-07-18 18:17:29','123 Jubilee Hills, Hyderabad','1122334455','ACTIVE'),(6,'Alice\'s Eatery',NULL,'40.7128,-74.0060',1,0,'2025-07-18 19:59:13','1 Wonder Lane','555-ALICE','ACTIVE'),(7,'sfssf',NULL,'17.9358,15.4777',26,0,'2025-07-18 20:17:05','ssfs','1212413132123','ACTIVE'),(8,'Ganesh',NULL,'17.6544,18.6557',27,0,'2025-07-19 07:06:19','ganesh','9548661651','ACTIVE'),(9,'tester',NULL,'00.0000,00.000',29,0,'2025-07-19 11:53:42','tester','000000000','ACTIVE'),(10,'5star',NULL,'17.6544,18.6557',30,0,'2025-07-28 09:40:46','ABCD','777777777777','ACTIVE'),(11,'7star',NULL,'17.6544,18.6557',31,0,'2025-07-30 06:43:19','deve','1212413132123','ACTIVE'),(12,'nidhi bawarchi',NULL,'17.9358,15.4777',32,0,'2025-07-30 14:53:31','hyd','1212413132123','ACTIVE');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-30 20:42:10
