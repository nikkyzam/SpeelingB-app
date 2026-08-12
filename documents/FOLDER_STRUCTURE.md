# Kids Spelling Bee - Folder Structure

The following diagram illustrates the project structure for the Kids Spelling Bee application:

```text
spellingB/ (Project Root)
├── .github/workflows/          # CI/CD pipelines (Firebase Hosting)
├── dist/                       # Production build output
├── public/                     # Static assets (favicons, etc.)
├── src/                        # Application source code
│   ├── assets/                 # Media resources
│   │   ├── audio/              # Sound effects and speech
│   │   ├── fonts/              # Custom fonts
│   │   └── images/             # Icons, stickers, and theme assets
│   ├── components/             # Reusable React components
│   │   ├── auth/               # Authentication UI
│   │   ├── common/             # Shared UI (Buttons, Confetti)
│   │   ├── games/              # Mini-games (RhythmTap, PhysicsPuzzle, etc.)
│   │   ├── layout/             # Structural components (Header, Navigation)
│   │   ├── learning/           # Core learning modes (Learn, Spell, Quiz)
│   │   └── rewards/            # Reward-related components
│   ├── config/                 # Configuration (Firebase)
│   ├── contexts/               # React Contexts (Theme, Audio, Progress, User)
│   ├── data/                   # Word lists and static data
│   ├── hooks/                  # Custom React hooks (useLocalStorage, useStreak)
│   ├── pages/                  # Main view components (Home, LearningHub, etc.)
│   ├── services/               # Business logic and external APIs
│   │   ├── auth/               # Auth service logic
│   │   ├── persistence/        # Firebase sync
│   │   ├── progress/           # Learning flow controllers
│   │   └── wordBank/           # Word management logic
│   ├── stores/                 # State management (Zustand stores)
│   ├── styles/                 # Global CSS and themes
│   ├── utils/                  # Helper functions
│   ├── App.tsx                 # Main Application component
│   ├── index.tsx               # App entry point
│   └── vite-env.d.ts           # Type definitions for Vite
├── __tests__/                  # Test suites (Unit, Integration, Visual)
├── firebase.json               # Firebase Hosting configuration
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite build tool configuration
```

### Key Architectural Layers

- **`src/pages/`**: High-level views corresponding to application routes.
- **`src/components/`**: Modular pieces of UI. Note that `games/` and `learning/` contain the primary interactive content.
- **`src/contexts/` & `src/stores/`**: Manage global state, including user progress, theme preferences, and audio settings.
- **`src/services/`**: Encapsulates logic for word randomization, progress tracking, and Firebase synchronization.
- **`src/data/`**: Centralized storage for the educational content (word lists divided by difficulty).
