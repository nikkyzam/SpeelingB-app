import React, { useState } from 'react';
import { christianReadingLevels } from '../../data/books/christianBooks';
import './AgeGradeSelector.css';

interface AgeGradeSelectorProps {
  onSelect: (age: number, grade: string) => void;
  selectedAge?: number;
  selectedGrade?: string;
}

const AgeGradeSelector: React.FC<AgeGradeSelectorProps> = ({
  onSelect,
  selectedAge = 5,
  selectedGrade = 'K'
}) => {
  const [age, setAge] = useState(selectedAge);
  const [grade, setGrade] = useState(selectedGrade);

  const ages = [3, 4, 5, 6, 7, 8, 9, 10];
  const grades = ['Pre-K', 'K', '1', '2', '3', '4', '5'];

  const handleAgeSelect = (selectedAge: number) => {
    setAge(selectedAge);
    // Auto-select appropriate grade based on age
    const recommendedLevel = christianReadingLevels.find(level => level.age === selectedAge);
    if (recommendedLevel) {
      setGrade(recommendedLevel.grade);
      onSelect(selectedAge, recommendedLevel.grade);
    }
  };

  const handleGradeSelect = (selectedGrade: string) => {
    setGrade(selectedGrade);
    onSelect(age, selectedGrade);
  };

  const getCurrentLevelInfo = () => {
    return christianReadingLevels.find(level =>
      level.age === age && level.grade === grade
    );
  };

  const levelInfo = getCurrentLevelInfo();

  return (
    <div className="age-grade-selector">
      <div className="selector-section">
        <h3>Select Age</h3>
        <div className="age-buttons">
          {ages.map(a => (
            <button
              key={a}
              onClick={() => handleAgeSelect(a)}
              className={`age-button ${age === a ? 'selected' : ''}`}
            >
              {a} years
            </button>
          ))}
        </div>
      </div>

      <div className="selector-section">
        <h3>Select Grade</h3>
        <div className="grade-buttons">
          {grades.map(g => (
            <button
              key={g}
              onClick={() => handleGradeSelect(g)}
              className={`grade-button ${grade === g ? 'selected' : ''}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {levelInfo && (
        <div className="level-info-card">
          <div className="level-header">
            <h4>Reading Level: {levelInfo.grade} Grade ({levelInfo.age} years)</h4>
            <div className="character-trait">
              ⭐ {levelInfo.characterTrait}
            </div>
          </div>
          <p className="level-description">{levelInfo.description}</p>
          {levelInfo.bibleVerse && (
            <div className="bible-verse-card">
              <span className="verse-icon">📖</span>
              <p className="verse-text">"{levelInfo.bibleVerse}"</p>
            </div>
          )}
        </div>
      )}

      <div className="selection-summary">
        <p>
          Selected: <strong>{age} years old</strong>, <strong>Grade {grade}</strong>
        </p>
        <button
          onClick={() => onSelect(age, grade)}
          className="confirm-selection-button"
        >
          Find Books for This Level →
        </button>
      </div>
    </div>
  );
};

export default AgeGradeSelector;
