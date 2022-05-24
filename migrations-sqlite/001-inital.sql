-- UP
CREATE TABLE Words(
    id INTEGER PRIMARY KEY,
    word CHAR(5)   NOT NULL 
);


INSERT INTO Words (id, word) VALUES
(1,'SWILL'),
(2,'FERRY'),
(3,'FORGO'),
(4,'FEWER'),
(5,'LOWLY'),
(6,'FOYER'),
(7,'FLAIR'),
(8,'FEWER'),
(9,'FORAY'),
(10,'SNOUT'),
(11,'REBUS'),
(12,'BANAL'),
(13,'ABBEY'),
(14,'WHACK'),
(15,'WRUNG'),
(16,'WHACK'),
(17,'SUGAR'),
(18,'SHIRE'),
(19,'KNOLL'),
(20,'SWILL'),
(21,'VIVID'),
(22,'AROMA'),
(23,'THEIR'),
(24,'ALLOW'),
(25,'DEPOT'),
(26,'MOVIE'),
(27,'ZEPHR'),
(28,'TAXES'),
(29,'POINT'),
(30,'THORN'),
(31,'STAIR');


-- Down

DROP TABLE Words