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
-- Table structure for table `restaurant_applications`
--

DROP TABLE IF EXISTS `restaurant_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_address` varchar(255) NOT NULL,
  `restaurant_name` varchar(255) NOT NULL,
  `restaurant_phone` varchar(255) NOT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') NOT NULL,
  `applicant_user_id` int DEFAULT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  `location_pin` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKk8u84v2ysuaqg7sgd3gtufkbi` (`applicant_user_id`),
  CONSTRAINT `FKp8x0yh09mrlh3tqbslntcjqx1` FOREIGN KEY (`applicant_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_applications`
--

LOCK TABLES `restaurant_applications` WRITE;
/*!40000 ALTER TABLE `restaurant_applications` DISABLE KEYS */;
INSERT INTO `restaurant_applications` (`id`, `restaurant_address`, `restaurant_name`, `restaurant_phone`, `status`, `applicant_user_id`, `rejection_reason`, `location_pin`, `image_url`) VALUES 
(1,'123 API Lane, Hyderabad','The Test Kitchen','9988776655','APPROVED',6,NULL,'',''),
(2,'ABCD','Sitara','6958525455','APPROVED',7,NULL,'',''),
(3,'123 Jubilee Hills, Hyderabad','Priya\'s Kitchen','1122334455','APPROVED',8,NULL,'',''),
(4,'1 Wonder Lane','Alice\'s Eatery','555-ALICE','APPROVED',1,NULL,'40.7128,-74.0060',''),
(5,'123 Jubilee Hills, Hyderabad','Priya\'s Kitchen','1122334455','APPROVED',15,NULL,'17.4334,78.4069',''),
(6,'ssfs','sfssf','1212413132123','APPROVED',26,NULL,'17.9358,15.4777',''),
(7,'ganesh','Ganesh','9548661651','APPROVED',27,NULL,'17.6544,18.6557',''),
(8,'tester','tester','000000000','APPROVED',29,NULL,'00.0000,00.000',''),
(9,'ABCD','5star','777777777777','APPROVED',30,NULL,'17.6544,18.6557',''),
(10,'deve','7star','1212413132123','APPROVED',31,NULL,'17.6544,18.6557',''),
(11,'hyd','nidhi bawarchi','1212413132123','APPROVED',32,NULL,'17.9358,15.4777','');
/*!40000 ALTER TABLE `restaurant_applications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-30 20:42:11
