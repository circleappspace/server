-- MariaDB SQL Script to initialize the database schema for Circle application

DROP DATABASE IF EXISTS circle;

CREATE DATABASE IF NOT EXISTS circle;

USE circle;

CREATE TABLE IF NOT EXISTS circles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS bubbles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    circle_id INT NOT NULL,
    anchor INT,
    FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE,
    FOREIGN KEY (anchor) REFERENCES bubbles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS joins (
    joiner_id INT NOT NULL,
    joinee_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (joiner_id, joinee_id),
    FOREIGN KEY (joiner_id) REFERENCES circles(id) ON DELETE CASCADE,
    FOREIGN KEY (joinee_id) REFERENCES circles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auths (
    circle_id INT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    agent VARCHAR(255),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pops (
    popper_id INT NOT NULL,
    popped_id INT NOT NULL,
    popped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    emoji VARCHAR(10) NOT NULL,
    PRIMARY KEY (popper_id, popped_id, emoji),
    FOREIGN KEY (popper_id) REFERENCES circles(id) ON DELETE CASCADE,
    FOREIGN KEY (popped_id) REFERENCES bubbles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medias (
    bubble_id INT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (bubble_id) REFERENCES bubbles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    circle_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE
);