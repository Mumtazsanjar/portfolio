-- ===== MUMTAZ SANJAR PORTFOLIO DATABASE =====
-- Run this file in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS mumtaz_portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mumtaz_portfolio;

-- ===== CONTACTS TABLE =====
CREATE TABLE IF NOT EXISTS contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL,
  phone      VARCHAR(20)   DEFAULT NULL,
  subject    VARCHAR(200)  NOT NULL,
  message    TEXT          NOT NULL,
  is_read    TINYINT(1)    DEFAULT 0,
  created_at DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== PROJECTS TABLE =====
CREATE TABLE IF NOT EXISTS projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(150)  NOT NULL,
  description TEXT,
  category    VARCHAR(50),
  image_url   VARCHAR(300),
  live_url    VARCHAR(300),
  github_url  VARCHAR(300),
  tech_stack  VARCHAR(300),
  is_featured TINYINT(1)    DEFAULT 0,
  sort_order  INT           DEFAULT 0,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== VISITORS TABLE =====
CREATE TABLE IF NOT EXISTS visitors (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  -- Device Info
  device_type  VARCHAR(20)   DEFAULT NULL COMMENT 'mobile / tablet / desktop',
  device_name  VARCHAR(200)  DEFAULT NULL COMMENT 'e.g. iPhone 13, Samsung Galaxy',
  os_name      VARCHAR(100)  DEFAULT NULL COMMENT 'e.g. Windows 10, Android 12',
  browser      VARCHAR(100)  DEFAULT NULL COMMENT 'e.g. Chrome 120',
  screen_size  VARCHAR(30)   DEFAULT NULL COMMENT 'e.g. 1920x1080',
  -- Location Info (from IP)
  ip_address   VARCHAR(50)   DEFAULT NULL,
  country      VARCHAR(100)  DEFAULT NULL,
  city         VARCHAR(100)  DEFAULT NULL,
  region       VARCHAR(100)  DEFAULT NULL,
  latitude     VARCHAR(30)   DEFAULT NULL,
  longitude    VARCHAR(30)   DEFAULT NULL,
  timezone     VARCHAR(100)  DEFAULT NULL,
  isp          VARCHAR(200)  DEFAULT NULL,
  -- Page Info
  page_url     VARCHAR(500)  DEFAULT NULL,
  referrer     VARCHAR(500)  DEFAULT NULL,
  language     VARCHAR(20)   DEFAULT NULL,
  -- Timestamp
  visited_at   DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== SAMPLE PROJECTS DATA =====
INSERT INTO projects (title, description, category, image_url, tech_stack, is_featured, sort_order) VALUES
('E-Commerce Website',    'Full-stack e-commerce platform with PHP & MySQL backend.', 'web',       'https://via.placeholder.com/400x250/6c63ff/ffffff?text=E-Commerce',   'HTML,CSS,PHP,MySQL',          1, 1),
('Laravel Blog Platform', 'Dynamic blog with admin panel built with Laravel.',        'web',       'https://via.placeholder.com/400x250/f093fb/ffffff?text=Blog+Platform', 'Laravel,PHP,MySQL,Bootstrap', 1, 2),
('WordPress Business Site','Professional business site with Elementor & SEO.',       'wordpress', 'https://via.placeholder.com/400x250/43e97b/ffffff?text=WordPress+Site','WordPress,Elementor,SEO',     1, 3),
('Restaurant Website',    'Beautiful restaurant site with online ordering.',          'web',       'https://via.placeholder.com/400x250/fa709a/ffffff?text=Restaurant',   'HTML,CSS,JS,Bootstrap',       0, 4),
('Portfolio Template',    'Modern portfolio design with animations.',                 'design',    'https://via.placeholder.com/400x250/4facfe/ffffff?text=Portfolio',    'HTML,CSS,JS',                 0, 5),
('Task Manager App',      'PHP-based task management with user auth.',                'app',       'https://via.placeholder.com/400x250/ff6584/ffffff?text=Task+Manager', 'PHP,MySQL,JS,Bootstrap',      0, 6);
