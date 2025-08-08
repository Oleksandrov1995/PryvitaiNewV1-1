import React, { useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Editor.css';

// Константи
const CANVAS_MAX_WIDTH = 800;
const BANNER_HEIGHT = 100;

const Editor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef(null);

  // Отримуємо дані з URL параметрів
  const imageUrl = searchParams.get('imageUrl');
  const text = searchParams.get('text') || '';

  console.log('Editor - отримані дані:', { imageUrl, text });

  useEffect(() => {
    if (!imageUrl) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      console.log('Editor - малюю зображення з текстом:', text);
      
      // Розрахунок розмірів
      const scale = Math.min(CANVAS_MAX_WIDTH / img.width, 1);
      const imgWidth = img.width * scale;
      const imgHeight = img.height * scale;
      const canvasWidth = imgWidth;
      
      // Розраховуємо висоту плашки під текст
      ctx.font = "24px sans-serif";
      const lines = wrapText(ctx, text, canvasWidth - 40);
      const lineHeight = 30;
      const textHeight = lines.length * lineHeight;
      const bannerHeight = Math.max(BANNER_HEIGHT, textHeight + 40);
      
      console.log('Editor - розміри:', { 
        lines: lines.length, 
        textHeight, 
        bannerHeight, 
        canvasHeight: imgHeight + bannerHeight 
      });
      
      const canvasHeight = imgHeight + bannerHeight;
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Малюємо зображення
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

      // Малюємо білу плашку
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, imgHeight, canvasWidth, bannerHeight);

      // Малюємо чорний текст
      ctx.font = "24px sans-serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Центруємо текст в плашці
      let y = imgHeight + bannerHeight / 2 - textHeight / 2 + lineHeight / 2;
      
      lines.forEach(line => {
        ctx.fillText(line, canvasWidth / 2, y);
        y += lineHeight;
      });
    };
  }, [imageUrl, text]);

  // Функція для переносу тексту
  function wrapText(ctx, text, maxWidth) {
    if (!text) return [""];
    const words = text.split(" ");
    const lines = [];
    let line = "";
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());
    return lines;
  }

  // Завантаження зображення
  const handleDownload = () => {
    const canvas = canvasRef.current;
    
    try {
      // Створюємо blob з canvas
      canvas.toBlob((blob) => {
        if (blob) {
          // Завжди завантажуємо файл на пристрій
          downloadBlob(blob);
        }
      }, "image/png");
    } catch (error) {
      console.error('Помилка при завантаженні:', error);
      alert('Помилка при завантаженні зображення');
    }
  };

  // Допоміжна функція для завантаження blob
  const downloadBlob = (blob) => {
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "pryvitai-card.png";
      
      // Для мобільних пристроїв додаємо атрибути для кращої роботи
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
      
      // Додаємо до DOM, клікаємо та видаляємо
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Очищуємо URL після завантаження
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Файл успішно завантажено');
    } catch (error) {
      console.error('Помилка при завантаженні файлу:', error);
      alert('Помилка при завантаженні файлу');
    }
  };

  // Поділитися зображенням
  const handleShare = () => {
    const canvas = canvasRef.current;
    
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          if (navigator.share && blob) {
            const file = new File([blob], "pryvitai-card.png", { type: "image/png" });
            navigator.share({
              title: "Згенеровано з gifta.pp.ua персонально для Вас",
              // text: "Подивіться на мою персоналізовану листівку!",
              files: [file]
            }).catch((error) => {
              console.log('Помилка поділу:', error);
              // Fallback для десктопу
              fallbackShare(canvas);
            });
          } else {
            // Fallback для десктопу
            fallbackShare(canvas);
          }
        }
      }, "image/png");
    } catch (error) {
      console.error('Помилка при поділі:', error);
      alert('Помилка при поділі зображення');
    }
  };

  // Fallback функція для поділу
  const fallbackShare = (canvas) => {
    try {
      const dataUrl = canvas.toDataURL("image/png");
      navigator.clipboard.writeText(dataUrl).then(() => {
        alert("Посилання скопійовано в буфер обміну");
      }).catch(() => {
        alert("Не вдалося скопіювати посилання");
      });
    } catch (error) {
      console.error('Помилка fallback поділу:', error);
      alert('Помилка при поділі зображення');
    }
  };

  // Створити нове зображення
  const handleCreateNew = () => {
    navigate("/");
  };

  // Повернутися назад зі збереженням даних
  const handleGoBack = () => {
    navigate("/");
  };

  if (!imageUrl) {
    return (
      <div className="editor-container">
        <div className="error-message">
          <p>Помилка: відсутнє зображення для редагування</p>
          <button onClick={handleCreateNew} className="create-new-button">
            Створити нове зображення
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <button onClick={handleGoBack} className="back-button">
        ←
      </button>
      
      <div className="editor-header">
        {/* <h2>🎨 Автоматичне додавання тексту виконано</h2> */}
        {/* <p>Налаштуйте та збережіть вашу привітайку</p> */}
      </div>

      <div className="canvas-container">
        <canvas 
          ref={canvasRef} 
          className="editor-canvas"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <div className="editor-actions">
        <button onClick={handleShare} className="action-button share-button">
          📤 Поділитися
        </button>
        
        <button onClick={handleDownload} className="action-button download-button">
          💾 Завантажити
        </button>
        
        <button onClick={handleCreateNew} className="action-button create-button">
          ✨ Створити нове
        </button>
      </div>

      <div className="editor-info">
        <p>💡 Порада: Ви можете поділитися листівкою або зберегти її на пристрій</p>
      </div>
    </div>
  );
};

export default Editor; 

