module.exports = function checkGuess(guess, answer) {
  guess = guess.toLowerCase()
  answer = answer.toLowerCase()

  const result = Array(5)
  const answerLetters = answer.split('')
  const used = Array(5).fill(false)

  // 1. Correct
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = { letter: guess[i], status: 'correct' }
      used[i] = true
    }
  }

  // 2. Present / Absent
  for (let i = 0; i < 5; i++) {
    if (result[i]) continue

    const index = answerLetters.findIndex(
      (char, idx) => char === guess[i] && !used[idx]
    )

    if (index !== -1) {
      result[i] = { letter: guess[i], status: 'present' }
      used[index] = true
    } else {
      result[i] = { letter: guess[i], status: 'absent' }
    }
  }

  return result
}
