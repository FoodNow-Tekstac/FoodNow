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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Alice','alice@example.com','1112223330','$2a$10$cGvWcQSmJUOPnIIjEbK6i.9efexm9IgeVTWZPTy/pryfbn9Qi1kna','RESTAURANT_OWNER','2025-07-17 11:14:43'),(3,'Admin','admin@foodnow.com','0000000000','$2a$10$gTEoG7MBRogBbktmUQgbVe9bpbnwWlN7aGvzwH9.4C5Md8hcm.S8.','ADMIN','2025-07-17 11:40:43'),(4,'Sanjay Chef','sanjay.chef@example.com','9876543210','$2a$10$y.RWzdUe4ONxdcDR5pxUXOh1isBDqUslXuXuyfR3JZVMS5ofj07.6','CUSTOMER','2025-07-17 14:52:03'),(5,'Rejected Applicant','rejected.user@example.com','1231231231','$2a$10$Sdj9Gd6kyCCSGoowXsTe8.cjSdnsS.nXXMXF049KRpejLzeE1Zcjy','CUSTOMER','2025-07-17 15:34:44'),(6,'Test Chef','test.chef@example.com','5555555555','$2a$10$0xx/SZoHfLIy3NOfma/gZeM0tbhYjjLyTuWCvRq76W5UX8pt5Aiz6','RESTAURANT_OWNER','2025-07-17 16:13:22'),(7,'Tenz Test','test@test.com','8258522205','$2a$10$OucvaGvwIBM2TQ9as/2g5eqBSUhRMVgRoSdpzE06PAD7Xga/x4zvu','RESTAURANT_OWNER','2025-07-18 06:34:37'),(8,'Priya Sharma','priya.sharma@example.com','9988776655','$2a$10$J8y2FXU07IlxKlxnUvCZWe7ivyEaUGIEpzVeEt7MFhnV7l1GitpKu','RESTAURANT_OWNER','2025-07-18 09:05:35'),(9,'Arjun Verma','arjun.v@example.com','8877665544','$2a$10$.to67/dZuGR9yFrBXQg1reaPqPVgBnNs0nMFg8hW5HHUwK1oE4v1G','CUSTOMER','2025-07-18 09:11:30'),(10,'New Customer','newcustomer@example.com','5551234567','$2a$10$mmwSvkHQI4/TXzNJkSd5A.T23gCtLGEc3uWpE9igVao6yCpS1OvOm','CUSTOMER','2025-07-18 14:37:31'),(12,'Charlie Customer','charlie@example.com','777888999','$2a$10$kz0uxUleYfJPU33Q4cScZ.an4nXatm1ek693J0nwRRWGPvbL1WTGO','CUSTOMER','2025-07-18 15:18:26'),(13,'Bob Delivery','bob.delivery@example.com','444555666','$2a$10$lyC.8vfSfKcxZGmgJao2HehNIdFKVJ4gm2nTshOt7PxU7kLjNXTX6','DELIVERY_PERSONNEL','2025-07-18 15:37:38'),(15,'Priya Patel','priya@example.com','9876543255','$2a$10$KDxnt15pHCOR0XCtGZmSP.j3ukKHvcVZzXGDs2IUQfraPpgUA.K66','RESTAURANT_OWNER','2025-07-18 18:15:10'),(16,'Ravi Kumar','ravi@example.com','8765432109','$2a$10$9WdrQbtu5jpjI9v1oLsEAOvT34Jc85mSyiU/.0CvRA.rbZnFf7Mli','CUSTOMER','2025-07-18 18:15:29'),(17,'Sanjay Singh','sanjay.delivery@example.com','7654321098','$2a$10$v5mjYLVhICUc/f65Wna4yulWl5wAEzagTWTm9oEJ2DLR9x2CD79yC','DELIVERY_PERSONNEL','2025-07-18 18:16:02'),(18,'ep','ep@ep.com','8547854785','$2a$10$ZbVhc9B0p85NSh//4rnLduOnA2skWJrXimBcJZoXL8W/eP9s2kxMO','CUSTOMER','2025-07-18 19:59:41'),(21,'ep','ep@ep.in','8547854777','$2a$10$.2XuP7VMGLMAPIiDCU4ZUO6ctVFr/IRTk4Ew.WbroH0zkgTQYG/5.','CUSTOMER','2025-07-18 20:00:02'),(25,'vijay','v@jay.com','12122121212','$2a$10$4auuQEvRTGP7GlYqkhwPXeRq9tyoyCZ3Z..By4OoDZYTJJKMMNtdi','CUSTOMER','2025-07-18 20:03:52'),(26,'rajesh','rajesh.21bce7128@vitapstudent.ac.in','8520811104','$2a$10$KL2ja2rLjnFQ8/RwqlBrdu21kImlLC6nEYSvXjA7mDbnmwcjbGRSG','RESTAURANT_OWNER','2025-07-18 20:06:07'),(27,'ganesh','ganesh@test.com','85478545525','$2a$10$RYmj2ETk3J7JdfSyMAH5gODAPApMUv7RDXli5yMnYxicK.8S.RQim','RESTAURANT_OWNER','2025-07-19 07:04:04'),(29,'tester','tester@tester.com','7777777777','$2a$10$ze4uN2hsxh/0GCMPqetXB.39ULg/7GmndU9GmdY78tS/n/b5VEnEq','RESTAURANT_OWNER','2025-07-19 10:03:28'),(30,'tester1','tester1@tester.com','78787878','$2a$10$7Kxr6qMmIxUzHJRGSx4.7.6Nk5ovXjyBPoQn9/pNznlMrohpgzRo.','RESTAURANT_OWNER','2025-07-19 14:31:52'),(31,'aakriti','aakriti@tester.com','8848525151','$2a$10$lDRzsLyW5rL3YovjWAwxxupOR5TzPNBfXoM4lmoBHlNMMzn5VpIb.','RESTAURANT_OWNER','2025-07-30 06:42:25'),(32,'nidhi','nidhi@gmail.com','8745856515','$2a$10$Px6MocYuWZlw2A3VSnVY5.c0DxXX.erOdmFe3FEZDybu1qKdCs.gK','RESTAURANT_OWNER','2025-07-30 14:51:30'),(34,'test','test2@test.com','8644515415','$2a$10$.Su3xGADAc1e0fiRt8lT9uYoGnwrpdPmYgbeNVd6A9NsC2lVNXQj.','CUSTOMER','2025-07-30 14:55:32');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
