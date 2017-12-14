let _ = require('lodash');


async function getLeaderboard() {
  let results = await db.sequelize.query(`
    SELECT Users.username, CombinedResults.user, SUM(amount) as amount
    FROM (SELECT WinnerResults.winner as user, SUM(WinnerResults.amount) as amount
          FROM  (SELECT 
                   (CASE WHEN makerWon = 1 THEN user ELSE callerUser END) winner,
                   amount
                   FROM Bets
                   WHERE executedAt IS NOT NULL) AS WinnerResults
          GROUP BY winner
          UNION ALL
          SELECT LoserResults.loser as user, -SUM(LoserResults.amount) as amount
          FROM  (SELECT 
                   (CASE WHEN makerWon = 0 THEN user ELSE callerUser END) loser,
                   amount
                   FROM Bets
                   WHERE executedAt IS NOT NULL) AS LoserResults
          GROUP BY loser) As CombinedResults 
    LEFT JOIN Users on Users.address = CombinedResults.user
    GROUP BY CombinedResults.user, Users.username
    ORDER BY amount DESC
    LIMIT 20;
  `, { type: db.sequelize.QueryTypes.SELECT});

  return results;
}


module.exports = {
  getLeaderboard,
};