DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user"(
    email VARCHAR(100) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    preferences jsonb
);