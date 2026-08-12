# 🎓 Learning Hub Requirements & Logic

This document outlines the core learning mechanics, progression rules, and daily goals for the Kids Spelling Bee application.

## 📊 Daily Goals
The application tracks progress toward a daily word count goal. This goal affects the difficulty of unlocking advanced features each day.

- **Default Goal:** 30 words per day.
- **Special Case ("Joy" Rule):** If a user's name or email contains the word **"joy"** (case-insensitive), the daily goal is reduced to **10 words**.
- **Dynamic Grouping:** Words are organized into groups based on the current daily goal (e.g., if the goal is 30, words are grouped in sets of 30).

## 🛣️ Learning Path & Progression
To ensure mastery, users must follow a structured path each day:

1.  **Learn Mode (Step 1):**
    -   Users study new words with meanings, sentences, and audio.
    -   Requirement: Learn words until the **Daily Goal** is reached.
    -   Action: Upon reaching the goal, the system prompts the user to move to Practice.

2.  **Practice Mode (Step 2):**
    -   Users practice spelling words they have learned.
    -   Requirement: Complete practice for the daily set.
    -   Unlocked by: Reaching the Daily Goal.
    -   Flow Shortcut: Once the Daily Goal is reached, a "Take Quiz" button appears directly within the Practice interface for a seamless transition.

3.  **Spelling Quiz (Step 3):**
    -   A formal test of spelling accuracy.
    -   Unlocked by: Completing the daily learning goal.
    -   Flow Shortcut: Once the daily spelling goal is reached (e.g. 30 words spelled today), a "Take Vocabulary Quiz" button appears for a seamless transition.

4.  **Vocabulary Quiz (Step 4):**
    -   Tests the understanding of word meanings.
    -   Unlocked by: Passing the Spelling Quiz with 0 errors.
    -   Flow Shortcut: Once the daily vocabulary goal is reached (e.g. 30 words learned today), a "Play Games" button appears for a seamless transition.

5.  **Game Center (Final Step):**
    -   Fun, interactive games that reinforce learning.
    -   Unlocked by: Passing the Vocabulary Quiz with 0 errors.
    -   *Note: Some basic games may be unlocked by default, but advanced/word-related games require completing the daily flow.*

## 💾 Persistence & Resumption
- **Auto-Save:** Progress is saved to `localStorage` and synced to Firebase for authenticated users.
- **Resumable Sessions:** When a user returns to "Learn" or "Practice" mode, the system automatically identifies the first uncompleted word in their current group so they can pick up exactly where they left off.
- **Daily Reset:** At the start of a new calendar day, daily counts (`wordsLearnedToday`, etc.) are reset to 0, and the learning path relocks to encourage daily engagement.

## 🛠️ State Management
- **`userStore`:** Manages the active user profile and calculates the `dailyGoal` based on the "Joy" rule.
- **`LearningFlowController`:** The central engine for tracking daily progress, checking unlock statuses, and managing word groups.
- **`ProgressContext`:** Synchronizes the learning state across the entire UI in real-time.
