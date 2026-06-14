// Пути и заголовки всех разделов приложения.
// Используются в router и в навигационных ссылках.

// --- Посты ---
export const POST = '/post';
export const POST_CREATE = `${POST}/create`;
export const POST_DETAIL = `${POST}/:chatId`; // :chatId - id чата
export const POST_METRICS = `${POST}/:chatId/metrics/:messageId`;
export const POST_TITLE = 'Создать пост';

// Строит URL страницы метрик для конкретного сообщения в чате
export function postMetricsUrl(chatId: string, messageId: number): string {
  return `${POST}/${chatId}/metrics/${messageId}`;
}

// --- Фото-сессии ---
export const PHOTO = '/photo';
export const PHOTO_CREATE = `${PHOTO}/create`;
export const PHOTO_DETAIL = `${PHOTO}/:photoId`;
export const PHOTO_TITLE = 'Создать изображение';

// --- Галерея ---
export const GALLERY = '/gallery';
export const GALLERY_TITLE = 'Галерея';

// --- Учреждения (Theatre) ---
export const THEATRE = '/theatre';
export const THEATRE_TITLE = 'Управление учреждением';
export const THEATRE_CREATE_TITLE = 'Создать учреждение';
export const THEATRE_DETAIL = `${THEATRE}/:theatreId`;
export const THEATRE_CREATE = `${THEATRE}/create`;

// --- Шаблоны учреждения ---
export const THEATRE_TEMPLATE_DETAIL = `${THEATRE}/:theatreId/template/:templateId`;
export const THEATRE_TEMPLATE_CREATE = `${THEATRE}/:theatreId/template/create`;
export const TEMPLATE_TITLE = 'Создать шаблон';

// --- Брендбук учреждения ---
export const THEATRE_BRANDBOOK_DETAIL = `${THEATRE}/brandbook/:brandbookId`;
export const THEATRE_BRANDBOOK_IMPORT = `${THEATRE}/brandbook/import`;
export const BRANDBOOK_TITLE = 'Импорт брендбука';

// --- Мероприятия ---
export const THEATRE_EVENT_CREATE = `${THEATRE}/events/create`;
export const THEATRE_EVENT_DETAIL = `${THEATRE}/events/:eventId`;
export const EVENT_CREATE_TITLE = 'Создать мероприятие';

// Базовый URL бэкенда для медиафайлов и прямых запросов.
// В dev установить 'http://127.0.0.1:8000', в production оставить пустым.
export const BACKEND_URL = '';
// export const BACKEND_URL = 'http://127.0.0.1:8000';
