import os
import pymysql
import dotenv


def create_database():
    dotenv.load_dotenv()

    env = os.environ
    db_name = env.get('DB_NAME', 'circle')
    conn = pymysql.connect(
        host=env.get('DB_HOST', 'localhost'),
        user=env.get('DB_USER', 'root'),
        password=env.get('DB_PASS', ''),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    cursor = conn.cursor()

    cursor.execute(f'DROP DATABASE IF EXISTS {db_name};')

    cursor.execute(f'CREATE DATABASE IF NOT EXISTS {db_name};')
    cursor.execute(f'USE {db_name};')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS circles (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            name VARCHAR(100) NOT NULL,
            bio VARCHAR(256) DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS auths (
            id INT PRIMARY KEY AUTO_INCREMENT,
            circle_id INT,
            token VARCHAR(255) NOT NULL,
            agent VARCHAR(255) NOT NULL,
            FOREIGN KEY(circle_id) REFERENCES circles(id)
        );
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bubbles (
            id INT PRIMARY KEY AUTO_INCREMENT,
            circle_id INT,
            content VARCHAR(256) NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            anchor INT DEFAULT NULL,
            FOREIGN KEY(circle_id) REFERENCES circles(id),
            FOREIGN KEY(anchor) REFERENCES bubbles(id)
        );
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS joins (
            id INT PRIMARY KEY AUTO_INCREMENT,
            joiner_id INT,
            joinee_id INT,
            FOREIGN KEY(joiner_id) REFERENCES circles(id),
            FOREIGN KEY(joinee_id) REFERENCES circles(id)
        );
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pops (
            id INT PRIMARY KEY AUTO_INCREMENT,
            popper_id INT NOT NULL,
            popped_id INT NOT NULL,
            emoji VARCHAR(10) NOT NULL,
            FOREIGN KEY(popper_id) REFERENCES circles(id),
            FOREIGN KEY(popped_id) REFERENCES bubbles(id),
            UNIQUE(popper_id, popped_id, emoji)
        );
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INT PRIMARY KEY AUTO_INCREMENT,
            circle_id INT,
            content VARCHAR(512) NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(circle_id) REFERENCES circles(id)
        );
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medias (
            id INT PRIMARY KEY AUTO_INCREMENT,
            bubble_id INT,
            url VARCHAR(255) NOT NULL,
            FOREIGN KEY(bubble_id) REFERENCES bubbles(id)
        );
    ''')

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_database()

