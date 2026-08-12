// Christian and moral-themed books for children
export interface ChristianBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  ageRange: {
    min: number;
    max: number;
  };
  grades: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  bibleVerses?: string[];
  moralThemes: string[];
  pages: BookPage[];
  audioAvailable: boolean;
  hasActivities: boolean;
  externalUrl?: string;
}

export interface BookPage {
  pageNumber: number;
  content: string;
  image?: string;
  audioUrl?: string;
  vocabulary?: string[];
  discussionQuestions?: string[];
}

export const christianBooks: ChristianBook[] = [
  {
    id: 'cbook-001',
    title: 'The Beginner\'s Bible',
    author: 'Various',
    coverImage: '/images/books/christian/beginners-bible.jpg',
    ageRange: { min: 2, max: 5 },
    grades: ['Pre-K', 'K'],
    difficulty: 'beginner',
    categories: ['bible', 'christian', 'stories'],
    bibleVerses: ['John 3:16', 'Psalm 23:1'],
    moralThemes: ['love', 'faith', 'kindness'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "In the beginning, God created the heavens and the earth.",
        image: '/images/books/christian/creation.jpg',
        vocabulary: ['beginning', 'created', 'heavens', 'earth'],
        discussionQuestions: ['Who created everything?', 'What are you thankful that God created?']
      },
      {
        pageNumber: 2,
        content: "God saw all that he had made, and it was very good.",
        image: '/images/books/christian/creation-good.jpg',
        vocabulary: ['saw', 'made', 'good'],
        discussionQuestions: ['What did God think about His creation?']
      },
      {
        pageNumber: 3,
        content: "God made the sun to shine by day and the moon and stars to shine by night.",
        vocabulary: ['sun', 'moon', 'stars'],
        discussionQuestions: ['Which do you like better, the day or the night?', 'Can you count the stars?']
      },
      {
        pageNumber: 4,
        content: "He made the birds to fly in the sky and the fish to swim in the sea. He made all the animals too!",
        vocabulary: ['birds', 'fish', 'sea', 'animals'],
        discussionQuestions: ['What is your favorite animal?', 'How many colors of birds can you think of?']
      }
    ]
  },
  {
    id: 'cbook-002',
    title: 'Noah\'s Ark Adventure',
    author: 'Bible Stories for Kids',
    coverImage: '/images/books/christian/noahs-ark.jpg',
    ageRange: { min: 4, max: 8 },
    grades: ['K', '1', '2'],
    difficulty: 'intermediate',
    categories: ['bible', 'animals', 'adventure'],
    bibleVerses: ['Genesis 6:19-20'],
    moralThemes: ['obedience', 'faith', 'protection'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "Noah was a righteous man who walked with God. God told Noah to build a big ark.",
        image: '/images/books/christian/noah-builds.jpg',
        vocabulary: ['righteous', 'ark', 'build'],
        discussionQuestions: ['Why was Noah special?', 'What is an ark?']
      },
      {
        pageNumber: 2,
        content: "Noah and his family worked hard to build the ark. They gathered two of every kind of animal, just as God commanded.",
        vocabulary: ['family', 'animals', 'hard work'],
        discussionQuestions: ['How many of each animal did Noah bring?', 'What kind of animals would you want on your ark?']
      },
      {
        pageNumber: 3,
        content: "The rains came and the water rose, but Noah and his family were safe inside the ark. God protected them during the great flood.",
        vocabulary: ['protected', 'flood', 'safe'],
        discussionQuestions: ['How did God keep Noah safe?', 'Do you feel safe when it rains?']
      },
      {
        pageNumber: 4,
        content: "After the rain stopped, God sent a rainbow as a promise never to flood the earth again. Noah gave thanks to God.",
        vocabulary: ['rainbow', 'promise', 'thanks'],
        discussionQuestions: ['What does the rainbow remind us of?', 'What can we thank God for today?']
      }
    ]
  },
  {
    id: 'cbook-003',
    title: 'David and Goliath',
    author: 'Bible Heroes',
    coverImage: '/images/books/christian/david-goliath.jpg',
    ageRange: { min: 5, max: 9 },
    grades: ['1', '2', '3'],
    difficulty: 'intermediate',
    categories: ['bible', 'heroes', 'courage'],
    bibleVerses: ['1 Samuel 17:45-47'],
    moralThemes: ['courage', 'faith', 'trust'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "Young David was a shepherd boy who loved God. He heard the giant Goliath mocking God's people.",
        image: '/images/books/christian/david-faces-goliath.jpg',
        vocabulary: ['mocking', 'shepherd', 'loved'],
        discussionQuestions: ['Who was David?', 'Who was Goliath?']
      },
      {
        pageNumber: 2,
        content: "David was not afraid. He knew that God was with him. He picked up five smooth stones for his sling.",
        vocabulary: ['afraid', 'smooth', 'stones'],
        discussionQuestions: ['Why was David not afraid?', 'How many stones did David pick up?']
      },
      {
        pageNumber: 3,
        content: "David faced the giant Goliath with just a sling and his faith. He told Goliath, 'I come against you in the name of the Lord.'",
        vocabulary: ['giant', 'sling', 'against'],
        discussionQuestions: ['What did David say to Goliath?', 'In whose name did David come?']
      },
      {
        pageNumber: 4,
        content: "With one stone, David defeated the giant. God gave David the victory and saved his people.",
        vocabulary: ['victory', 'defeated', 'saved'],
        discussionQuestions: ['How did David defeat Goliath?', 'What does this teach us about courage?']
      }
    ]
  },
  {
    id: 'cbook-004',
    title: 'The Parable of the Good Samaritan',
    author: 'Jesus\' Stories',
    coverImage: '/images/books/christian/good-samaritan.jpg',
    ageRange: { min: 6, max: 10 },
    grades: ['1', '2', '3', '4'],
    difficulty: 'intermediate',
    categories: ['parable', 'kindness', 'compassion'],
    bibleVerses: ['Luke 10:33-34'],
    moralThemes: ['kindness', 'compassion', 'helping others'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "A man was traveling when robbers attacked him and left him hurt by the road.",
        image: '/images/books/christian/hurt-traveler.jpg',
        vocabulary: ['traveling', 'robbers', 'attacked', 'hurt'],
        discussionQuestions: ['What happened to the man on the road?']
      },
      {
        pageNumber: 2,
        content: "Some people passed by and didn't help. But then a Samaritan man came along and saw the hurt man.",
        vocabulary: ['passed', 'along', 'Samaritan'],
        discussionQuestions: ['Why did some people not help?', 'Who finally stopped?']
      },
      {
        pageNumber: 3,
        content: "The Samaritan felt compassion. He cleaned the man's wounds and took him to an inn to recover.",
        vocabulary: ['compassion', 'wounds', 'inn'],
        discussionQuestions: ['How did the Samaritan show kindness?', 'What does compassion mean?']
      },
      {
        pageNumber: 4,
        content: "Jesus tells us to go and do likewise. We should show love and kindness to everyone we meet.",
        vocabulary: ['likewise', 'everyone', 'meet'],
        discussionQuestions: ['What would you do if you saw someone who needed help?', 'Who is our neighbor?']
      }
    ]
  },
  {
    id: 'cbook-005',
    title: 'God Made Me Special',
    author: 'Christian Learning Series',
    coverImage: '/images/books/christian/god-made-me.jpg',
    ageRange: { min: 3, max: 6 },
    grades: ['Pre-K', 'K'],
    difficulty: 'beginner',
    categories: ['self-esteem', 'creation', 'identity'],
    bibleVerses: ['Psalm 139:14'],
    moralThemes: ['self-worth', 'uniqueness', 'love'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "God made me special, unique and loved. He knows every hair on my head.",
        image: '/images/books/christian/special-child.jpg',
        vocabulary: ['special', 'unique', 'loved', 'God'],
        discussionQuestions: ['What makes you special?', 'How does God show His love for you?']
      },
      {
        pageNumber: 2,
        content: "I have my own smile, my own voice, and my own talents. God has a wonderful plan for my life.",
        vocabulary: ['smile', 'voice', 'talents'],
        discussionQuestions: ['What is one thing you are good at?', 'What is your favorite way to smile?']
      }
    ]
  },
  {
    id: 'cbook-006',
    title: 'Fruit of the Spirit',
    author: 'Christian Character Series',
    coverImage: '/images/books/christian/fruit-spirit.jpg',
    ageRange: { min: 7, max: 12 },
    grades: ['2', '3', '4', '5'],
    difficulty: 'advanced',
    categories: ['character', 'virtues', 'christian-living'],
    bibleVerses: ['Galatians 5:22-23'],
    moralThemes: ['love', 'joy', 'peace', 'patience', 'kindness', 'goodness', 'faithfulness', 'gentleness', 'self-control'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "The fruit of the Spirit is love, joy, and peace. These gifts from God grow in our hearts.",
        image: '/images/books/christian/fruits.jpg',
        vocabulary: ['spirit', 'fruit', 'joy', 'peace'],
        discussionQuestions: ['What does joy feel like?', 'How can we have peace in our hearts?']
      },
      {
        pageNumber: 2,
        content: "We also show patience, kindness, and goodness to others. It means waiting our turn and helping friends.",
        vocabulary: ['patience', 'kindness', 'goodness'],
        discussionQuestions: ['When is it hard to be patient?', 'How can you show kindness today?']
      },
      {
        pageNumber: 3,
        content: "God helps us be faithful, gentle, and have self-control. We can choose to do what is right.",
        vocabulary: ['faithful', 'gentle', 'self-control'],
        discussionQuestions: ['What is self-control?', 'How can we be gentle with our words?']
      }
    ]
  },
  {
    id: 'cbook-007',
    title: 'The Christmas Story',
    author: 'Holiday Bible Stories',
    coverImage: '/images/books/christian/christmas-story.jpg',
    ageRange: { min: 4, max: 9 },
    grades: ['K', '1', '2', '3'],
    difficulty: 'intermediate',
    categories: ['christmas', 'jesus', 'holiday'],
    bibleVerses: ['Luke 2:10-11'],
    moralThemes: ['giving', 'love', 'joy', 'hope'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "In Bethlehem, a special baby was born in a stable. His name was Jesus, the Savior of the world.",
        image: '/images/books/christian/baby-jesus.jpg',
        vocabulary: ['Bethlehem', 'stable', 'Savior', 'Jesus'],
        discussionQuestions: ['Why is Christmas important?', 'How can we share the Christmas spirit?']
      },
      {
        pageNumber: 2,
        content: "The shepherds saw a bright star and heard angels singing. They went to visit the new baby king.",
        vocabulary: ['shepherds', 'star', 'angels'],
        discussionQuestions: ['What did the shepherds hear?', 'Would you follow a bright star?']
      }
    ]
  },
  {
    id: 'cbook-008',
    title: 'Prayer Time with Jesus',
    author: 'Christian Devotionals for Kids',
    coverImage: '/images/books/christian/prayer-time.jpg',
    ageRange: { min: 5, max: 10 },
    grades: ['K', '1', '2', '3', '4'],
    difficulty: 'intermediate',
    categories: ['prayer', 'devotional', 'christian-life'],
    bibleVerses: ['Matthew 6:9-13', 'Philippians 4:6-7'],
    moralThemes: ['prayer', 'thankfulness', 'trust', 'peace'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "Jesus taught us how to pray. We can talk to God anytime, anywhere, about anything.",
        image: '/images/books/christian/jesus-praying.jpg',
        vocabulary: ['pray', 'God', 'talk', 'thank'],
        discussionQuestions: ['What can you pray about today?', 'When do you like to pray?']
      },
      {
        pageNumber: 2,
        content: "We can thank God for our family, our food, and our friends. We can also ask Him for help when we are sad.",
        vocabulary: ['thank', 'help', 'family'],
        discussionQuestions: ['What are you thankful for?', 'Who can you pray for today?']
      }
    ]
  }
];

// Reading levels with Christian focus
export interface ReadingLevel {
  id: string;
  age: number;
  grade: string;
  description: string;
  bibleVerse?: string;
  characterTrait?: string;
  recommendedBooks: string[];
}

export const christianReadingLevels: ReadingLevel[] = [
  {
    id: 'level-1',
    age: 3,
    grade: 'Pre-K',
    description: 'Simple Bible stories with pictures',
    bibleVerse: 'God is love. - 1 John 4:8',
    characterTrait: 'Love',
    recommendedBooks: ['cbook-001', 'cbook-005']
  },
  {
    id: 'level-2',
    age: 4,
    grade: 'Pre-K',
    description: 'Basic Bible stories and Christian values',
    bibleVerse: 'Be kind to one another. - Ephesians 4:32',
    characterTrait: 'Kindness',
    recommendedBooks: ['cbook-002', 'cbook-005']
  },
  {
    id: 'level-3',
    age: 5,
    grade: 'K',
    description: 'Bible stories with moral lessons',
    bibleVerse: 'I can do all things through Christ. - Philippians 4:13',
    characterTrait: 'Strength',
    recommendedBooks: ['cbook-001', 'cbook-002', 'cbook-003']
  },
  {
    id: 'level-4',
    age: 6,
    grade: '1',
    description: 'Bible stories and Christian character building',
    bibleVerse: 'The Lord is my shepherd. - Psalm 23:1',
    characterTrait: 'Trust',
    recommendedBooks: ['cbook-003', 'cbook-004', 'cbook-007']
  },
  {
    id: 'level-5',
    age: 7,
    grade: '2',
    description: 'Parables and Christian living',
    bibleVerse: 'Love your neighbor as yourself. - Matthew 22:39',
    characterTrait: 'Compassion',
    recommendedBooks: ['cbook-004', 'cbook-006', 'cbook-008']
  },
  {
    id: 'level-6',
    age: 8,
    grade: '3',
    description: 'Bible teachings and application',
    bibleVerse: 'Trust in the Lord with all your heart. - Proverbs 3:5',
    characterTrait: 'Faith',
    recommendedBooks: ['cbook-006', 'cbook-008']
  },
  {
    id: 'level-7',
    age: 9,
    grade: '4',
    description: 'Christian virtues and discipleship',
    bibleVerse: 'Let your light shine before others. - Matthew 5:16',
    characterTrait: 'Witness',
    recommendedBooks: ['cbook-006']
  },
  {
    id: 'level-8',
    age: 10,
    grade: '5',
    description: 'Christian leadership and service',
    bibleVerse: 'Serve one another in love. - Galatians 5:13',
    characterTrait: 'Service',
    recommendedBooks: ['cbook-006', 'cbook-008']
  }
];

// Categories for filtering
export const christianCategories = [
  { id: 'bible-stories', name: 'Bible Stories', icon: '📖' },
  { id: 'character', name: 'Character Building', icon: '⭐' },
  { id: 'prayer', name: 'Prayer & Devotion', icon: '🙏' },
  { id: 'holidays', name: 'Christian Holidays', icon: '🎄' },
  { id: 'values', name: 'Christian Values', icon: '❤️' },
  { id: 'creation', name: 'God\'s Creation', icon: '🌎' }
];

export const getBooksByAge = (age: number): ChristianBook[] => {
  return christianBooks.filter(book =>
    age >= book.ageRange.min && age <= book.ageRange.max
  );
};

export const getBooksByGrade = (grade: string): ChristianBook[] => {
  return christianBooks.filter(book =>
    book.grades.includes(grade)
  );
};

export const getBooksByTheme = (theme: string): ChristianBook[] => {
  return christianBooks.filter(book =>
    book.moralThemes.includes(theme.toLowerCase())
  );
};
