DROP TRIGGER IF EXISTS create_rec_league;

DELIMITER $$

CREATE TRIGGER create_rec_league

AFTER INSERT
    ON users FOR EACH ROW
BEGIN
    INSERT INTO userleague (fk_u_id,fk_l_id,owner)
        VALUES(new.id ,1 , false);
	
END$$

DELIMITER ;
