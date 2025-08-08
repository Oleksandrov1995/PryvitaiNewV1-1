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
    
    // Генеруємо ім'я файлу якщо не надано
    const defaultFilename = `pryvitai-${Date.now()}.png`;
    const downloadFilename = filename || defaultFilename;
    
    // Перевіряємо чи це мобільний пристрій
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Для мобільних пристроїв використовуємо Web Share API якщо доступний
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], downloadFilename, { type: 'image/png' });
          const shareData = {
            title: 'Привітайка',
            text: 'Моя згенерована привітайка',
            files: [file]
          };
          
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            console.log('✅ Зображення поділено через Web Share API');
            return true;
          }
        } catch (shareError) {
          console.log('Web Share API недоступний, використовуємо fallback');
        }
      }
      
      // Fallback для мобільних пристроїв - відкриваємо в новій вкладці
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Очищуємо ресурси через деякий час
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      console.log(`✅ Зображення відкрито в новій вкладці для мобільного пристрою`);
      return true;
    } else {
      // Для десктопних пристроїв використовуємо звичайне завантаження
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFilename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Очищуємо ресурси
      window.URL.revokeObjectURL(url);
      
      console.log(`✅ Зображення успішно завантажено: ${downloadFilename}`);
      return true;
    }
    
  } catch (error) {
    console.error('❌ Помилка при скачуванні зображення:', error);
    
    // Fallback - спробуємо через canvas
    try {
      console.log('Спроба завантаження через canvas...');
      return await downloadImageViaCanvas(imageUrl, filename);
    } catch (canvasError) {
      console.error('❌ Помилка при скачуванні через canvas:', canvasError);
      alert('Не вдалося завантажити зображення. Спробуйте ще раз.');
      return false;
    }
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
          
          const defaultFilename = `pryvitai-${Date.now()}.png`;
          const downloadFilename = filename || defaultFilename;
          
          // Перевіряємо чи це мобільний пристрій
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          if (isMobile) {
            // Для мобільних пристроїв використовуємо Web Share API або відкриваємо в новій вкладці
            if (navigator.share && navigator.canShare) {
              try {
                const file = new File([blob], downloadFilename, { type: 'image/png' });
                const shareData = {
                  title: 'Привітайка',
                  text: 'Моя згенерована привітайка',
                  files: [file]
                };
                
                if (navigator.canShare(shareData)) {
                  navigator.share(shareData).then(() => {
                    console.log('✅ Зображення поділено через Web Share API (canvas)');
                    resolve(true);
                  }).catch(() => {
                    // Fallback - відкриваємо в новій вкладці
                    openInNewTab(blob, downloadFilename);
                  });
                  return;
                }
              } catch (shareError) {
                console.log('Web Share API недоступний, використовуємо fallback');
              }
            }
            
            // Fallback для мобільних пристроїв
            openInNewTab(blob, downloadFilename);
          } else {
            // Для десктопних пристроїв використовуємо звичайне завантаження
            const url = window.URL.createObjectURL(blob);
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
          }
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

// Допоміжна функція для відкриття в новій вкладці
const openInNewTab = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Очищуємо ресурси через деякий час
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
  
  console.log(`✅ Зображення відкрито в новій вкладці для мобільного пристрою (canvas)`);
};
