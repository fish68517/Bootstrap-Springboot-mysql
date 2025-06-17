-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: course_selection_system
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `classrooms`
--

DROP TABLE IF EXISTS `classrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classrooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `capacity` int NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classrooms`
--

LOCK TABLES `classrooms` WRITE;
/*!40000 ALTER TABLE `classrooms` DISABLE KEYS */;
INSERT INTO `classrooms` VALUES (1,'教室A',0,'第一教学楼','2024-12-27 16:11:47','2025-01-20 16:55:22'),(2,'教室B',30,'第二教学楼','2024-12-27 16:11:47','2024-12-27 16:11:47'),(3,'实验室1',20,'实验楼','2024-12-27 16:11:47','2024-12-27 16:11:47'),(5,'322',0,'第三教学楼','2025-01-14 14:17:54','2025-01-14 14:17:54'),(6,'331',0,'第三教学楼','2025-01-14 14:17:54','2025-01-14 14:17:54'),(7,'311',100,'第三教学楼','2025-01-14 14:22:00','2025-01-15 15:47:02'),(8,'102',0,'第三教学楼','2025-01-14 15:36:07','2025-01-20 16:56:37'),(11,'103',120,'第三教学楼','2025-01-14 15:38:10','2025-01-14 15:38:10'),(12,'1022',0,'第三教学楼','2025-01-14 15:44:15','2025-01-20 16:57:02'),(15,'285',20,'第三教学楼','2025-01-15 14:12:11','2025-01-15 16:58:01'),(16,'284',20,'第三教学楼','2025-01-15 14:12:11','2025-01-15 16:58:01'),(18,'312',10,'第一教学楼','2025-01-15 17:18:43','2025-01-15 17:18:43'),(19,'户外体育场',120,'第一教学楼','2025-01-15 22:13:52','2025-01-15 22:13:52'),(20,'室内',120,'第一教学楼','2025-01-15 22:13:52','2025-01-15 22:13:52'),(21,'301',100,'第一教学楼','2025-01-15 22:16:21','2025-01-17 16:16:36'),(22,'300',10,'第一教学楼','2025-01-15 22:18:01','2025-01-20 13:35:32'),(23,'112',10,'第一教学楼','2025-01-15 22:18:51','2025-01-15 22:18:51'),(24,'111',10,'第一教学楼','2025-01-15 22:19:35','2025-01-15 22:19:35'),(25,'113',120,'第一教学楼','2025-01-20 14:20:39','2025-01-20 16:51:01'),(26,'781',20,'第一教学楼','2025-01-20 14:32:09','2025-01-20 14:32:09'),(27,'001',120,'第一教学楼','2025-01-20 14:36:18','2025-01-20 14:36:18'),(28,'1',10,'第一教学楼','2025-03-22 13:43:49','2025-03-22 13:43:49'),(29,'25',1,'第一教学楼','2025-03-22 13:46:25','2025-03-22 13:46:25'),(30,'44',1,'第一教学楼','2025-03-22 13:54:59','2025-03-22 13:54:59');
/*!40000 ALTER TABLE `classrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_teachers`
--

DROP TABLE IF EXISTS `course_teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course_teachers_course_id` (`course_id`),
  KEY `idx_course_teachers_teacher_id` (`teacher_id`),
  CONSTRAINT `course_teachers_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_teachers_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_teachers`
--

LOCK TABLES `course_teachers` WRITE;
/*!40000 ALTER TABLE `course_teachers` DISABLE KEYS */;
INSERT INTO `course_teachers` VALUES (1,1,2,'主讲','2024-12-27 16:11:47','2024-12-27 16:11:47'),(2,2,3,'主讲','2024-12-27 16:11:47','2024-12-27 16:11:47'),(10,12,3,'主讲','2025-01-14 15:36:07','2025-01-15 15:39:33'),(14,16,2,'主讲','2025-01-14 15:44:15','2025-01-14 15:44:15'),(16,18,3,'主讲','2025-01-15 14:12:11','2025-01-15 17:01:31'),(19,22,2,'主讲','2025-01-15 22:13:52','2025-01-15 22:13:52'),(20,24,3,'主讲','2025-01-20 14:27:20','2025-01-20 14:27:20'),(21,21,2,'主讲','2025-01-20 14:27:46','2025-01-20 14:27:46'),(22,23,2,'主讲','2025-01-20 14:28:02','2025-01-20 14:28:02'),(23,25,2,'主讲','2025-01-20 14:32:09','2025-01-20 14:32:09'),(24,26,2,'主讲','2025-01-20 14:36:18','2025-01-20 14:36:18'),(28,30,2,'主讲','2025-03-22 13:46:25','2025-03-22 13:46:25'),(29,31,2,'主讲','2025-03-22 13:54:59','2025-03-22 13:54:59');
/*!40000 ALTER TABLE `course_teachers` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `course_teachers_before_insert` BEFORE INSERT ON `course_teachers` FOR EACH ROW BEGIN
    IF (SELECT COUNT(*) FROM course_teachers WHERE course_id = NEW.course_id AND teacher_id <> NEW.teacher_id) > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Another teacher is already assigned to this course.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(100) NOT NULL,
  `description` text,
  `credits` int NOT NULL,
  `weekly_hours` int NOT NULL,
  `weekly_sessions` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'计算机科学与技术','介绍计算机科学的基本概念和技术介绍计算机科学的基本概念和技术介绍计算机科学的基本概念和技术',3,1,2,'2024-12-27 16:11:47','2025-01-15 22:12:54'),(2,'数据结构与算法','学习常用的数据结构和算法设计',4,4,2,'2024-12-27 16:11:47','2024-12-27 16:11:47'),(12,'C++','C++C++C++C++',2,2,2,'2025-01-14 15:36:07','2025-01-14 15:36:07'),(16,'公共数学','公共数学公共数学公共数学公共数学',2,2,2,'2025-01-14 15:44:15','2025-01-14 15:44:15'),(18,'公共英语22','公共英语22',2,4,2,'2025-01-15 14:12:11','2025-01-15 16:58:01'),(21,'大学数学','大学数学大学数学大学数学',4,4,2,'2025-01-15 17:18:43','2025-01-15 17:18:43'),(22,'大学语文3','大学语文大学语文大学语文',3,2,2,'2025-01-15 22:13:52','2025-01-15 22:18:51'),(23,'大学体验','大学体验大学体验大学体验',2,4,2,'2025-01-15 22:19:35','2025-01-15 22:19:35'),(24,'大学物理','大学物理大学物理大学物理',4,4,2,'2025-01-17 16:16:36','2025-01-17 16:16:36'),(25,'大学体育','大学体育大学体育大学体育',3,4,2,'2025-01-20 14:32:09','2025-01-20 14:32:09'),(26,'大学语文','大学语文大学语文大学语文',2,4,2,'2025-01-20 14:36:18','2025-01-20 14:36:18'),(30,'22','222',1,1,1,'2025-03-22 13:46:25','2025-03-22 13:46:25'),(31,'0','0',1,1,1,'2025-03-22 13:54:59','2025-03-22 13:54:59');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permission_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_name` (`permission_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'manage_users','管理用户'),(2,'manage_courses','管理课程'),(3,'manage_schedules','管理排课'),(4,'select_courses','选课'),(5,'drop_courses','退课'),(6,'view_recommendations','查看推荐课程');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations`
--

DROP TABLE IF EXISTS `recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `score` double NOT NULL,
  `recommended_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_recommendation` (`user_id`,`course_id`),
  KEY `idx_recommendations_user_id` (`user_id`),
  KEY `idx_recommendations_course_id` (`course_id`),
  CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `recommendations_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations`
--

LOCK TABLES `recommendations` WRITE;
/*!40000 ALTER TABLE `recommendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1),(1,2),(2,2),(1,3),(2,3),(1,4),(3,4),(1,5),(3,5),(1,6),(3,6);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','系统管理员'),(2,'TEACHER','教师'),(3,'STUDENT','学生');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `classroom_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `day_of_week` enum('MON','TUE','WED','THU','FRI','SAT','SUN') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `classroom` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_schedule` (`classroom_id`,`day_of_week`,`start_time`,`end_time`),
  KEY `idx_schedules_course_id` (`course_id`),
  KEY `idx_schedules_classroom_id` (`classroom_id`),
  KEY `idx_schedules_teacher_id` (`teacher_id`),
  KEY `idx_schedules_day_time` (`day_of_week`,`start_time`,`end_time`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`) ON DELETE SET NULL,
  CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (2,2,2,2,'FRI','08:00:00','09:30:00','2024-12-28 21:30:43','2025-01-20 15:50:50','教室B'),(6,12,8,2,'MON','08:00:00','09:30:00','2025-01-14 15:36:07','2025-01-20 15:03:42','102'),(8,16,12,2,'TUE','08:00:00','09:30:00','2025-01-14 15:44:15','2025-01-17 16:04:07','1022'),(19,18,15,3,'MON','09:00:00','10:00:00','2025-01-15 16:58:01','2025-01-15 16:58:01',NULL),(20,18,16,3,'TUE','10:20:00','12:50:00','2025-01-15 16:58:01','2025-01-17 16:03:30',NULL),(21,21,18,3,'MON','11:20:00','12:50:00','2025-01-15 17:18:43','2025-01-20 15:59:42',NULL),(22,1,1,2,'MON','09:40:00','11:10:00','2025-01-15 22:12:54','2025-01-20 15:57:30',NULL),(28,22,23,2,'MON','14:00:00','15:30:00','2025-01-15 22:18:51','2025-01-20 15:59:14',NULL),(29,23,24,3,'TUE','15:40:00','17:10:00','2025-01-15 22:19:35','2025-01-20 16:00:08',NULL),(32,24,25,2,'MON','08:00:00','09:30:00','2025-01-20 14:21:31','2025-01-20 14:21:31',NULL),(33,25,26,2,'MON','18:00:00','19:30:00','2025-01-20 14:32:09','2025-01-20 16:00:32',NULL),(34,26,27,2,'TUE','08:00:00','09:30:00','2025-01-20 14:36:18','2025-01-20 15:02:51',NULL),(37,30,29,2,'MON','09:40:00','11:10:00','2025-03-22 13:46:25','2025-03-22 13:46:25',NULL),(38,31,30,2,'MON','09:40:00','11:10:00','2025-03-22 13:54:59','2025-03-22 13:54:59',NULL);
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `selection_history`
--

DROP TABLE IF EXISTS `selection_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `selection_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `action` enum('SELECT','DROP') NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_selection_history_user_id` (`user_id`),
  KEY `idx_selection_history_course_id` (`course_id`),
  CONSTRAINT `selection_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `selection_history_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selection_history`
--

LOCK TABLES `selection_history` WRITE;
/*!40000 ALTER TABLE `selection_history` DISABLE KEYS */;
INSERT INTO `selection_history` VALUES (1,4,1,'SELECT','2024-12-27 16:11:48'),(2,5,2,'SELECT','2024-12-27 16:11:48'),(3,4,1,'SELECT','2024-12-30 15:22:30'),(6,4,1,'DROP','2025-01-13 23:48:57'),(7,4,1,'SELECT','2025-01-14 09:07:39'),(8,4,1,'DROP','2025-01-14 09:07:55'),(10,4,1,'SELECT','2025-01-14 09:08:24'),(12,4,1,'DROP','2025-01-15 22:11:57'),(14,4,1,'SELECT','2025-01-15 22:20:40'),(15,4,1,'DROP','2025-01-16 09:07:37'),(16,4,16,'SELECT','2025-01-16 09:07:56'),(17,4,12,'SELECT','2025-01-20 14:17:16'),(18,4,21,'SELECT','2025-03-22 13:32:14'),(19,4,1,'SELECT','2025-03-22 13:32:58'),(20,4,23,'SELECT','2025-03-22 13:42:05');
/*!40000 ALTER TABLE `selection_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `selections`
--

DROP TABLE IF EXISTS `selections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `selections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `selected_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_selection` (`user_id`,`course_id`),
  KEY `idx_selections_user_id` (`user_id`),
  KEY `idx_selections_course_id` (`course_id`),
  CONSTRAINT `selections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `selections_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selections`
--

LOCK TABLES `selections` WRITE;
/*!40000 ALTER TABLE `selections` DISABLE KEYS */;
INSERT INTO `selections` VALUES (1,5,2,'2024-12-27 16:11:48'),(2,4,2,'2024-12-27 16:11:48'),(11,4,16,'2025-01-16 09:07:55'),(12,4,12,'2025-01-20 14:17:16'),(13,4,21,'2025-03-22 13:32:13'),(14,4,1,'2025-03-22 13:32:57'),(15,4,23,'2025-03-22 13:42:05');
/*!40000 ALTER TABLE `selections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_users_role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'张老师','123456',2,'2024-12-27 16:11:47','2024-12-29 21:27:22','TEACHER'),(3,'李老师','BQMnD0cP',2,'2024-12-27 16:11:47','2025-01-15 22:14:37','TEACHER'),(4,'张三','123456',3,'2024-12-27 16:11:48','2024-12-28 15:45:17','STUDENT'),(5,'李四','123456',3,'2024-12-27 16:11:48','2024-12-28 15:45:20','STUDENT'),(6,'admin','admin',1,'2024-12-30 18:57:04','2024-12-30 18:57:06','ADMIN');
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

-- Dump completed on 2025-06-16 10:29:17
