CREATE EXTENSION IF NOTS "uuid-ossp";

DROP TABLE IF EXISTS betterwordle;

CREATE TABLE IF NOT EXISTS words(
    id  uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    word VARCHAR(5);
);



