import React, { useState, forwardRef, useRef } from "react";
import "./PhotoSection.css";

const PhotoSection = forwardRef(({ onPhotoChange, scrollToNextSection }, ref) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    // Перевірка типу файлу
    if (!file.type.startsWith('image/')) {
      alert('Будь ласка, оберіть файл зображення (JPG, PNG, GIF)');
      return;
    }

    // Перевірка розміру файлу (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Розмір файлу не повинен перевищувати 10MB');
      return;
    }

    setUploadedImage(file);
    
    // Створення preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Виклик callback функції
    if (onPhotoChange) {
      onPhotoChange("photo", file);
    }

    // Автоматичний скрол до наступної секції
    if (scrollToNextSection) {
      setTimeout(() => scrollToNextSection(), 500);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onPhotoChange) {
      onPhotoChange("photo", null);
    }
  };

  const handleSkip = () => {
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };

  return (
    <section ref={ref} className="photo-section">
      <h2>Фото для персоналізації</h2>
      <p className="description">
        Додайте фото, яке асоціюється з отримувачем привітання, з його захопленнями, діяльністю або стилем. 
        Це допоможе створити більш персоналізоване зображення.
      </p>

      <div className="photo-upload-container">
        <div 
          className={`photo-upload-area ${imagePreview ? 'has-image' : ''}`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {imagePreview ? (
            <>
              <img 
                src={imagePreview} 
                alt="Завантажене фото" 
                className="uploaded-image"
              />
              <div className="image-overlay">
                <div className="overlay-text">
                  Натисніть, щоб змінити фото
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="upload-icon">📷</div>
              <div className="upload-text">
                <h3>Завантажити фото</h3>
                <p>Натисніть або перетягніть файл сюди</p>
                <p>JPG, PNG, GIF до 10MB</p>
              </div>
            </>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden-input"
          />
        </div>

        <div className="photo-actions">
          {uploadedImage ? (
            <>
              <button 
                onClick={handleClick}
                className="action-button"
              >
                Змінити фото
              </button>
              <button 
                onClick={handleRemove}
                className="action-button secondary"
              >
                Видалити
              </button>
            </>
          ) : (
            <button 
              onClick={handleSkip}
              className="action-button secondary"
            >
              Пропустити
            </button>
          )}
        </div>

        <div className="photo-tips">
          <h4>💡 Поради для кращого результату:</h4>
          <ul>
            <li>Використовуйте якісні фото з хорошим освітленням</li>
            <li>Обличчя або об'єкти повинні бути чітко видимі</li>
            <li>Уникайте розмитих або темних зображень</li>
          </ul>
        </div>
      </div>
    </section>
  );
});

export default PhotoSection;
