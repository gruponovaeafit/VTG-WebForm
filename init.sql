USE vtg;

CREATE TABLE IF NOT EXISTS notification (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    message VARCHAR(100) NOT NULL
);
