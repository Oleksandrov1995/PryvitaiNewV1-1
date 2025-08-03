import React, { useState, useEffect, useCallback } from 'react';
import './FixedButtonSection.css';
 
export const FixedButtonSection = ({ formData, onGenerateImage, loading, onButtonClick }) => {
  // useState для управління поточним рівнем та прогресом
  const [currentLevel, setCurrentLevel] = useState(0);
  // Стани для кнопки
  const states = [
    {
      stateText: "Донт пурш зе хорсес✋",
      hintText: "Оберіть що найменше стиль, настрій та фото",
      btnClass: "MainBtn1",
      stateClass: "stateText1",
      hintClass: "hintText1",
      disabled: true,
    },
    {
      stateText: "Вже є мінімум для генерації картинки",
      hintText: "Додайте ще інформації для кращого результату",
      btnClass: "MainBtn2",
      stateClass: "stateText2",
      hintClass: "hintText2",
      disabled: false,
    },
    {
      stateText: "Це знадобиться для точності☝️",
      hintText: "Більше інформації - більше зачіпок та символів",
      btnClass: "MainBtn3",
      stateClass: "stateText3",
      hintClass: "hintText3",
      disabled: false,
    },
    {
      stateText: "Маємо все необхідне для привітайки👌",
      hintText: "Атрибути та текст які поєднуються цьому сприятимуть",
      btnClass: "MainBtn4",
      stateClass: "stateText4",
      hintClass: "hintText4",
      disabled: false,
    },
    {
      stateText: "Гарний шанс персоналізувати привітайку👍",
      hintText: "Є все для сисмволічної композиції зображення",
      btnClass: "MainBtn5",
      stateClass: "stateText5",
      hintClass: "hintText5",
      disabled: false,
    },
    {
      stateText: "Заявка на шедевр 🎉",
      hintText: "Головне все чітко комбінувати ",
      btnClass: "MainBtn6",
      stateClass: "stateText6",
      hintClass: "hintText6",
      disabled: false,
    },
  ];

  // Функція для підрахунку прогресу
  const calculateProgress = useCallback(() => {
    let score = 0;
    if (formData.cardStyle) score++;
    if (formData.cardMood) score++;
    if (formData.photo) score++;
    if (formData.gender) score++;
    if (formData.age) score++;
    if (formData.hobby) score++;
    if (formData.greetingText) score++;
    if (formData.greetingSubject) score++;
    if (formData.trait) score++;
    return score;
  }, [formData]);

  // useEffect для оновлення стану при зміні formData
  useEffect(() => {
    const newScore = calculateProgress();
    
    // Визначаємо поточний рівень (0-5)
    const newLevel = Math.max(0, Math.min(newScore - 1, 5));
    setCurrentLevel(newLevel);
  }, [calculateProgress]);

  // Отримуємо поточний стан кнопки
  const currentState = states[currentLevel];
  const { stateText, hintText, btnClass, stateClass, hintClass, disabled } = currentState;

  return (
    <div className="fixedButtonBox">
      <p className={stateClass}>{stateText}</p>
      <button
        className={btnClass}
        type="submit"
        disabled={disabled || loading}
        onClick={onButtonClick}
      >
        {loading ? "Генеруємо привітайку..." : "Згенерувати зображення"}
      </button>
      <p className={hintClass}>{hintText}</p>
    </div>
  );
};

