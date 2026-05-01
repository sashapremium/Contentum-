export const POST = '/post';
export const POST_CREATE = `${POST}/create`;
export const POST_DETAIL = `${POST}/:chatId`;
export const POST_TITLE = 'Создать пост';

export const PHOTO = '/photo';
export const PHOTO_CREATE = `${PHOTO}/create`;
export const PHOTO_DETAIL = `${PHOTO}/:photoId`;
export const PHOTO_TITLE = 'Создать изображение';

export const GALLERY = '/gallery';
export const GALLERY_TITLE = 'Галерея';

export const THEATRE = '/theatre';
export const THEATRE_TITLE = 'Управление учреждением';
export const THEATRE_TEMPLATE = `${THEATRE}/template/:templateId`;
export const THEATRE_TEMPLATE_CREATE = `${THEATRE}/template/create`;

export const TEMPLATE_TITLE = 'Создать шаблон';

export const BACKEND_URL = 'http://127.0.0.1:8000';
