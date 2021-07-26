CALL InsertScore(4);
--------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS InsertScore;
DELIMITER $$
CREATE PROCEDURE
   InsertScore(
                IN inMatchId INT
                )
BEGIN
   declare rule_id int;
   declare user_id int;
   declare lvi_predict_val int;
   declare lvd_createdAt datetime;
   
   DECLARE done1 BOOLEAN DEFAULT false;
   DECLARE done2 BOOLEAN DEFAULT false;
   DECLARE done3 BOOLEAN DEFAULT false;
   
   BLOCK1: BEGIN
   DECLARE curuser CURSOR FOR SELECT id  FROM users;
   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done2 = TRUE;
   
   OPEN curuser;
   
   curuserloop: LOOP
     FETCH curuser INTO user_id;
	 
	 IF done2 THEN
         CLOSE curuser;
         LEAVE curuserloop;
     END IF;
	 
	 set done1 = false;
	 BLOCK2: BEGIN
	 DECLARE currule CURSOR FOR SELECT id  FROM rule where active = true;
     DECLARE CONTINUE HANDLER FOR NOT FOUND SET done1 = TRUE;
	 	 
	 OPEN currule;
	 
	 curruleloop: LOOP
        FETCH currule INTO rule_id ;
	    
	    IF done1 THEN
            CLOSE currule;
            LEAVE curruleloop;
        END IF;
	    
		set lvd_createdAt = null;
		set lvi_predict_val = 0;
		set done3 = false; 
		BLOCK3: BEGIN
	       DECLARE curpredict CURSOR FOR SELECT  predict.createdAt, predict.predict_value FROM predict INNER JOIN result ON result.fk_r_id = predict.fk_r_id and 
		   result.fk_m_id = inMatchId and predict.fk_m_id = inMatchId and predict.fk_r_id = rule_id and predict.fk_u_id = user_id and  predict.createdAt < result.timeAt 
		   ORDER BY predict.createdAt desc limit 1 ;
           
		   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done3 = TRUE;
	       
	       OPEN curpredict;
	       
	       curpredictloop: LOOP
           FETCH curpredict into lvd_createdAt, lvi_predict_val ;
	       
		   IF done3 THEN
               CLOSE curpredict;
               LEAVE curpredictloop;
           END IF;
		END LOOP curpredictloop;
	    END BLOCK3;
		
		insert into score ( fk_u_id, fk_m_id, fk_r_id, predict_value, createdAt) values (user_id, inMatchId, rule_id , lvi_predict_val, lvd_createdAt);
		  
	 END LOOP curruleloop;
	 END BLOCK2;
	 

   END LOOP curuserloop;
   END BLOCK1;
   
   END$$
   DELIMITER ;
--------------------------------------------------------------------------------------------   
