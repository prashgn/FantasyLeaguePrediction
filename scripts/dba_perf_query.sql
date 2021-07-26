/* Averge Microsec - each statments */
SELECT schema_name
     , SUM(count_star) count
     , ROUND(   (SUM(sum_timer_wait) / SUM(count_star))
              / 1000000) AS avg_microsec
  FROM performance_schema.events_statements_summary_by_digest
 WHERE schema_name IS NOT NULL
 GROUP BY schema_name;
 
 /* To display the error encountered */
 SELECT schema_name
     , SUM(sum_errors) err_count
  FROM performance_schema.events_statements_summary_by_digest
 WHERE schema_name IS NOT NULL
 GROUP BY schema_name;
 
 SELECT * FROM sys.statements_with_errors_or_warnings
       ORDER BY errors DESC
       LIMIT 10;
	   
 SELECT * FROM sys.statements_with_errors_or_warnings
       ORDER BY first_seen
       LIMIT 10;
	   
 SELECT * FROM sys.statements_with_errors_or_warnings
       ORDER BY last_seen desc
       LIMIT 10;
 -----------------
 
 SHOW GLOBAL STATUS;
 
 SHOW GLOBAL STATUS LIKE 'aborted_connects';
 
 SHOW PROCESSLIST;
 
 SHOW GLOBAL STATUS LIKE 'Questions';
 /*  latter also counts statements executed as part of stored programs */
 SHOW GLOBAL STATUS LIKE "Queries";
 
 SHOW GLOBAL STATUS LIKE "Threads_running";
 
 SHOW GLOBAL STATUS LIKE "Slow_queries";
 SHOW VARIABLES LIKE 'long_query_time';
 
 SHOW VARIABLES LIKE 'max_connections';
 SET GLOBAL max_connections = 200;
 
 <<<< To cheeck the insert update and delete >>>>>
 SHOW GLOBAL STATUS LIKE "Com_insert";
 SHOW GLOBAL STATUS LIKE "Com_update"; 
 SHOW GLOBAL STATUS LIKE "Com_delete";  
 SHOW GLOBAL STATUS LIKE "Com_select"; 
 
 Com_insert + Com_update + Com_delete
 
  -------------------------
 
 /* query finds the top 10 statements by longest average run time in pico seconds */
 SELECT substr(digest_text, 1, 50) AS digest_text_start
     , count_star
     , avg_timer_wait 
  FROM performance_schema.events_statements_summary_by_digest 
 ORDER BY avg_timer_wait DESC
LIMIT 10;

/* IN secs */
SELECT substr(digest_text, 1, 50) AS digest_text_start
     , count_star
     , TRUNCATE(avg_timer_wait/1000000000000,6) 
  FROM performance_schema.events_statements_summary_by_digest 
 ORDER BY avg_timer_wait DESC
LIMIT 10;

--------------------------------

SELECT * FROM sys.statements_with_runtimes_in_95th_percentile;

----------------------

explain

---------

SHOW GLOBAL VARIABLES LIKE "innodb_buffer_pool_chunk_size";
SHOW GLOBAL VARIABLES LIKE "innodb_buffer_pool_instances";

SHOW VARIABLES LIKE "innodb_page_size";

SET GLOBAL innodb_buffer_pool_size=8589934592;

----------------------------------------

SELECT SUBSTRING_INDEX(host, ':', 1) AS host_short,
       GROUP_CONCAT(DISTINCT user) AS users,
       COUNT(*) AS threads
FROM information_schema.processlist
GROUP BY host_short
ORDER BY COUNT(*), host_short;