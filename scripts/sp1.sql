CALL InsertResult(1);
SHOW WARNINGS;
--------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS InsertScore;

DROP PROCEDURE IF EXISTS InsertResult;
DELIMITER $$
CREATE PROCEDURE
   InsertResult(
                IN inMatchId INT
                )
BEGIN
   declare stage1, stage2, stage3 datetime;
   declare rule_id int;
   declare rule_stage varchar(8);
   DECLARE done BOOLEAN DEFAULT false;
   
   DECLARE currule CURSOR FOR SELECT id , stage  FROM rule where active = true;
   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
   
   select
      addtime(match_det.start_time,"-00:30")
    , match_det.start_time
    , addtime(match_det.start_time,"01:00")
   from
      match_det
   where
      match_det.id = inMatchId
   into
      stage1
    , stage2
    , stage3
   ;
   
   OPEN currule;
   
   curruleloop: LOOP
     FETCH currule INTO rule_id, rule_stage ;
	 
	 IF done THEN
         CLOSE currule;
         LEAVE curruleloop;
     END IF;

	 if rule_stage = "stage1" then
        insert into result ( fk_m_id, fk_r_id, timeAt) values (inMatchId, rule_id , stage1);
	 end if;
	 if rule_stage = "stage2" then
         insert into result ( fk_m_id, fk_r_id, timeAt) values (inMatchId, rule_id , stage2);
 	 end if;
	 if rule_stage = "stage3" then
        insert into result ( fk_m_id, fk_r_id, timeAt) values (inMatchId, rule_id , stage3);
	 end if;
	 
   END LOOP curruleloop;
       
   
   END$$
   DELIMITER ;
--------------------------------------------------------------------------------------------   
