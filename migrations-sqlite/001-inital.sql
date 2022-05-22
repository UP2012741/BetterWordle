-- UP
CREATE TABLE Words(
    id CHAR(36) PRIMARY KEY,
    word CHAR(5)   NOT NULL
);


INSERT INTO Words (id, word) VALUES
( 'xnshfdsafasd',
  'pog');


-- Down

DROP TABLE Words