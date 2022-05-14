CREATE EXTENSION IF NOT "uuid-ossp";

DROP TABLE IF EXISTS words;

CREATE TABLE IF NOT EXISTS words(
    id  uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    word CHAR(5) NOT NULL,
    published DATE 
);

INSERT INTO words(word) VALUES
();