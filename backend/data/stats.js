let stats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  },
  lastPlayed: null,
};

function updateStats({ win, guesses }) {
  stats.played += 1;
  stats.lastPlayed = new Date().toISOString().slice(0, 10);

  if (win) {
    stats.wins += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.guessDistribution[guesses] += 1;
  } else {
    stats.currentStreak = 0;
  }

  return stats;
}

function getStats() {
  return stats;
}

function resetStats() {
  stats = {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    },
    lastPlayed: null,
  };
}

module.exports = { updateStats, getStats, resetStats }
