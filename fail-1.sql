DROP TABLE IF EXISTS testdata;
CREATE TABLE testdata (
  testdata_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  cost INT NOT NULL DEFAULT 0,
  PRIMARY KEY(testdata_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO testdata(testdata_id, quantity, cost) VALUES
    ( 1,  10,  100),
    ( 2,  20,  200),
    ( 3,  30,  300),
    ( 4,  40,  400),
    ( 5,  50,  500),
    ( 6,  60,  600),
    ( 7,  70,  700),
    ( 8,  80,  800),
    ( 9,  90,  900),
    (10, 100, 1000)
    ;

DROP PROCEDURE IF EXISTS xaction_fail;
DELIMITER $$
CREATE PROCEDURE xaction_fail()
BEGIN
    -- DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN
    --     ROLLBACK;
    --     RESIGNAL;
    -- END;
    START TRANSACTION;
    UPDATE testdata SET quantity = 0 WHERE testdata_id = 4; -- lock modified rows
    -- intentionally hit duplicate key insert; locked rows above are held if no ROLLBACK
    INSERT INTO testdata(testdata_id) VALUES (8);
    COMMIT;
END $$
DELIMITER ;
