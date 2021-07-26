 mysqldump -u root -pmpt@titans_2020 competition userleague > userleague_dump_20_09.sql
 
 INSERT predict SELECT * FROM predict_backup ;
 UPDATE match_det SET completed = NULL WHERE id = 1;
 UPDATE score SET score_value = NULL ;
 UPDATE userleague SET ranked = NULL , score = null ; -> load the above dump into db
 
 
 delete from predict where fk_m_id = 1;
 INSERT predict_backup SELECT * FROM  predict where fk_m_id = 1;