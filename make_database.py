import os
import pymysql
import dotenv


def create_database():
    dotenv.load_dotenv()

    env = os.environ
    conn = pymysql.connect(
        host=env.get('DB_HOST', 'localhost'),
        user=env.get('DB_USER', 'root'),
        password=env.get('DB_PASS', ''),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    cursor = conn.cursor()

    cursor.execute('CREATE DATABASE IF NOT EXISTS circle;')
    cursor.execute('USE circle;')

    cursor.execute('DROP TABLE IF EXISTS joins;')
    cursor.execute('DROP TABLE IF EXISTS bubbles;')
    cursor.execute('DROP TABLE IF EXISTS auths;')
    cursor.execute('DROP TABLE IF EXISTS circles;')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS circles (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            name VARCHAR(100) NOT NULL,
            bio VARCHAR(256) DEFAULT ''
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

    # 샘플 데이터 삽입
    for i in range(1, 6):
        cursor.execute('''
            INSERT INTO circles (username, password_hash, name, bio)
            VALUES (%s, %s, %s, %s);
        ''', (f'user{i}', 'hashed_password', f'User {i}', f'This is user {i}\'s bio.'))

        for j in range(1, 4):
            cursor.execute('''
                INSERT INTO bubbles (circle_id, content)
                VALUES (%s, %s);
            ''', (i, f'This is bubble {j} from user {i}.'))

    cursor.execute('''
        INSERT INTO joins (joiner_id, joinee_id)
        VALUES (1, 2), (1, 3), (2, 3), (4, 5);
    ''')

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_database()
    print("Database and tables created, sample data inserted.")
