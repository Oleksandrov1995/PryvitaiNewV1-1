// Конфігурація API
const API_CONFIG = {
  // Базова URL для API запитів - використовуємо HTTP замість HTTPS
  BASE_URL: 'http://vps66716.hyperhost.name:5000/api',

  
  // Альтернативні хости для тестування
  ALTERNATIVE_HOSTS: [
    'http://vps66716.hyperhost.name:5000/api',
    'https://vps66716.hyperhost.name:5000/api',
    'http://localhost:5000/api',
    'http://vps66716.hyperhost.name/api'
  ],
  
  // Окремі endpoints
  ENDPOINTS: {
    UPLOAD_PHOTO: '/upload-photo',
    GENERATE_GREETING: '/generate-greeting',
    GENERATE_IMAGE_PROMPT: '/generate-image-promt',
    HEALTH: '/health'
  }
};

// Функція для отримання повного URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Експорт окремих URL для зручності
export const API_URLS = {
  UPLOAD_PHOTO: getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_PHOTO),
  GENERATE_GREETING: getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_GREETING),
  GENERATE_IMAGE_PROMPT: getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_IMAGE_PROMPT),
  HEALTH: getApiUrl(API_CONFIG.ENDPOINTS.HEALTH)
};

export default API_CONFIG;
