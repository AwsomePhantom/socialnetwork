DROP DATABASE IF EXISTS swelab;
CREATE DATABASE swelab;
USE swelab;

-- List of persons with a profile
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    avatar VARCHAR(255),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- List of users with reference to their profiles
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);

-- 1-to-1 Messages
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender INT NOT NULL,
    receiver INT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Message MAX 64KB
    message TEXT DEFAULT NULL,
    FOREIGN KEY (sender) REFERENCES users(id),
    FOREIGN KEY (receiver) REFERENCES users(id)
);

-- List of groups
CREATE TABLE `groups` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- List of group members
CREATE TABLE group_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    profile_id INT NOT NULL,
    joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `groups`(id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);

-- List of group messages
CREATE TABLE group_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    sender_profile_id INT NOT NULL,
    -- Message MAX 64KB
    message TEXT DEFAULT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `groups`(id),
    FOREIGN KEY (sender_profile_id) REFERENCES profiles(id)
);

-- List of clubs
CREATE TABLE clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- List of club members
CREATE TABLE club_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    profile_id INT NOT NULL,
    joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);

-- List of club messages
CREATE TABLE club_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    sender_profile_id INT NOT NULL,
    -- Message MAX 64KB
    message TEXT DEFAULT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id),
    FOREIGN KEY (sender_profile_id) REFERENCES profiles(id)
);

-- Insert sample data

START TRANSACTION;

INSERT INTO profiles (name, lastname, birthdate) VALUES
    ('rabinul', 'islam', '1992-11-10'),
    ('noor', 'chowdhury', '1985-08-13'),
    ('ted', 'ross', '1987-01-25');

INSERT INTO users (profile_id, email, password) VALUES
    (1, 'rabinul@email.com', '123456'), -- **CORRECTION 4: Password should be a string**
    (2, 'noor@email.com', '123456'), -- **CORRECTION 5: Fixed 'noor.com' to 'noor@email.com'**
    (3, 'ted@email.com', '123456');

INSERT INTO clubs (name) VALUES ('COMPUTER CLUB'), ('PHOTOGRAPHY CLUB'), ('ENGLISH DEBATE CLUB');
INSERT INTO club_members (club_id, profile_id) VALUES (1, 1), (2, 2), (3, 3);
INSERT INTO messages(sender, receiver, message) VALUES (1, 2, 'Hello World!');

COMMIT;
