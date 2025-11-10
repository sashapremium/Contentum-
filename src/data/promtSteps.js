export const mainSteps = [
  { field: 'event_name', prompt: 'Введите название постановки.', type: 'text' },
  /*{
    field: 'idea',
    prompt: 'Опиши цель и идею (например: "вдохновляющее видео о театре")',
    type: 'text',
  },*/
  /*{
    field: 'emotion',
    prompt: 'Какой эмоциональный тон должен быть? (энергичный, ностальгический, романтичный...)',
    type: 'text',
  },*/
  /*{
    field: 'relation_to_event',
    prompt: 'Насколько материал связан с событием? (прямая / тематическая / без привязки)',
    type: 'select',
    options: ['прямая', 'тематическая', 'без привязки'],
  },*/

  {
    field: 'event_genre',
    prompt: 'Укажите жанр (мюзикл, драма, комедия и т.д.)',
    type: 'text',
  },
  { field: 'event_description', prompt: 'Кратко опишите сюжет или содержание', type: 'textarea' },
  {
    field: 'visual_style',
    prompt: 'Выберите художественный стиль (реализм, минимализм, арт-деко, неон, сюрреализм...)',
    type: 'text',
  },
  {
    field: 'composition_focus',
    prompt: 'Что в центре композиции? (человек, сцена, предмет, абстракция, пейзаж)',
    type: 'text',
  },
  {
    field: 'color_palette',
    prompt: 'Какая цветовая палитра преобладает? (тёплая, холодная, фирменная)',
    type: 'text',
  },
  {
    field: 'visual_associations',
    prompt: 'Назови несколько слов-ассоциаций (например: “огни сцены, движение, свет прожекторов”)',
    type: 'textarea',
  },
];

export const extraSteps = [
  {
    field: 'aspect_ratio',
    prompt: 'Выберите формат кадра (9:16, 1:1, 16:9)',
    type: 'select',
    options: ['9:16', '1:1', '16:9'],
  },
  {
    field: 'language',
    prompt: 'Выберите язык текста (ru / en)',
    type: 'select',
    options: ['ru', 'en'],
  },
  { field: 'duration', prompt: 'Если это видео — укажите длительность (в секундах)', type: 'text' },
  { field: 'variation_count', prompt: 'Сколько вариантов нужно сгенерировать?', type: 'text' },
  {
    field: 'platform',
    prompt: 'Где будет опубликовано? (Instagram, VK, YouTube Shorts, digital screen и т.д.)',
    type: 'text',
  },
];
