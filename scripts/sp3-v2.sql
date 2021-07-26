CALL CalculateScore(4);
--------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS CalculateScore
;

DELIMITER $$
CREATE PROCEDURE
   CalculateScore(
                  IN inMatchId INT
                  )
BEGIN
   declare rule_id             int;
   declare score_id            int;
   declare score_predict_value int;
   declare score_createdAt     datetime;
   declare rule_points         int;
   declare result_actual_value int;
   declare score_score_value   int;
   declare lvi_predict_val     int;
   declare rule_range_range    int;
   declare rule_range_point    int;
   declare lvd_createdAt       datetime;
   DECLARE done1               BOOLEAN DEFAULT false;
   DECLARE done2               BOOLEAN DEFAULT false;
   BLOCK1:
BEGIN
   DECLARE cur_score CURSOR FOR
   SELECT
      id
    , predict_value
    , fk_r_id
	, createdAt
   FROM
      score
   where
      fk_m_id = inMatchId
   ;
   
   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done1 = TRUE;
   OPEN cur_score;
   cur_score_loop:
   LOOP
      FETCH cur_score
      INTO
         score_id
       , score_predict_value
       , rule_id
	   , score_createdAt
      ;
      
      IF done1 THEN
         CLOSE cur_score;
         LEAVE cur_score_loop;
      END IF;
      SET rule_points         = null;
      SET result_actual_value = null;
      SET score_score_value   = null;
      select
         rule.points
       , result.actual_value
      FROM
         rule
         INNER JOIN
            result
            on
               rule.id = result.fk_r_id
      where
         rule.id            = rule_id
         and result.fk_m_id = inMatchId
      into
         rule_points
       , result_actual_value
      ;
      
      if ((rule_points IS NOT NULL) AND
          (result_actual_value IS NOT NULL) and
		  (score_createdAt IS NOT NULL))
         THEN
		 set done2 = false;
         if result_actual_value   = score_predict_value THEN
            set score_score_value = rule_points;
			set done2 = true;
         else
            set score_score_value = 0;
         end if;
         
		 BLOCK2:
         BEGIN
            DECLARE cur_rule_range CURSOR FOR
            SELECT
               point_range
             , points
            FROM
               rule_range
            where
               fk_r_id = rule_id
            ;
            
            /* If we have a rule range */
            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done2 = TRUE;
            OPEN cur_rule_range;
            cur_rule_rng_loop:
            LOOP
               FETCH cur_rule_range
               INTO
                  rule_range_range
                , rule_range_point
               ;
               
               IF done2 THEN
                  CLOSE cur_rule_range;
                  LEAVE cur_rule_rng_loop;
               END IF;
               
               if (((score_predict_value) <= (result_actual_value + rule_range_range)) and
                   ((score_predict_value) >= (result_actual_value - rule_range_range))) THEN
                  set score_score_value = rule_range_point;
                  SET done2 = TRUE;
               end if;
            END LOOP cur_rule_rng_loop;
         END BLOCK2;
   else
      set score_score_value = -1; /* No Prediction -1 */
   end if;
   
   UPDATE
      score
   SET score_value = score_score_value
   WHERE
      id = score_id
   ;

END LOOP cur_score_loop;
END BLOCK1;
END$$
DELIMITER ;
--------------------------------------------------------------------------------------------
