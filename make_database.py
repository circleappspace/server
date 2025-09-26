import sqlite3
import os


def create_database(db_name):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # 프로필(서클) 테이블 생성
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS circles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            bio TEXT
        );
    ''')

    # 로그인 정보 테이블 생성
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS auths (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            circle_id INTEGER,
            token TEXT NOT NULL,
            agent TEXT NOT NULL,
            FOREIGN KEY(circle_id) REFERENCES circles(id)
        );
    ''')

    # 게시물(버블) 테이블 생성
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bubbles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            circle_id INTEGER,
            content VARCHAR(256) NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            anchor INTEGER DEFAULT NULL,
            FOREIGN KEY(circle_id) REFERENCES circles(id),
            FOREIGN KEY(anchor) REFERENCES bubbles(id)
        );
    ''')

    # 참가(팔로우) 테이블 생성
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS joins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            joiner_id INTEGER,
            joinee_id INTEGER,
            UNIQUE(joiner_id, joinee_id),
            FOREIGN KEY(joiner_id) REFERENCES circles(id),
            FOREIGN KEY(joinee_id) REFERENCES circles(id)
        );
    ''')

    # 샘플 데이터 삽입
    for i in range(1, 6):
        cursor.execute(
                'INSERT INTO circles (username, password_hash, name, bio) VALUES (?, ?, ?, ?)',
                (f'user{i}', f'hash{i}', f'Circle {i}', f'This is the bio of Circle {i}.')
        )
        circle_id = cursor.lastrowid
        for j in range(1, 4):
            cursor.execute(
                    'INSERT INTO bubbles (circle_id, content) VALUES (?, ?)',
                    (circle_id, f'This is bubble {j} of Circle {i}.')
            )

    # 샘플 팔로우 관계 삽입
    cursor.execute('INSERT INTO joins (joiner_id, joinee_id) VALUES (1, 2)')
    cursor.execute('INSERT INTO joins (joiner_id, joinee_id) VALUES (1, 3)')
    cursor.execute('INSERT INTO joins (joiner_id, joinee_id) VALUES (2, 3)')
    cursor.execute('INSERT INTO joins (joiner_id, joinee_id) VALUES (3, 4)')

    conn.commit()
    conn.close()


if __name__ == "__main__":
    if os.path.exists('database.db'):
        os.remove('database.db')
    create_database('database.db')
    print("Database 'database.db' created with sample data.")
