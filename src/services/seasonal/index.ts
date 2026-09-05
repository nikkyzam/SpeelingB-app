/**
 * Seasonal events — limited-time word lists and dressing that give the app a
 * "something special is happening THIS week" feeling.
 *
 * Each event has a date window (month/day based, so it returns every year), a
 * curated word list with meanings and sentences, and decorative sprinkles.
 * Words use stable `seasonal-*` ids so mastery, review and collection all work
 * on them exactly like bank words.
 */

import type { Word } from '../wordBank'

export interface SeasonalEvent {
  id: string
  name: string
  icon: string
  tagline: string
  /** decorative emoji scattered while the event runs */
  sprinkles: string[]
  /** [startMonth, startDay, endMonth, endDay] inclusive, 1-based months */
  window: [number, number, number, number]
  words: Word[]
}

const w = (
  eventId: string,
  n: number,
  word: string,
  meaning: string,
  sentence: string,
  difficulty: 1 | 2 | 3 = 1,
): Word => ({
  id: `seasonal-${eventId}-${n}`,
  word,
  meaning,
  sentence,
  difficulty,
  category: 'seasonal',
  hint: meaning.split('.')[0],
})

const EVENTS: SeasonalEvent[] = [
  {
    id: 'halloween',
    name: 'Spooky Word Week',
    icon: '🎃',
    tagline: 'Friendly frights and pumpkin delights!',
    sprinkles: ['🎃', '👻', '🦇', '🕷️'],
    window: [10, 20, 10, 31],
    words: [
      w('halloween', 1, 'pumpkin', 'A big round orange vegetable.', 'The pumpkin sat on the porch.', 1),
      w('halloween', 2, 'ghost', 'A friendly spirit that goes boo.', 'The ghost said boo and giggled.', 1),
      w('halloween', 3, 'candy', 'A sweet treat.', 'We got candy on Halloween night.', 1),
      w('halloween', 4, 'witch', 'A story character with a pointy hat.', 'The witch stirred her soup.', 2),
      w('halloween', 5, 'spider', 'A little creature with eight legs.', 'The spider spun a shiny web.', 1),
      w('halloween', 6, 'lantern', 'A lamp you can carry.', 'We lit the lantern at dusk.', 2),
      w('halloween', 7, 'costume', 'Clothes you wear to look like someone else.', 'Her costume was a bumblebee.', 2),
      w('halloween', 8, 'midnight', 'Twelve o\u2019clock at night.', 'The clock struck midnight.', 3),
      w('halloween', 9, 'cauldron', 'A big pot for bubbling stews.', 'The cauldron bubbled and fizzed.', 3),
      w('halloween', 10, 'skeleton', 'The bones inside your body.', 'The skeleton danced in the silly song.', 3),
    ],
  },
  {
    id: 'christmas',
    name: 'Jolly Word Days',
    icon: '🎄',
    tagline: 'Merry words for the merriest season!',
    sprinkles: ['🎄', '⛄', '🎁', '❄️'],
    window: [12, 1, 12, 26],
    words: [
      w('christmas', 1, 'snow', 'Soft white flakes that fall from the sky.', 'Snow covered the quiet street.', 1),
      w('christmas', 2, 'angel', 'A heavenly messenger.', 'The angel sat on top of the tree.', 1),
      w('christmas', 3, 'star', 'A bright light in the night sky.', 'A star shone over the stable.', 1),
      w('christmas', 4, 'shepherd', 'Someone who looks after sheep.', 'The shepherd hurried to Bethlehem.', 2),
      w('christmas', 5, 'manger', 'A box that holds food for animals.', 'The baby lay in a manger.', 2),
      w('christmas', 6, 'carol', 'A happy song sung at Christmas.', 'We sang a carol by the tree.', 2),
      w('christmas', 7, 'candle', 'A stick of wax with a little flame.', 'The candle glowed in the window.', 1),
      w('christmas', 8, 'reindeer', 'A deer that pulls Santa\u2019s sleigh.', 'The reindeer pawed the snow.', 2),
      w('christmas', 9, 'Bethlehem', 'The little town where Jesus was born.', 'They travelled to Bethlehem.', 3),
      w('christmas', 10, 'frankincense', 'A sweet-smelling gift from long ago.', 'The wise men brought frankincense.', 3),
    ],
  },
  {
    id: 'easter',
    name: 'Spring Word Hunt',
    icon: '🐣',
    tagline: 'New life, new words, new adventures!',
    sprinkles: ['🐣', '🌷', '🐰', '🥚'],
    window: [3, 25, 4, 20],
    words: [
      w('easter', 1, 'spring', 'The season when flowers bloom.', 'Spring makes the garden wake up.', 1),
      w('easter', 2, 'lamb', 'A baby sheep.', 'The lamb bounced in the field.', 1),
      w('easter', 3, 'tulip', 'A bright cup-shaped flower.', 'The tulip opened in the sun.', 2),
      w('easter', 4, 'basket', 'A container woven from reeds.', 'The basket was full of eggs.', 1),
      w('easter', 5, 'garden', 'A place where flowers and vegetables grow.', 'The garden was quiet that morning.', 1),
      w('easter', 6, 'sunrise', 'When the sun comes up in the morning.', 'We watched the sunrise together.', 2),
      w('easter', 7, 'butterfly', 'An insect with colourful wings.', 'The butterfly landed on a flower.', 2),
      w('easter', 8, 'celebrate', 'To do something special for a happy day.', 'We celebrate with songs and cake.', 3),
    ],
  },
  {
    id: 'summer',
    name: 'Sunny Word Splash',
    icon: '🏖️',
    tagline: 'Hot days, cool words!',
    sprinkles: ['☀️', '🍉', '🌊', '🍦'],
    window: [7, 1, 8, 15],
    words: [
      w('summer', 1, 'beach', 'Sandy land beside the sea.', 'We built a castle on the beach.', 1),
      w('summer', 2, 'melon', 'A big juicy fruit.', 'The melon was cold and sweet.', 1),
      w('summer', 3, 'swim', 'To move through water.', 'We swim in the cool pool.', 1),
      w('summer', 4, 'picnic', 'A meal eaten outside.', 'Our picnic had sandwiches and juice.', 2),
      w('summer', 5, 'icecream', 'A frozen sweet treat.', 'The icecream melted in the sun.', 2),
      w('summer', 6, 'seashell', 'The pretty shell of a sea creature.', 'She found a seashell by the waves.', 2),
      w('summer', 7, 'thunder', 'The loud rumble after lightning.', 'Thunder rumbled over the hills.', 3),
      w('summer', 8, 'firefly', 'A bug that glows at night.', 'A firefly blinked in the dark.', 3),
    ],
  },
]

const inWindow = (ev: SeasonalEvent, now: Date): boolean => {
  const [sm, sd, em, ed] = ev.window
  const start = new Date(now.getFullYear(), sm - 1, sd)
  const end = new Date(now.getFullYear(), em - 1, ed, 23, 59, 59)
  return now >= start && now <= end
}

export const getSeasonalEvent = (now: Date = new Date()): SeasonalEvent | null =>
  EVENTS.find((ev) => inWindow(ev, now)) || null

export const getSeasonalEventById = (id: string): SeasonalEvent | null =>
  EVENTS.find((ev) => ev.id === id) || null

/** Every seasonal word from every event, in one list. */
export const getAllSeasonalWords = (): Word[] => EVENTS.flatMap((ev) => ev.words)

export default { getSeasonalEvent, getSeasonalEventById }
