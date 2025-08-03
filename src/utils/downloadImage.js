/**
 * Функція для скачування зображення з URL
 * @param {string} imageUrl - URL зображення для скачування
 * @param {string} filename - Назва файлу (опціонально)
 */
export const downloadImage = async (imageUrl, filename = null) => {
  if (!imageUrl) {
    console.warn('URL зображення не надано');
    return;
  }
  
  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Створюємо URL для blob
    const url = window.URL.createObjectURL(blob);
    
    // Генеруємо ім'я файлу якщо не надано
    const defaultFilename = `pryvitai-${Date.now()}.png`;
    const downloadFilename = filename || defaultFilename;
    
    // Створюємо тимчасове посилання для скачування
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    link.style.display = 'none'; // Ховаємо посилання
    
    // Додаємо до DOM, клікаємо та видаляємо
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Очищуємо ресурси
    window.URL.revokeObjectURL(url);
    
    console.log(`✅ Зображення успішно завантажено: ${downloadFilename}`);
    return true;
    
  } catch (error) {
    console.error('❌ Помилка при скачуванні зображення:', error);
    alert('Не вдалося завантажити зображення. Спробуйте ще раз.');
    return false;
  }
};

/**
 * Альтернативна функція для скачування через canvas (для випадків з CORS проблемами)
 * @param {string} imageUrl - URL зображення
 * @param {string} filename - Назва файлу
 */
export const downloadImageViaCanvas = async (imageUrl, filename = null) => {
  if (!imageUrl) {
    console.warn('URL зображення не надано');
    return;
  }

  try {
    // Створюємо canvas та context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Налаштовуємо CORS
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Встановлюємо розмір canvas відповідно до зображення
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Малюємо зображення на canvas
        ctx.drawImage(img, 0, 0);
        
        // Конвертуємо canvas в blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Не вдалося створити blob з canvas'));
            return;
          }
          
          const url = window.URL.createObjectURL(blob);
          const defaultFilename = `pryvitai-${Date.now()}.png`;
          const downloadFilename = filename || defaultFilename;
          
          const link = document.createElement('a');
          link.href = url;
          link.download = downloadFilename;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          window.URL.revokeObjectURL(url);
          
          console.log(`✅ Зображення успішно завантажено через canvas: ${downloadFilename}`);
          resolve(true);
        }, 'image/png');
      };
      
      img.onerror = () => {
        reject(new Error('Не вдалося завантажити зображення'));
      };
      
      img.src = imageUrl;
    });
    
  } catch (error) {
    console.error('❌ Помилка при скачуванні через canvas:', error);
    alert('Не вдалося завантажити зображення. Спробуйте ще раз.');
    return false;
  }
};
