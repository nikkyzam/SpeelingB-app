// Temporary visual-verification spec: visits the new and polished surfaces
// and screenshots each one. Run against the dev server on port 5199.
describe('UI verification of new features', () => {
  const pages = [
    ['home', '/'],
    ['learn-quest-map', '/learn'],
    ['collection-cards', '/collection'],
    ['silly-sentences', '/silly'],
    ['word-hunt', '/hunt'],
    ['showdown', '/showdown'],
  ]

  pages.forEach(([name, path]) => {
    it(`renders ${name}`, () => {
      cy.visit(path, {
        onBeforeLoad(win) {
          win.localStorage.setItem('worldChosen', 'true')
          win.localStorage.setItem('world', '"bee"')
          win.localStorage.setItem('audioEnabled', 'false')
        },
      })
      cy.wait(1800)
      cy.screenshot(name, { capture: 'viewport' })
    })
  })
})
