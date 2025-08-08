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
  // useState для контролю видимості фіксованої кнопки
  const [isFixedButtonVisible, setIsFixedButtonVisible] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref для доступу до функції generateImage з ImageGenerationSection
  const generateImageRef = useRef(null);
  
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
    // Спочатку скролимо до ImageGenerationSection
    if (imageGenerationRef.current) {
      imageGenerationRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Невелика затримка, щоб скрол встиг завершитися
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Потім запускаємо генерацію зображення
    if (generateImageRef.current && generateImageRef.current.generateImage) {
      await generateImageRef.current.generateImage();
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

    const currentRef = imageGenerationRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // useEffect для відстеження клавіатури
  useEffect(() => {
    const handleResize = () => {
      // Перевіряємо чи це мобільний пристрій
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Визначаємо чи відкрита клавіатура (зменшення висоти вікна)
        const windowHeight = window.innerHeight;
        const screenHeight = window.screen.height;
        const keyboardThreshold = screenHeight * 0.3; // 30% від висоти екрану
        
        setIsKeyboardOpen(windowHeight < (screenHeight - keyboardThreshold));
      } else {
        setIsKeyboardOpen(false); // На десктопі завжди false
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Перевіряємо при завантаженні

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect для відстеження орієнтації
  useEffect(() => {
    const handleOrientation = () => {
      // Перевіряємо чи це мобільний пристрій
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        setIsLandscape(window.innerWidth > window.innerHeight);
      } else {
        setIsLandscape(false); // На десктопі завжди false
      }
    };

    window.addEventListener('resize', handleOrientation);
    handleOrientation(); // Перевіряємо при завантаженні

    return () => window.removeEventListener('resize', handleOrientation);
  }, []);

  // useEffect для відстеження генерації зображення
  useEffect(() => {
    const checkGeneratingStatus = () => {
      if (generateImageRef.current) {
        setIsGenerating(generateImageRef.current.isGenerating || false);
      }
    };

    // Перевіряємо кожні 100мс
    const interval = setInterval(checkGeneratingStatus, 100);
    
    return () => clearInterval(interval);
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
 
      
      <GreetingSubjectSection 
        ref={greetingSubjectRef}
        onSubjectChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(5)}
      />
      
      <TraitsSection 
        ref={traitsRef}
        onTraitChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(6)}
      />
            <GreetingTextSection 
        ref={greetingTextRef}
        onTextChange={handleFieldChange}
        formData={formData}
        scrollToNextSection={createScrollToNextSection(7)}
      />
      
     
      
      <ImageGenerationSection 
        ref={imageGenerationRef}
        onImageGenerated={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(7)}
        formData={formData}
        onGenerateImageRef={generateImageRef}
        greetingTextRef={greetingTextRef}
      />

      {isFixedButtonVisible && !isKeyboardOpen && !isLandscape && !isGenerating && (
        <FixedButtonSection 
          formData={formData}
          onButtonClick={handleGenerateImage}
          loading={generateImageRef.current?.isGenerating || false}
        />
      )}

    </div>
  );
};
