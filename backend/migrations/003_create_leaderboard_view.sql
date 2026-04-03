CREATE OR REPLACE VIEW leaderboard AS
SELECT
  u.id,
  u.name,
  u.avatar,
  COUNT(gr.id)                          AS played,
  SUM(CASE WHEN gr.win THEN 1 ELSE 0 END) AS wins,
  ROUND(
    SUM(CASE WHEN gr.win THEN 1 ELSE 0 END)::NUMERIC
    / NULLIF(COUNT(gr.id), 0) * 100
  )                                     AS win_rate,
  (
    SELECT COALESCE(MAX(streak), 0)
    FROM (
      SELECT
        SUM(CASE WHEN win THEN 1 ELSE 0 END)
          OVER (
            PARTITION BY user_id
            ORDER BY day_index
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
          ) -
        SUM(CASE WHEN NOT win THEN 1 ELSE 0 END)
          OVER (
            PARTITION BY user_id
            ORDER BY day_index
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
          ) AS streak
      FROM game_results
      WHERE user_id = u.id AND win = TRUE
    ) s
  )                                     AS max_streak
FROM users u
LEFT JOIN game_results gr ON gr.user_id = u.id
GROUP BY u.id, u.name, u.avatar
HAVING COUNT(gr.id) > 0
ORDER BY wins DESC, win_rate DESC;