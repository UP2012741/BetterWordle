CREATE EXTENSION IF NOTS "uuid-ossp";

DROP TABLE IF EXISTS words;

CREATE TABLE IF NOT EXISTS words(
    id  uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    word CHAR(5);
);

INSERT INTO words(word) VALUES
()