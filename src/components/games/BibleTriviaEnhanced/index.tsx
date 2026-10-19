import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import './BibleTriviaEnhanced.css'

interface BibleTriviaEnhancedProps {
  onComplete: (score: number) => void
  rounds?: number
}

export interface TriviaQuestion {
  question: string
  answer: string
  /** Two wrong answers. Kept gentle and clearly wrong to a child who knows the story. */
  wrong: [string, string]
  reference: string
  /** A short line about the story, shown and read out after the answer. */
  fact: string
}

/**
 * Well-known Bible stories, asked at a child's level. The facts paraphrase the
 * passage; check a new one against the reference before adding it.
 */
export const TRIVIA: TriviaQuestion[] = [
  {
    question: 'Who built a big boat called an ark?',
    answer: 'Noah',
    wrong: ['Moses', 'Peter'],
    reference: 'Genesis 6:14',
    fact: 'God told Noah to build an ark to keep his family and the animals safe from the flood.',
  },
  {
    question: 'What did God put in the clouds as a promise after the flood?',
    answer: 'A rainbow',
    wrong: ['A star', 'The moon'],
    reference: 'Genesis 9:13',
    fact: 'The rainbow is God’s promise that he will never flood the whole earth again.',
  },
  {
    question: 'What did young David use to defeat the giant Goliath?',
    answer: 'A sling and a stone',
    wrong: ['A big sword', 'A bow and arrow'],
    reference: '1 Samuel 17:49-50',
    fact: 'David trusted God, and one stone from his sling knocked Goliath down.',
  },
  {
    question: 'What swallowed Jonah when he was thrown into the sea?',
    answer: 'A great fish',
    wrong: ['A lion', 'A bear'],
    reference: 'Jonah 1:17',
    fact: 'God sent a great fish to swallow Jonah. After three days it spat him out onto dry land.',
  },
  {
    question: 'Where did baby Moses’ mother hide him?',
    answer: 'In a basket by the river',
    wrong: ['In a cave', 'Up a tree'],
    reference: 'Exodus 2:3',
    fact: 'She put him in a basket among the reeds by the Nile River, and a princess found him.',
  },
  {
    question: 'Jesus fed a huge crowd with five loaves and two fish. About how many men were there?',
    answer: 'About 5,000',
    wrong: ['About 50', 'About 500'],
    reference: 'Matthew 14:21',
    fact: 'About 5,000 men ate until they were full, and women and children too!',
  },
  {
    question: 'Who shut the lions’ mouths to keep Daniel safe?',
    answer: 'An angel God sent',
    wrong: ['The king', 'Daniel’s friends'],
    reference: 'Daniel 6:22',
    fact: 'Daniel said, “My God sent his angel to shut the lions’ mouths.”',
  },
  {
    question: 'What did God make on the very first day?',
    answer: 'Light',
    wrong: ['Animals', 'People'],
    reference: 'Genesis 1:3',
    fact: 'God said, “Let there be light,” and there was light.',
  },
  {
    question: 'Where was baby Jesus laid when he was born?',
    answer: 'In a manger',
    wrong: ['In a boat', 'In a palace'],
    reference: 'Luke 2:7',
    fact: 'Mary laid baby Jesus in a manger, because there was no room for them to stay.',
  },
  {
    question: 'In Jesus’ story, who stopped to help the hurt man by the road?',
    answer: 'A Samaritan',
    wrong: ['A priest', 'A soldier'],
    reference: 'Luke 10:33-34',
    fact: 'A priest walked past, but the Samaritan stopped, bandaged the man and cared for him.',
  },
  {
    question: 'Why did Zacchaeus climb a tree?',
    answer: 'To see Jesus',
    wrong: ['To pick fruit', 'To hide from a lion'],
    reference: 'Luke 19:3-4',
    fact: 'Zacchaeus was too short to see over the crowd, so he climbed a tree to see Jesus.',
  },
  {
    question: 'On which day did God rest after making the world?',
    answer: 'The seventh day',
    wrong: ['The first day', 'The third day'],
    reference: 'Genesis 2:2',
    fact: 'God finished his work and rested on the seventh day.',
  },
  {
    question: 'Who were the first man and woman God made?',
    answer: 'Adam and Eve',
    wrong: ['Mary and Joseph', 'Ruth and Boaz'],
    reference: 'Genesis 2:7, 3:20',
    fact: 'God made Adam from the dust of the ground, and then he made Eve.',
  },
  {
    question: 'What did Jesus walk on to reach his friends in their boat?',
    answer: 'Water',
    wrong: ['Clouds', 'A bridge'],
    reference: 'Matthew 14:25-27',
    fact: 'Jesus walked on the water in a storm and told his friends, “Don’t be afraid.”',
  },
  {
    question: 'How many disciples did Jesus choose?',
    answer: 'Twelve',
    wrong: ['Three', 'Forty'],
    reference: 'Luke 6:13',
    fact: 'Jesus chose twelve disciples to follow him and learn from him.',
  },
  {
    question: 'Who did God send to lead his people out of Egypt?',
    answer: 'Moses',
    wrong: ['Jonah', 'David'],
    reference: 'Exodus 3:10',
    fact: 'God sent Moses to lead his people out of Egypt to freedom.',
  },
  {
    question: 'What did the wise men follow to find baby Jesus?',
    answer: 'A star',
    wrong: ['A river', 'A rainbow'],
    reference: 'Matthew 2:9',
    fact: 'The star went ahead of the wise men and stopped over the place where Jesus was.',
  },
  {
    question: 'What happened to the walls of Jericho when God’s people shouted?',
    answer: 'They fell down',
    wrong: ['They grew taller', 'They turned to gold'],
    reference: 'Joshua 6:20',
    fact: 'The people marched, the rams’ horns blew, everyone shouted, and the walls fell down.',
  },
  {
    question: 'Jesus said the greatest commandment is to love who with all your heart?',
    answer: 'God',
    wrong: ['Money', 'Yourself first'],
    reference: 'Matthew 22:37-38',
    fact: 'Jesus said, “You must love the Lord your God with all your heart.”',
  },
]

interface Round extends TriviaQuestion {
  options: string[]
}

/** A game's questions: a shuffled handful, each with its answers shuffled. */
export const dealTrivia = (rounds: number, bank: TriviaQuestion[] = TRIVIA): Round[] =>
  shuffle(bank)
    .slice(0, rounds)
    .map((q) => ({ ...q, options: shuffle([q.answer, ...q.wrong]) }))

/**
 * Bible Trivia — a few questions about well-loved Bible stories.
 *
 * Seven questions from a bank of nineteen, in a new order with the answers
 * moved around every game, so it can't be learned by position. Each question
 * and its answers are read aloud. There is no clock and nothing to lose: a
 * miss says the answer and the next question comes along.
 */
const BibleTriviaEnhanced: React.FC<BibleTriviaEnhancedProps> = ({ onComplete, rounds = 7 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const questions = useMemo(() => dealTrivia(rounds), [rounds])

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [right, setRight] = useState(0)
  const [streak, setStreak] = useState(0)
  const [line, setLine] = useState('')
  const [hits, setHits] = useState(0)
  // One answer per question, however fast the taps come.
  const locked = useRef(false)

  const current = questions[index]

  const readAloud = (q: Round) => {
    speak(q.question)
    const [a, b, c] = q.options
    speak(`${a}? ${b}? Or ${c}?`, { queue: true })
  }

  useEffect(() => {
    if (!current) return
    setPicked(null)
    locked.current = false
    readAloud(current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, questions])

  if (!current) return null

  const choose = (option: string) => {
    if (locked.current) return
    locked.current = true
    setPicked(option)

    let gained = 0
    if (option === current.answer) {
      setLine(cheer.hit({ say: current.fact }))
      const run = cheer.streak()
      gained = 40 + (run >= 3 ? 10 : 0)
      setScore((s) => s + gained)
      setRight((n) => n + 1)
      setStreak(run)
      setHits((h) => h + 1)
    } else {
      setLine(cheer.miss({ say: `It was ${current.answer}. ${current.fact}` }))
      setStreak(0)
    }

    later(() => {
      if (index < questions.length - 1) {
        // Cleared with the move, so the next question never shows a ⭐ on its
        // answer from the last pick, even for a frame.
        setPicked(null)
        setIndex((i) => i + 1)
      } else onComplete(score + gained)
    }, option === current.answer ? 3600 : 4200)
  }

  const answered = picked !== null
  const gotIt = picked === current.answer

  return (
    <div className="bible-trivia-enhanced">
      <div className="btq-header">
        <div className="btq-title">📖 Bible Trivia</div>
        <div className="btq-stats">
          <div className="btq-stat"><span>Question</span><strong>{index + 1}/{questions.length}</strong></div>
          <div className="btq-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="btq-stat"><span>Right</span><strong>⭐ {right}</strong></div>
        </div>
      </div>

      <div className="btq-progress" aria-hidden>
        {questions.map((_, k) => (
          <span key={k} className={`btq-dot ${k < index ? 'done' : ''} ${k === index ? 'here' : ''}`} />
        ))}
      </div>

      <div className="btq-card">
        <Burst trigger={hits} />
        <p className="btq-question">{current.question}</p>
        <button className="btq-btn ghost" onClick={() => readAloud(current)} aria-label="Read the question again">
          🔊 Read it again
        </button>
      </div>

      <div className="btq-options" role="group" aria-label="Answers">
        {current.options.map((option, k) => {
          const isAnswer = option === current.answer
          const state = !answered ? '' : isAnswer ? 'ok' : option === picked ? 'picked' : 'faded'
          return (
            <button
              key={option}
              className={`btq-option ${state}`}
              onClick={() => choose(option)}
              disabled={answered}
              aria-label={option}
            >
              <span className="btq-letter" aria-hidden>{String.fromCharCode(65 + k)}</span>
              <span className="btq-text">{option}</span>
              {answered && isAnswer && <span className="btq-mark" aria-hidden>⭐</span>}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`btq-flash ${gotIt ? 'ok' : 'soft'}`} role="status">
          <p className="btq-line">
            {gotIt ? `🎉 ${line}` : `${line} It was “${current.answer}”.`}
          </p>
          <p className="btq-fact">
            💡 {current.fact} <span className="btq-ref">📜 {current.reference}</span>
          </p>
        </div>
      )}
      {!answered && streak >= 2 && <div className="btq-streak">🔥 {streak} in a row!</div>}
    </div>
  )
}

export default BibleTriviaEnhanced
