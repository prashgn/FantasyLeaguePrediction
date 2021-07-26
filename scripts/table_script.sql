DROP DATABASE competition;

CREATE DATABASE competition;

USE competition;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` int(10) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_id` int(11) NOT NULL,
  `role` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id` (`fk_id`),
  FOREIGN KEY (`fk_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `teammember` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_teamid` int(11) NOT NULL,
  `fk_playerid` int(11) NOT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_playerid` (`fk_playerid`),
  KEY `fk_teamid` (`fk_teamid`),
  FOREIGN KEY (`fk_playerid`) REFERENCES `player` (`id`),
  FOREIGN KEY (`fk_teamid`) REFERENCES `team` (`id`)
);

CREATE TABLE `series` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) DEFAULT NULL,
  `playerofseries` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `playerofseries` (`playerofseries`),
  FOREIGN KEY (`playerofseries`) REFERENCES `player` (`id`)
);

CREATE TABLE `match_det` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_team_A` int(11) NOT NULL,
  `fk_team_B` int(11) NOT NULL,
  `fk_s_id` int(11) NOT NULL,
  `disp_match_num` int(11) DEFAULT NULL,
  `home_team` varchar(25) DEFAULT NULL,
  `venue` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `matchresult` varchar(25) DEFAULT NULL,
  `mom` varchar(25) DEFAULT NULL,
  `completed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_team_A` (`fk_team_A`),
  KEY `fk_team_B` (`fk_team_B`),
  KEY `fk_s_id` (`fk_s_id`),
  FOREIGN KEY (`fk_team_A`) REFERENCES `team` (`id`),
  FOREIGN KEY (`fk_team_B`) REFERENCES `team` (`id`),
  FOREIGN KEY (`fk_s_id`) REFERENCES `series` (`id`)
);

CREATE TABLE `participant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_m_id` int(11) NOT NULL,
  `fk_p_id` int(11) NOT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_m_id` (`fk_m_id`),
  KEY `fk_p_id` (`fk_p_id`),
  FOREIGN KEY (`fk_m_id`) REFERENCES `match_det` (`id`),
  FOREIGN KEY (`fk_p_id`) REFERENCES `player` (`id`)
);

CREATE TABLE `league` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fk_id` int(11) NOT NULL,
  `fk_s_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id` (`fk_id`),
  KEY `fk_s_id` (`fk_s_id`),
  FOREIGN KEY (`fk_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`fk_s_id`) REFERENCES `series` (`id`)
);

CREATE TABLE `userleague` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_u_id` int(11) NOT NULL,
  `fk_l_id` int(11) NOT NULL,
  `owner` tinyint(1) DEFAULT NULL,
  `ranked` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_u_id` (`fk_u_id`),
  KEY `fk_l_id` (`fk_l_id`),
  FOREIGN KEY (`fk_u_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`fk_l_id`) REFERENCES `league` (`id`)
);

CREATE TABLE `rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `description` varchar(255) NOT NULL,
  `fk_l_id` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `stage` varchar(8) DEFAULT NULL,
  `selection` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_l_id` (`fk_l_id`),
  FOREIGN KEY (`fk_l_id`) REFERENCES `league` (`id`)
);

CREATE TABLE `predict` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_u_id` int(11) NOT NULL,
  `fk_m_id` int(11) NOT NULL,
  `fk_r_id` int(11) NOT NULL,
  `predict_value` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_u_id` (`fk_u_id`),
  KEY `fk_m_id` (`fk_m_id`),
  KEY `fk_r_id` (`fk_r_id`),
  FOREIGN KEY (`fk_u_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`fk_m_id`) REFERENCES `match_det` (`id`),
  FOREIGN KEY (`fk_r_id`) REFERENCES `rule` (`id`)
);

CREATE TABLE `predict_backup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_u_id` int(11) NOT NULL,
  `fk_m_id` int(11) NOT NULL,
  `fk_r_id` int(11) NOT NULL,
  `predict_value` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_u_id` (`fk_u_id`),
  KEY `fk_m_id` (`fk_m_id`),
  KEY `fk_r_id` (`fk_r_id`)
);

CREATE TABLE `score` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_u_id` int(11) NOT NULL,
  `fk_m_id` int(11) NOT NULL,
  `fk_r_id` int(11) NOT NULL,
  `predict_value` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `score_value` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_u_id` (`fk_u_id`),
  KEY `fk_m_id` (`fk_m_id`),
  KEY `fk_r_id` (`fk_r_id`),
  FOREIGN KEY (`fk_u_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`fk_m_id`) REFERENCES `match_det` (`id`),
  FOREIGN KEY (`fk_r_id`) REFERENCES `rule` (`id`)
);

CREATE TABLE `result` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_m_id` int(11) NOT NULL,
  `fk_r_id` int(11) NOT NULL,
  `actual_value` int(11) DEFAULT NULL,
  `timeAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_m_id` (`fk_m_id`),
  KEY `fk_r_id` (`fk_r_id`),
  FOREIGN KEY (`fk_m_id`) REFERENCES `match_det` (`id`),
  FOREIGN KEY (`fk_r_id`) REFERENCES `rule` (`id`)
);

CREATE TABLE `rule_range` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_r_id` int(11) NOT NULL,
  `point_range` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_r_id` (`fk_r_id`),
  FOREIGN KEY (`fk_r_id`) REFERENCES `rule` (`id`)
);

CREATE INDEX idx_xx_email
  ON users (email);
