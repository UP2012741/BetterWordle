CREATE EXTENSION IF NOTS "uuid-ossp";

DROP TABLE IF EXISTS betterwordle;

CREATE TABLE IF NOT EXISTS words(
    word_id SERIAL PRIMARY KEY,
    word VARCHAR(5)
);

