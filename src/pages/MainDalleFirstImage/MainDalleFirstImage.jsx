import React, { useRef, useState, useEffect } from "react";
import "./MainDalleFirstImage.css";
import { 
  GenderAgeSection, 
  PhotoSection,
  GreetingTextSection,
  CardStyleSection, 
  CardMoodSection, 
  TraitsSection,
  GreetingSubjectSection,
  HobbiesSection,
  ImageGenerationSection,
  FixedButtonSection
} from "../../components/sections";
import { useFormData } from "../../utils/formHandlers";

export const MainDalleFirstImage = () => {
  // useState для статусу завантаження
  const [loading, setLoading] = useState(false);
  // useState для контролю видимості фіксованої кнопки
  const [isFixedButtonVisible, setIsFixedButtonVisible] = useState(true);
  
  // Створюємо refs для кожної секції
  const styleRef = useRef(null);
  const moodRef = useRef(null);
  const photoRef = useRef(null);
  const genderAgeRef = useRef(null);
  const hobbiesRef = useRef(null);
  const greetingTextRef = useRef(null);
  const greetingSubjectRef = useRef(null);
  const traitsRef = useRef(null);
  const imageGenerationRef = useRef(null);

  // Масив refs для зручності навігації
  const sectionRefs = [styleRef, moodRef, photoRef, genderAgeRef, hobbiesRef, greetingSubjectRef, traitsRef, greetingTextRef, imageGenerationRef];

  const { formData, updateField } = useFormData({
    cardStyle: '',
    cardMood: '',
    photo: null,
    gender: '',
    age: '',
    hobby: '',
    greetingText: '',
    greetingSubject: '',
    trait: '',
    generatedImagePrompt: '',
    imageUrl: ''
  });

  const handleFieldChange = (field, value) => {
    updateField(field, value);
    console.log(`Оновлено ${field}: ${value}`);
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      // Тут буде логіка генерації зображення
      console.log('Генеруємо зображення з даними:', formData);
      // Симуляція запиту
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Помилка генерації:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функція для скролу до наступної секції
  const createScrollToNextSection = (currentIndex) => {
    return () => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < sectionRefs.length && sectionRefs[nextIndex].current) {
        sectionRefs[nextIndex].current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    };
  };

  // useEffect для відстеження видимості ImageGenerationSection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === imageGenerationRef.current) {
            // Коли ImageGenerationSection видима, ховаємо фіксовану кнопку
            setIsFixedButtonVisible(!entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.1, // Спрацьовує коли 10% секції видимо
      }
    );

    if (imageGenerationRef.current) {
      observer.observe(imageGenerationRef.current);
    }

    return () => {
      if (imageGenerationRef.current) {
        observer.unobserve(imageGenerationRef.current);
      }
    };
  }, []);



  return (
    <div className="main-dalle-first-image">
     <div className="form-header">
        <h1>Створи персоналізоване зображення до привітання або жесту разом з Привітайком</h1>
        </div>
        
      <CardStyleSection 
        ref={styleRef}
        onStyleChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(0)}
      />
      
      <CardMoodSection 
        ref={moodRef}
        onMoodChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(1)}
      />
      
      <PhotoSection 
        ref={photoRef}
        onPhotoChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(2)}
      />
        
      <GenderAgeSection 
        ref={genderAgeRef}
        onGenderChange={handleFieldChange}
        onAgeChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(3)}
      />
      
      <HobbiesSection 
        ref={hobbiesRef}
        onHobbyChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(4)}
      />
       <GreetingTextSection 
        ref={greetingTextRef}
        onTextChange={handleFieldChange}
        formData={formData}
        scrollToNextSection={createScrollToNextSection(5)}
      />
      
      <GreetingSubjectSection 
        ref={greetingSubjectRef}
        onSubjectChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(6)}
      />
      
      <TraitsSection 
        ref={traitsRef}
        onTraitChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(7)}
      />
      
     
      
      <ImageGenerationSection 
        ref={imageGenerationRef}
        onImageGenerated={handleFieldChange}
        formData={formData}
        scrollToNextSection={createScrollToNextSection(8)}
      />

      {isFixedButtonVisible && (
        <FixedButtonSection 
          formData={formData}
          onGenerateImage={handleGenerateImage}
          loading={loading}
        />
      )}

    </div>
  );
};
