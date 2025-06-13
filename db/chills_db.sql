-- =============================================
-- CHILL APPS DATABASE - Simple MySQL Script
-- Movie Streaming Platform Database
-- =============================================

DROP DATABASE IF EXISTS chills_db;
CREATE DATABASE chills_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chills_db;

-- =============================================
-- CREATE TABLES
-- =============================================

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    profile_picture VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Genres table
CREATE TABLE genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages table
CREATE TABLE packages (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INT NOT NULL,
    max_devices INT DEFAULT 1,
    features TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    poster_landscape VARCHAR(255),
    poster_portrait VARCHAR(255),
    release_year YEAR,
    duration_minutes INT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    director VARCHAR(100),
    cast_list TEXT,
    trailer_url VARCHAR(255),
    video_url VARCHAR(255),
    is_trending BOOLEAN DEFAULT FALSE,
    is_top_rated BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Series table
CREATE TABLE series (
    series_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    poster_landscape VARCHAR(255),
    poster_portrait VARCHAR(255),
    release_year YEAR,
    total_seasons INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'ongoing',
    rating DECIMAL(2,1) DEFAULT 0.0,
    director VARCHAR(100),
    cast_list TEXT,
    trailer_url VARCHAR(255),
    is_trending BOOLEAN DEFAULT FALSE,
    is_top_rated BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Episodes table
CREATE TABLE episodes (
    episode_id INT AUTO_INCREMENT PRIMARY KEY,
    series_id INT NOT NULL,
    season_number INT NOT NULL,
    episode_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    duration_minutes INT,
    video_url VARCHAR(255),
    thumbnail VARCHAR(255),
    air_date DATE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE
);

-- Movie Genres junction table
CREATE TABLE movie_genres (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

-- Series Genres junction table
CREATE TABLE series_genres (
    series_id INT NOT NULL,
    genre_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (series_id, genre_id),
    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

-- Watchlist table
CREATE TABLE watchlist (
    watchlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content_type VARCHAR(10) NOT NULL,
    content_id INT NOT NULL,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User Ratings table
CREATE TABLE user_ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content_type VARCHAR(10) NOT NULL,
    content_id INT NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Watch History table
CREATE TABLE watch_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content_type VARCHAR(10) NOT NULL,
    content_id INT NOT NULL,
    watch_progress INT DEFAULT 0,
    total_duration INT DEFAULT 0,
    last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
);

-- Payments table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    transaction_id VARCHAR(100) UNIQUE,
    payment_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- User Subscriptions table
CREATE TABLE user_subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    order_id INT NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    auto_renewal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(package_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Content Badges table
CREATE TABLE content_badges (
    badge_id INT AUTO_INCREMENT PRIMARY KEY,
    content_type VARCHAR(10) NOT NULL,
    content_id INT NOT NULL,
    badge_type VARCHAR(20) NOT NULL,
    badge_text VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL
);

-- =============================================
-- INSERT DUMMY DATA
-- =============================================

-- Insert Genres
INSERT INTO genres (genre_name, description) VALUES
('Aksi', 'Film dengan adegan aksi dan petualangan'),
('Komedi', 'Film yang menghibur dan lucu'),
('Drama', 'Film dengan cerita mendalam dan emosional'),
('Sains & Alam', 'Film dokumenter atau fiksi ilmiah'),
('Kejahatan', 'Film bertemakan kriminal dan investigasi'),
('Anime', 'Film atau series animasi Jepang'),
('Fantasi', 'Film dengan elemen magis dan fantasi'),
('Fantasi Ilmiah', 'Film fiksi ilmiah dengan teknologi masa depan'),
('Petualangan', 'Film dengan perjalanan dan eksplorasi'),
('Horor', 'Film yang menakutkan dan menegangkan'),
('Romance', 'Film dengan tema percintaan'),
('Thriller', 'Film dengan ketegangan dan suspense');

-- Insert Packages
INSERT INTO packages (package_name, price, duration_days, max_devices, features) VALUES
('Basic', 49000.00, 30, 1, 'HD Quality, With Ads, No Downloads'),
('Standard', 79000.00, 30, 2, 'Full HD Quality, No Ads, Downloads Available'),
('Premium', 129000.00, 30, 4, '4K Quality, No Ads, Downloads, Exclusive Content'),
('Family', 159000.00, 30, 6, '4K Quality, No Ads, Downloads, Kids Profile'),
('Student', 29000.00, 30, 1, 'HD Quality, Limited Ads, Student Discount');

-- Insert Users
INSERT INTO users (username, email, password_hash, full_name, date_of_birth, phone_number, subscription_status, is_verified, verification_token) VALUES
('john_doe', 'john@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa', 'John Doe', '1990-05-15', '081234567890', 'active', TRUE, NULL),
('jane_smith', 'jane@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa', 'Jane Smith', '1992-08-20', '081234567891', 'active', TRUE, NULL),
('mike_wilson', 'mike@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa', 'Mike Wilson', '1988-12-03', '081234567892', 'inactive', TRUE, NULL),
('sarah_jones', 'sarah@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa', 'Sarah Jones', '1995-03-10', '081234567893', 'active', TRUE, NULL),
('admin_user', 'admin@chill.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa', 'Admin User', '1985-01-01', '081234567894', 'active', TRUE, NULL),
('david_brown', 'david@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa', 'David Brown', '1993-07-22', '081234567895', 'expired', TRUE, NULL),
('lisa_davis', 'lisa@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa', 'Lisa Davis', '1991-11-18', '081234567896', 'active', TRUE, NULL),
('tom_miller', 'tom@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa', 'Tom Miller', '1987-09-05', '081234567897', 'inactive', TRUE, NULL),
('test_user', 'test@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCAh9uZy6/WYBa', 'Test User', '1990-01-01', '081234567898', 'active', TRUE, NULL);

-- Insert Movies
INSERT INTO movies (title, overview, poster_landscape, poster_portrait, release_year, duration_minutes, rating, director, cast_list, is_trending, is_top_rated, view_count) VALUES
('Don\'t Look Up', 'Film tentang dua astronom yang mencoba memperingatkan dunia tentang komet yang mendekat', 'poster1.png', NULL, 2021, 138, 4.5, 'Adam McKay', 'Leonardo DiCaprio, Jennifer Lawrence, Meryl Streep', FALSE, FALSE, 250000),
('The Batman', 'Film tentang Batman di tahun-tahun awalnya sebagai pejuang kejahatan', 'poster2.png', NULL, 2022, 176, 4.8, 'Matt Reeves', 'Robert Pattinson, Zoë Kravitz, Paul Dano', FALSE, TRUE, 450000),
('Suzume', 'Film animasi Jepang tentang gadis yang menemukan pintu misterius', NULL, 'portraitPoster14.png', 2022, 122, 4.7, 'Makoto Shinkai', 'Nanoka Hara, Hokuto Matsumura', FALSE, TRUE, 380000),
('The Tomorrow War', 'Film tentang manusia dari masa depan yang kembali untuk merekrut tentara melawan alien', NULL, 'portraitPoster7.png', 2021, 140, 4.3, 'Chris McKay', 'Chris Pratt, Yvonne Strahovski, J.K. Simmons', TRUE, FALSE, 320000),
('Black Adam', 'Film tentang anti-hero dengan kekuatan dewa Mesir kuno', NULL, 'portraitPoster21.png', 2022, 125, 4.1, 'Jaume Collet-Serra', 'Dwayne Johnson, Aldis Hodge, Noah Centineo', TRUE, FALSE, 290000),
('Guardians of the Galaxy', 'Film tentang kelompok penjahat luar angkasa yang bersatu untuk menyelamatkan galaksi', NULL, 'portraitPoster30.png', 2014, 121, 4.6, 'James Gunn', 'Chris Pratt, Zoe Saldana, Dave Bautista', TRUE, FALSE, 520000),
('A Man Called Otto', 'Film tentang seorang pria tua pemarah yang menemukan tujuan baru dalam hidup', 'poster9.png', 'portraitPoster10.png', 2022, 126, 4.6, 'Marc Forster', 'Tom Hanks, Mariana Treviño, Rachel Keller', TRUE, FALSE, 210000),
('Avengers: Endgame', 'Film superhero tentang pertarungan final melawan Thanos', 'avengers_landscape.png', 'avengers_portrait.png', 2019, 181, 4.9, 'Russo Brothers', 'Robert Downey Jr., Chris Evans, Scarlett Johansson', FALSE, TRUE, 890000),
('Parasite', 'Film thriller Korea tentang kesenjangan sosial', 'parasite_landscape.png', 'parasite_portrait.png', 2019, 132, 4.8, 'Bong Joon-ho', 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong', FALSE, TRUE, 340000),
('Spider-Man: No Way Home', 'Film superhero tentang Spider-Man menghadapi multiverse', 'spiderman_landscape.png', 'spiderman_portrait.png', 2021, 148, 4.7, 'Jon Watts', 'Tom Holland, Zendaya, Benedict Cumberbatch', TRUE, TRUE, 750000);

-- Insert Series
INSERT INTO series (title, overview, poster_landscape, poster_portrait, release_year, total_seasons, status, rating, director, cast_list, is_trending, is_top_rated, view_count) VALUES
('Blue Lock', 'Anime tentang program pelatihan striker sepak bola Jepang', 'poster5.png', NULL, 2022, 1, 'ongoing', 4.7, 'Tetsuaki Watanabe', 'Kazuki Ura, Tasuku Kaito, Yuki Ono', FALSE, FALSE, 180000),
('Stranger Things', 'Serial tentang anak-anak yang menghadapi kekuatan supernatural', 'stranger_landscape.png', 'stranger_portrait.png', 2016, 4, 'completed', 4.8, 'Duffer Brothers', 'Millie Bobby Brown, Finn Wolfhard, David Harbour', TRUE, TRUE, 650000),
('The Crown', 'Drama sejarah tentang keluarga kerajaan Inggris', 'crown_landscape.png', 'crown_portrait.png', 2016, 6, 'completed', 4.5, 'Peter Morgan', 'Claire Foy, Olivia Colman, Imelda Staunton', FALSE, TRUE, 420000),
('Wednesday', 'Serial tentang Wednesday Addams di Nevermore Academy', 'wednesday_landscape.png', 'wednesday_portrait.png', 2022, 1, 'ongoing', 4.6, 'James Lovato', 'Jenna Ortega, Hunter Doohan, Percy Hynes White', TRUE, FALSE, 380000),
('Money Heist', 'Serial tentang perampokan bank dengan dalang misterius', 'money_landscape.png', 'money_portrait.png', 2017, 5, 'completed', 4.4, 'Álex Pina', 'Álvaro Morte, Úrsula Corberó, Pedro Alonso', FALSE, TRUE, 490000),
('Attack on Titan', 'Anime tentang manusia melawan titan raksasa', 'aot_landscape.png', 'aot_portrait.png', 2013, 4, 'completed', 4.9, 'Wit Studio', 'Yuki Kaji, Marina Inoue, Yui Ishikawa', TRUE, TRUE, 720000),
('Breaking Bad', 'Drama tentang guru kimia yang menjadi pembuat narkoba', 'bb_landscape.png', 'bb_portrait.png', 2008, 5, 'completed', 4.9, 'Vince Gilligan', 'Bryan Cranston, Aaron Paul, Anna Gunn', FALSE, TRUE, 580000),
('Squid Game', 'Serial thriller Korea tentang permainan mematikan', 'squid_landscape.png', 'squid_portrait.png', 2021, 2, 'ongoing', 4.6, 'Hwang Dong-hyuk', 'Lee Jung-jae, Park Hae-soo, Wi Ha-jun', TRUE, TRUE, 890000);

-- Insert Episodes
INSERT INTO episodes (series_id, season_number, episode_number, title, overview, duration_minutes, video_url, air_date, view_count) VALUES
-- Blue Lock Episodes
(1, 1, 1, 'Dream', 'Isagi Yoichi bergabung dengan program Blue Lock', 24, 'bluelock_s1e1.mp4', '2022-10-08', 45000),
(1, 1, 2, 'Monster', 'Isagi menghadapi tantangan pertama di Blue Lock', 24, 'bluelock_s1e2.mp4', '2022-10-15', 42000),
(1, 1, 3, 'Soccer\'s Zero', 'Kompetisi semakin ketat di Blue Lock', 24, 'bluelock_s1e3.mp4', '2022-10-22', 38000),

-- Stranger Things Episodes
(2, 1, 1, 'The Vanishing of Will Byers', 'Will Byers menghilang secara misterius', 48, 'st_s1e1.mp4', '2016-07-15', 120000),
(2, 1, 2, 'The Weirdo on Maple Street', 'Eleven bertemu dengan Mike dan teman-temannya', 55, 'st_s1e2.mp4', '2016-07-15', 115000),
(2, 4, 1, 'The Hellfire Club', 'Hawkins menghadapi ancaman baru dari Upside Down', 78, 'st_s4e1.mp4', '2022-05-27', 180000),

-- Wednesday Episodes
(4, 1, 1, 'Wednesday\'s Child Is Full of Woe', 'Wednesday tiba di Nevermore Academy', 51, 'wednesday_s1e1.mp4', '2022-11-23', 95000),
(4, 1, 2, 'Woe Is the Loneliest Number', 'Wednesday menyelidiki misteri di sekolah', 49, 'wednesday_s1e2.mp4', '2022-11-23', 88000),

-- Attack on Titan Episodes
(6, 1, 1, 'To You, in 2000 Years', 'Titan menyerang Wall Maria', 24, 'aot_s1e1.mp4', '2013-04-07', 85000),
(6, 4, 28, 'The Dawn of Humanity', 'Episode final Attack on Titan', 87, 'aot_s4e28.mp4', '2023-11-04', 200000),

-- Squid Game Episodes
(8, 1, 1, 'Red Light, Green Light', 'Permainan pertama dimulai', 60, 'squid_s1e1.mp4', '2021-09-17', 150000),
(8, 1, 9, 'One Lucky Day', 'Final dari season pertama', 56, 'squid_s1e9.mp4', '2021-09-17', 180000);

-- Insert Movie-Genre relationships
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 4), (1, 2), -- Don't Look Up: Sains & Alam, Komedi
(2, 1), (2, 5), -- The Batman: Aksi, Kejahatan
(3, 6), (3, 7), -- Suzume: Anime, Fantasi
(4, 1), (4, 8), -- The Tomorrow War: Aksi, Fantasi Ilmiah
(5, 1), (5, 7), -- Black Adam: Aksi, Fantasi
(6, 1), (6, 9), (6, 8), -- Guardians: Aksi, Petualangan, Fantasi Ilmiah
(7, 3), (7, 2), -- A Man Called Otto: Drama, Komedi
(8, 1), (8, 8), (8, 3), -- Avengers: Aksi, Fantasi Ilmiah, Drama
(9, 12), (9, 3), (9, 5), -- Parasite: Thriller, Drama, Kejahatan
(10, 1), (10, 8), (10, 9); -- Spider-Man: Aksi, Fantasi Ilmiah, Petualangan

-- Insert Series-Genre relationships
INSERT INTO series_genres (series_id, genre_id) VALUES
(1, 6), (1, 1), -- Blue Lock: Anime, Aksi
(2, 7), (2, 3), (2, 10), -- Stranger Things: Fantasi, Drama, Horor
(3, 3), (3, 11), -- The Crown: Drama, Romance
(4, 10), (4, 3), (4, 7), -- Wednesday: Horor, Drama, Fantasi
(5, 12), (5, 5), (5, 1), -- Money Heist: Thriller, Kejahatan, Aksi
(6, 6), (6, 1), (6, 3), -- Attack on Titan: Anime, Aksi, Drama
(7, 3), (7, 12), (7, 5), -- Breaking Bad: Drama, Thriller, Kejahatan
(8, 12), (8, 10), (8, 3); -- Squid Game: Thriller, Horor, Drama

-- Insert Orders
INSERT INTO orders (user_id, package_id, total_amount, status, expires_at) VALUES
(1, 2, 79000.00, 'paid', '2024-07-30 23:59:59'),
(2, 3, 129000.00, 'paid', '2024-07-30 23:59:59'),
(4, 1, 49000.00, 'paid', '2024-07-30 23:59:59'),
(7, 2, 79000.00, 'paid', '2024-07-30 23:59:59'),
(3, 1, 49000.00, 'pending', '2024-07-01 23:59:59'),
(6, 3, 129000.00, 'failed', '2024-06-30 23:59:59'),
(8, 5, 29000.00, 'pending', '2024-07-05 23:59:59');

-- Insert Payments
INSERT INTO payments (order_id, payment_method, payment_status, payment_date, transaction_id, payment_details) VALUES
(1, 'credit_card', 'success', '2024-06-30 10:15:00', 'TXN001234567890', 'Visa ending 1234, Bank BCA'),
(2, 'e_wallet', 'success', '2024-06-30 14:30:00', 'TXN001234567891', 'GoPay Payment'),
(3, 'bank_transfer', 'success', '2024-06-30 09:45:00', 'TXN001234567892', 'Transfer from BRI'),
(4, 'debit_card', 'success', '2024-06-30 16:20:00', 'TXN001234567893', 'Debit Mandiri ending 5678'),
(5, 'credit_card', 'pending', NULL, 'TXN001234567894', 'Payment in process'),
(6, 'e_wallet', 'failed', '2024-06-25 12:00:00', 'TXN001234567895', 'Insufficient balance'),
(7, 'bank_transfer', 'pending', NULL, 'TXN001234567896', 'Waiting for transfer confirmation');

-- Insert User Subscriptions
INSERT INTO user_subscriptions (user_id, package_id, order_id, start_date, end_date, status) VALUES
(1, 2, 1, '2024-06-30 10:15:00', '2024-07-30 10:15:00', 'active'),
(2, 3, 2, '2024-06-30 14:30:00', '2024-07-30 14:30:00', 'active'),
(4, 1, 3, '2024-06-30 09:45:00', '2024-07-30 09:45:00', 'active'),
(7, 2, 4, '2024-06-30 16:20:00', '2024-07-30 16:20:00', 'active'),
(6, 3, 6, '2024-05-01 00:00:00', '2024-05-31 23:59:59', 'expired');

-- Insert Watchlist
INSERT INTO watchlist (user_id, content_type, content_id) VALUES
(1, 'movie', 1), -- John likes Don't Look Up
(1, 'movie', 8), -- John likes Avengers
(1, 'series', 2), -- John likes Stranger Things
(2, 'movie', 2), -- Jane likes The Batman
(2, 'movie', 3), -- Jane likes Suzume
(2, 'series', 4), -- Jane likes Wednesday
(2, 'series', 8), -- Jane likes Squid Game
(4, 'movie', 6), -- Sarah likes Guardians
(4, 'series', 6), -- Sarah likes Attack on Titan
(7, 'movie', 9), -- Lisa likes Parasite
(7, 'movie', 10), -- Lisa likes Spider-Man
(7, 'series', 7), -- Lisa likes Breaking Bad
(3, 'movie', 4), -- Mike likes Tomorrow War
(3, 'series', 5); -- Mike likes Money Heist

-- Insert User Ratings
INSERT INTO user_ratings (user_id, content_type, content_id, rating, review) VALUES
(1, 'movie', 1, 4.5, 'Film yang sangat menghibur dan penuh pesan moral!'),
(1, 'movie', 8, 5.0, 'Masterpiece! Endgame yang sempurna untuk MCU'),
(1, 'series', 2, 4.8, 'Nostalgia 80an yang dikemas dengan sempurna'),
(2, 'movie', 2, 4.9, 'Robert Pattinson luar biasa sebagai Batman'),
(2, 'movie', 3, 4.7, 'Animasi yang indah dengan cerita yang menyentuh'),
(2, 'series', 4, 4.6, 'Jenna Ortega perfect sebagai Wednesday!'),
(4, 'movie', 6, 4.6, 'Soundtrack amazing! Cerita yang fun'),
(4, 'series', 6, 5.0, 'Anime terbaik sepanjang masa! Ending yang epic'),
(7, 'movie', 9, 4.8, 'Film Korea yang brilian tentang kesenjangan sosial'),
(7, 'series', 7, 4.9, 'Character development Walter White luar biasa'),
(3, 'movie', 4, 4.2, 'Action yang seru tapi cerita agak predictable'),
(3, 'series', 5, 4.4, 'Plot twist yang tidak terduga di setiap episode');

-- Insert Watch History
INSERT INTO watch_history (user_id, content_type, content_id, watch_progress, total_duration, completed) VALUES
-- John's watch history
(1, 'movie', 1, 8280, 8280, TRUE), -- Completed Don't Look Up (138 min)
(1, 'movie', 8, 10860, 10860, TRUE), -- Completed Avengers (181 min)
(1, 'series', 2, 2880, 2880, TRUE), -- Watched Stranger Things S1E1 (48 min)
(1, 'episode', 3, 3300, 3300, TRUE), -- Watched ST S1E2 (55 min)

-- Jane's watch history
(2, 'movie', 2, 10560, 10560, TRUE), -- Completed The Batman (176 min)
(2, 'movie', 3, 7320, 7320, TRUE), -- Completed Suzume (122 min)
(2, 'series', 4, 3060, 3060, TRUE), -- Watched Wednesday S1E1 (51 min)
(2, 'episode', 7, 2940, 2940, TRUE), -- Watched Wednesday S1E2 (49 min)

-- Sarah's watch history
(4, 'movie', 6, 7260, 7260, TRUE), -- Completed Guardians (121 min)
(4, 'series', 6, 1440, 1440, TRUE), -- Watched AoT S1E1 (24 min)
(4, 'episode', 9, 5220, 5220, TRUE), -- Watched AoT final episode (87 min)

-- Lisa's watch history
(7, 'movie', 9, 7920, 7920, TRUE), -- Completed Parasite (132 min)
(7, 'movie', 10, 8880, 8880, TRUE), -- Completed Spider-Man (148 min)
(7, 'series', 8, 3600, 3600, TRUE), -- Watched Squid Game S1E1 (60 min)

-- Mike's watch history (partial)
(3, 'movie', 4, 4200, 8400, FALSE), -- Half-watched Tomorrow War
(3, 'series', 5, 1800, 3600, FALSE); -- Partially watched Money Heist

-- Insert Content Badges
INSERT INTO content_badges (content_type, content_id, badge_type, badge_text, is_active) VALUES
-- Movie badges
('movie', 3, 'episode', 'Episode Baru', TRUE),
('movie', 4, 'top', 'Top 10', TRUE),
('movie', 5, 'top', 'Top 10', TRUE),
('movie', 6, 'top', 'Top 10', TRUE),
('movie', 7, 'top', 'Top 10', TRUE),
('movie', 8, 'top', 'Top 10', TRUE),
('movie', 9, 'top', 'Top 10', TRUE),
('movie', 10, 'top', 'Top 10', TRUE),
('movie', 8, 'trending', 'Trending', TRUE),
('movie', 10, 'trending', 'Trending', TRUE),

-- Series badges
('series', 1, 'episode', 'Episode Baru', TRUE),
('series', 2, 'top', 'Top 10', TRUE),
('series', 3, 'top', 'Top 10', TRUE),
('series', 4, 'episode', 'Episode Baru', TRUE),
('series', 4, 'trending', 'Trending', TRUE),
('series', 6, 'top', 'Top 10', TRUE),
('series', 7, 'top', 'Top 10', TRUE),
('series', 8, 'top', 'Top 10', TRUE),
('series', 8, 'trending', 'Trending', TRUE);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT 'Chill Apps Database created successfully! 🎉' AS status;
SELECT 'All tables created with complete dummy data! 🚀' AS message;
SELECT CONCAT('Total tables: ', COUNT(*)) AS table_count FROM information_schema.tables WHERE table_schema = 'chills_db';