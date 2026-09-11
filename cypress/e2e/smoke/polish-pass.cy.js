// Temporary visual pass for kid-polish round: screenshot every main page.
const learned = Array.from({ length: 12 }, (_, i) => `concise-all-bee-${i}`)
const seed = (win) => {
  win.localStorage.setItem('worldChosen', 'true')
  win.localStorage.setItem('world', '"bee"')
  win.localStorage.setItem('audioEnabled', 'false')
  win.localStorage.setItem('learningProgress', JSON.stringify({
    wordsLearnedToday: learned.slice(0, 3),
    wordsLearnedTotal: learned,
    wordsPracticedToday: [],
    wordsSpelledToday: [],
    wordsSpelledTotal: learned.slice(0, 8),
    dailyGoal: 5, dailyGoalSpell: 5, dailyGoalVocab: 5,
    spellQuizUnlocked: true, vocabQuizUnlocked: false,
    gamesUnlocked: true, unlockedGames: [], lockedModes: [],
    currentStreak: 3, selectedGroup: 0, difficulty: 1,
    missedDays: [], lastGoalCheck: null, lastReviewDate: null, dailyQuizPassedDate: null,
  }))
  win.localStorage.setItem('buddy_state', JSON.stringify({
    name: 'Sprinkles', snacks: 3, happiness: 80, meals: 5,
    lastSeen: new Date().toISOString(), celebratedStage: 1,
    owned: ['cap'], equipped: { hat: 'cap' },
  }))
  win.localStorage.setItem('explorer_level_seen', '2')
  win.localStorage.setItem('streak_milestone_seen', '7')
  win.localStorage.setItem('word_correct_counts', JSON.stringify({
    'concise-all-bee-0': 3, 'concise-all-bee-1': 3, 'concise-all-bee-3': 1,
  }))
}
describe('polish pass screenshots', () => {
  const pages = [
    ['home', '/'],
    ['games', '/games'],
    ['learn', '/learn'],
    ['collection', '/collection'],
    ['tournament', '/tournament'],
    ['trophies', '/trophies'],
    ['rewards', '/rewards'],
    ['bible', '/bible'],
    ['sentences', '/sentences'],
    ['hunt', '/hunt'],
  ]
  pages.forEach(([name, path]) => {
    it(`shoots ${name}`, () => {
      cy.visit(path, { onBeforeLoad: seed })
      cy.wait(1800)
      cy.get('body').then(($b) => {
        const modal = $b.find('.fx-rankup, [role=dialog]')
        if (modal.length) cy.wrap(modal.first()).click({ force: true })
      })
      cy.wait(500)
      cy.screenshot(`polish-${name}`, { capture: 'viewport' })
    })
  })
})
