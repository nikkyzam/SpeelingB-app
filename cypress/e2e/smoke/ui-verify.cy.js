// Temporary visual-verification spec: seeds a child with learned words and a
// named buddy, then screenshots the new and polished surfaces.
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
    dailyGoal: 5,
    dailyGoalSpell: 5,
    dailyGoalVocab: 5,
    spellQuizUnlocked: true,
    vocabQuizUnlocked: false,
    gamesUnlocked: false,
    unlockedGames: [],
    lockedModes: [],
    currentStreak: 3,
    selectedGroup: 0,
    difficulty: 1,
    missedDays: [],
    lastGoalCheck: null,
    lastReviewDate: null,
    dailyQuizPassedDate: null,
  }))
  win.localStorage.setItem('buddy_state', JSON.stringify({
    name: 'Sprinkles',
    snacks: 3,
    happiness: 80,
    meals: 5,
    lastSeen: new Date().toISOString(),
    celebratedStage: 1,
    owned: ['cap'],
    equipped: { hat: 'cap' },
  }))
  win.localStorage.setItem('explorer_level_seen', '2')
  win.localStorage.setItem('streak_milestone_seen', '7')
  win.localStorage.setItem('word_correct_counts', JSON.stringify({
    'concise-all-bee-0': 3, 'concise-all-bee-1': 3, 'concise-all-bee-3': 1,
  }))
}

describe('UI verification of new features (seeded)', () => {
  const pages = [
    ['home', '/', 'viewport'],
    ['learn-quest-map', '/learn', 'viewport'],
    ['collection-cards', '/collection', 'viewport'],
    ['silly-sentences', '/silly', 'viewport'],
    ['word-hunt', '/hunt', 'viewport'],
    ['showdown', '/showdown', 'viewport'],
  ]

  pages.forEach(([name, path, capture]) => {
    it(`renders ${name}`, () => {
      cy.visit(path, { onBeforeLoad: seed })
      cy.wait(2000)
      if (name === 'learn-quest-map') {
        cy.get('.quest-map').scrollIntoView()
        cy.wait(800)
      }
      cy.get('body').then(($b) => {
        const modal = $b.find('.fx-rankup, [role=dialog]')
        if (modal.length) cy.wrap(modal.first()).click({ force: true })
      })
      cy.wait(600)
      cy.screenshot(name, { capture })
    })
  })
})
