CALL CalculateLeagueRank(4);
--------------------------------------------------------------------------------------------
 DROP PROCEDURE IF EXISTS CalculateLeagueRank
;

DELIMITER $$
CREATE PROCEDURE
   CalculateLeagueRank(
                  IN inMatchId INT
                  )
BEGIN
   declare score_user_id        int;
   declare score_score_value    int;
   
   declare userleague_user_id   int;
   declare userleague_score     int;
   declare userleague_rank      int;
   declare userleague_league_id int;
   
   DECLARE done1               BOOLEAN DEFAULT false;
   DECLARE done2               BOOLEAN DEFAULT false;
   
   BLOCK1:
   BEGIN
      DECLARE cur_score CURSOR FOR
      SELECT score.fk_u_id, sum(score_value) FROM score where fk_m_id = inMatchId GROUP BY fk_u_id;
      
      DECLARE CONTINUE HANDLER FOR NOT FOUND SET done1 = TRUE;
      OPEN cur_score;
      cur_score_loop:
      LOOP
         FETCH cur_score
         INTO
            score_user_id
          , score_score_value
         ;
         if score_score_value is null THEN
		    set score_score_value = 0;
		 end if;
		 
         IF done1 THEN
            CLOSE cur_score;
            LEAVE cur_score_loop;
         END IF;
         
		 set done2 = false;
         BLOCK2:
         BEGIN
            DECLARE cur_userleague CURSOR FOR
            select score, fk_l_id from userleague where fk_u_id = score_user_id;
            
            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done2 = TRUE;
			
            OPEN cur_userleague;
            cur_userleague_loop:
            LOOP
               FETCH cur_userleague
               INTO
                  userleague_score
                , userleague_league_id
               ;
               
			   if userleague_score is null THEN
		         set userleague_score = 0;
		       end if;
			   
               IF done2 THEN
                  CLOSE cur_userleague;
                  LEAVE cur_userleague_loop;
               END IF;
               
               UPDATE
                  userleague
               SET score = userleague_score + score_score_value
               WHERE
                  fk_u_id = score_user_id AND
                  fk_l_id = userleague_league_id
               ;
               
               set userleague_score = null;
               set userleague_league_id = null;
         
         END LOOP cur_userleague_loop;
         END BLOCK2;
            
   END LOOP cur_score_loop;
   END BLOCK1;
   
   set done2 = false;
   BLOCK2:
   BEGIN
      DECLARE cur_userleague CURSOR FOR
      SELECT S2.fk_u_id, S2.score,  S2.fk_l_id,
      FIND_IN_SET(
      S2.score
      , (
      SELECT GROUP_CONCAT(score ORDER BY score DESC)
      FROM userleague S1
      WHERE S1.fk_l_id = S2.fk_l_id
      )
      ) AS RANK
      FROM userleague S2 ORDER BY fk_l_id, score DESC;
      
      DECLARE CONTINUE HANDLER FOR NOT FOUND SET done2 = TRUE;
      OPEN cur_userleague;
      cur_userleague_loop:
      LOOP
         FETCH cur_userleague
         INTO
            userleague_user_id
          , userleague_score
		  , userleague_league_id
		  , userleague_rank
         ;
         
         IF done2 THEN
            CLOSE cur_userleague;
            LEAVE cur_userleague_loop;
         END IF;
   	  
         UPDATE
            userleague
         SET ranked = userleague_rank
         WHERE
            fk_u_id = userleague_user_id AND
			fk_l_id = userleague_league_id and 
			score = userleague_score
         ;
   
   END LOOP cur_userleague_loop;
   END BLOCK2;
   
   
   END$$
DELIMITER ;
--------------------------------------------------------------------------------------------
    
   
   update userleague set score = 0;
   update userleague set ranked = 0;
   
   select * from userleague;
   
   update userleague set ranked = null;
   update userleague set score = null;
   
   CALL CalculateLeagueRank(4);  