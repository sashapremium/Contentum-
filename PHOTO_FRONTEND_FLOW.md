# Frontend Flow for Photos

## Что важно понять сразу

- Отдельного endpoint "создать пустой брендбук" нет.
- В текущей модели пустой брендбук означает: создан `Theatre`, а поле `Theatre.brandbook` ещё пустое.
- Шаблоны живут внутри брендбука конкретного театра.
- Для каждого шаблона его ассеты должны отправляться отдельно и хранятся изолированно в папке шаблона.
- Обновление шаблона поддерживается через `PATCH`, не через `PUT`.

## Базовый сценарий

1. Создать театр.
2. Считать, что у этого театра теперь есть пустой брендбук.
3. Создать первый шаблон внутри брендбука.
4. Получить полное описание шаблона и `inputSchema`.
5. Создать фото-сессию по выбранному шаблону.
6. Одним запросом отправить генерацию с `texts` и несколькими photo-slot файлами.
7. Показать результат и историю.
8. Скачать итоговый PNG.

---

## 1. Создать театр

### Request

`POST /api/theatres/`

```json
{
  "name": "Театр кукол",
  "address": "Тюмень"
}
```

### Response

```json
{
  "id": 7,
  "name": "Театр кукол",
  "address": "Тюмень",
  "createdAt": "2026-05-01T10:00:00",
  "hasBrandbook": false
}
```

### Что это значит для frontend

- Театр создан.
- Брендбук пока пустой.
- Можно сразу переходить к созданию шаблона через `/brandbook/templates/`.

---

## 2. Создать шаблон внутри пустого брендбука

### Endpoint

`POST /api/theatres/{theatreId}/brandbook/templates/`

### Поддерживаемые форматы

- `application/json`
- `multipart/form-data`

### Рекомендуемый вариант для frontend

Использовать `multipart/form-data`, где:

- поле `template` содержит JSON-строку с manifest одного шаблона;
- остальные поля содержат файлы ассетов этого шаблона.

### Пример multipart логики

Поле `template`:

```json
{
  "id": "poster_dark",
  "name": "Poster Dark",
  "family": "photo_overlay",
  "canvas": {
    "width": 1080,
    "height": 1350
  },
  "palette": {
    "primary": "#1A2744",
    "text": "#FFFFFF"
  },
  "fonts": {
    "heading": {
      "file": "fonts/heading.ttf",
      "family": "Heading"
    }
  },
  "layers": [
    {
      "type": "photo",
      "name": "heroImage",
      "slot": "heroImage",
      "box": [0, 0, 1080, 1350],
      "crop": "cover",
      "gravity": "center",
      "required": true
    },
    {
      "type": "gradient",
      "box": [0, 850, 1080, 500],
      "colorFrom": "rgba(0,0,0,0)",
      "colorTo": "rgba(0,0,0,0.8)",
      "direction": "top_to_bottom"
    },
    {
      "type": "text",
      "name": "headline",
      "editable": true,
      "label": "Заголовок",
      "box": [60, 920, 960, 280],
      "font": "heading",
      "color": "#FFFFFF",
      "fontSize": [42, 90],
      "maxLines": 3,
      "maxLength": 200,
      "overflow": "shrink",
      "lineSpacing": 1.15,
      "required": true
    },
    {
      "type": "image",
      "file": "images/logo.png",
      "box": [60, 60, 240, 120],
      "align": "left"
    }
  ]
}
```

Файлы в том же multipart:

- `heading.ttf`
- `logo.png`

Важно:

- backend сопоставляет файлы по имени файла в manifest;
- если в manifest указан `fonts/heading.ttf`, frontend должен приложить файл с именем `heading.ttf`;
- если в manifest указан `images/logo.png`, frontend должен приложить файл с именем `logo.png`.

### Условия по manifest

- динамический `text` должен иметь `name`;
- статический `text` должен иметь `defaultText`;
- динамический `photo` должен иметь `name` или `slot`;
- `canvas.width` и `canvas.height` должны быть больше нуля;
- `layers[].box` должен быть в формате `[x, y, width, height]`.

### Response

Backend вернёт полное описание шаблона:

```json
{
  "id": "poster_dark",
  "name": "Poster Dark",
  "family": "photo_overlay",
  "canvas": {
    "width": 1080,
    "height": 1350
  },
  "palette": {
    "primary": "#1A2744",
    "text": "#FFFFFF"
  },
  "fonts": {
    "heading": {
      "file": "poster_dark/fonts/heading.ttf",
      "family": "Heading"
    }
  },
  "preview": "poster_dark/previews/poster_dark.png",
  "layers": [
    {
      "type": "photo",
      "name": "heroImage",
      "slot": "heroImage",
      "box": [0, 0, 1080, 1350]
    },
    {
      "type": "text",
      "name": "headline",
      "editable": true,
      "label": "Заголовок",
      "box": [60, 920, 960, 280]
    }
  ],
  "inputSchema": {
    "texts": [
      {
        "key": "headline",
        "label": "Заголовок",
        "required": true,
        "maxLength": 200,
        "maxLines": 3,
        "defaultText": "",
        "placeholder": ""
      }
    ],
    "images": [
      {
        "key": "heroImage",
        "label": "heroImage",
        "required": true,
        "crop": "cover",
        "gravity": "center"
      }
    ]
  }
}
```

### Готовый пример шаблона на 3 текста и 3 фото

Ниже готовый рабочий пример manifest одного шаблона для визуального редактора:

```json
{
  "id": "festival_collage",
  "name": "Festival Collage",
  "family": "layout",
  "canvas": {
    "width": 1080,
    "height": 1350
  },
  "palette": {
    "primary": "#101828",
    "text": "#FFFFFF"
  },
  "fonts": {
    "heading": {
      "file": "fonts/heading.ttf",
      "family": "Heading"
    },
    "body": {
      "file": "fonts/body.ttf",
      "family": "Body"
    }
  },
  "layers": [
    {
      "type": "photo",
      "name": "heroImage",
      "slot": "heroImage",
      "box": [0, 0, 540, 700],
      "crop": "cover",
      "gravity": "center",
      "required": true
    },
    {
      "type": "photo",
      "name": "speakerImage",
      "slot": "speakerImage",
      "box": [540, 0, 540, 700],
      "crop": "cover",
      "gravity": "center",
      "required": true
    },
    {
      "type": "photo",
      "name": "galleryImage",
      "slot": "galleryImage",
      "box": [0, 700, 1080, 320],
      "crop": "cover",
      "gravity": "center",
      "required": true
    },
    {
      "type": "text",
      "name": "headline",
      "editable": true,
      "label": "Заголовок",
      "box": [60, 1040, 960, 110],
      "font": "heading",
      "color": "#FFFFFF",
      "fontSize": [34, 72],
      "maxLines": 2,
      "maxLength": 120,
      "overflow": "shrink",
      "required": true
    },
    {
      "type": "text",
      "name": "subtitle",
      "editable": true,
      "label": "Подзаголовок",
      "box": [60, 1160, 960, 70],
      "font": "body",
      "color": "#FFFFFF",
      "fontSize": [24, 42],
      "maxLines": 2,
      "maxLength": 160,
      "overflow": "shrink",
      "required": true
    },
    {
      "type": "text",
      "name": "cta",
      "editable": true,
      "label": "CTA",
      "box": [60, 1240, 960, 50],
      "font": "body",
      "color": "#FFFFFF",
      "fontSize": [18, 28],
      "maxLines": 1,
      "maxLength": 90,
      "overflow": "shrink",
      "required": true
    },
    {
      "type": "image",
      "file": "images/logo.png",
      "box": [60, 60, 180, 90],
      "align": "left"
    }
  ]
}
```

Файлы для создания этого шаблона:

- `heading.ttf`
- `body.ttf`
- `logo.png`

---

## 3. Обновить шаблон

### Endpoint

`PATCH /api/theatres/{theatreId}/brandbook/templates/{templateId}/`

### Поддерживается ли загрузка файлов заново?

Да. Backend поддерживает обновление шаблона с новыми файлами ассетов.

### Поддерживается ли изоляция файлов по шаблонам?

Да. Ассеты шаблонов лежат отдельно, а не в общем пуле:

```text
media/brandbooks/<theatre_id>/<template_id>/...
```

### Флаг удаления старых файлов

Поддерживается флаг:

- `replaceAssets=true`

Что он делает:

- если `true`, папка ассетов текущего шаблона очищается перед пересохранением;
- если `false`, старые файлы могут переиспользоваться, если они всё ещё нужны manifest.

### Важное ограничение

Сейчас нет более тонких флагов удаления на уровне отдельных файлов. То есть есть:

- либо обычный `PATCH` с переиспользованием старых файлов;
- либо `PATCH` с `replaceAssets=true`, который пересобирает ассеты шаблона заново.

### Рекомендуемый frontend-сценарий

Если редактор считает шаблон полностью новой версией:

- отправлять весь актуальный manifest;
- отправлять все актуальные ассеты;
- ставить `replaceAssets=true`.

Это ближе всего к тому, что обсуждалось: "для каждого шаблона грузить свои файлы и не зависеть от других шаблонов".

---

## 4. Получить список шаблонов брендбука

### Endpoint

`GET /api/theatres/{theatreId}/brandbook/`

### Response

```json
{
  "theatreId": 7,
  "theatreName": "Театр кукол",
  "templates": [
    {
      "id": "poster_dark",
      "name": "Poster Dark",
      "family": "photo_overlay",
      "preview": "poster_dark/previews/poster_dark.png",
      "dynamicTextCount": 1,
      "dynamicImageCount": 1
    }
  ]
}
```

Это удобно для экрана выбора шаблона.

---

## 5. Получить полное описание шаблона для runtime

### Endpoint

`GET /api/theatres/{theatreId}/brandbook/templates/{templateId}/`

### Зачем frontend это вызывать

Чтобы:

- получить полный manifest шаблона;
- получить `inputSchema`;
- построить форму пользовательского ввода по этому шаблону.

Frontend не должен гадать, какие именно поля нужно показать пользователю. Это приходит из `inputSchema`.

---

## 6. Создать фото-сессию

### Endpoint

`POST /api/photos/sessions/`

### Request

```json
{
  "theatreId": 7,
  "templateId": "poster_dark"
}
```

### Response

```json
{
  "sessionId": "uuid",
  "title": "Фото: Театр кукол - Poster Dark",
  "theatreId": 7,
  "theatreName": "Театр кукол",
  "templateId": "poster_dark",
  "templateName": "Poster Dark",
  "templateFamily": "photo_overlay",
  "inputSchema": {
    "texts": [
      {
        "key": "headline",
        "label": "Заголовок",
        "required": true,
        "maxLength": 200
      }
    ],
    "images": [
      {
        "key": "heroImage",
        "label": "heroImage",
        "required": true,
        "crop": "cover",
        "gravity": "center"
      }
    ]
  }
}
```

После этого frontend уже знает, какие поля нужно спросить у пользователя.

---

## 7. Передать пользовательские фото за один запрос

### Рекомендуемый способ

Frontend делает один `PATCH /api/photos/sessions/{sessionId}/` в формате `multipart/form-data`.

В этом одном запросе передаются:

- `texts` как JSON-строка;
- `templateId` опционально;
- файлы динамических фото, где имя form-поля равно ключу image-slot из `inputSchema`.

### Готовый пример на 3 текста и 3 фото

Шаблон выше после create вернёт примерно такой `inputSchema`:

```json
{
  "texts": [
    {
      "key": "headline",
      "label": "Заголовок",
      "required": true,
      "maxLength": 120
    },
    {
      "key": "subtitle",
      "label": "Подзаголовок",
      "required": true,
      "maxLength": 160
    },
    { "key": "cta", "label": "CTA", "required": true, "maxLength": 90 }
  ],
  "images": [
    { "key": "heroImage", "required": true },
    { "key": "speakerImage", "required": true },
    { "key": "galleryImage", "required": true }
  ]
}
```

Тогда frontend отправляет один запрос:

`PATCH /api/photos/sessions/{sessionId}/`

`multipart/form-data`

Поля формы:

- `texts` = `{"headline":"ФЕСТИВАЛЬ ТЕАТРА","subtitle":"3 дня премьер и встреч","cta":"Билеты на сайте"}`
- `heroImage` = файл `hero.jpg`
- `speakerImage` = файл `speaker.jpg`
- `galleryImage` = файл `gallery.jpg`

Ключевая идея:

- три текста уходят внутри одного поля `texts`;
- три фото уходят в том же запросе как три файла;
- backend сам сохранит их и подставит в нужные image-slot'ы по имени form-поля.

### Что вернёт backend

```json
{
  "versionNumber": 1,
  "mainText": "ФЕСТИВАЛЬ ТЕАТРА",
  "texts": {
    "headline": "ФЕСТИВАЛЬ ТЕАТРА",
    "subtitle": "3 дня премьер и встреч",
    "cta": "Билеты на сайте"
  },
  "images": {
    "heroImage": "/media/photos/uploads/hero_saved.jpg",
    "speakerImage": "/media/photos/uploads/speaker_saved.jpg",
    "galleryImage": "/media/photos/uploads/gallery_saved.jpg"
  },
  "templateId": "festival_collage",
  "resultWebp": "/media/photos/renders/result.webp",
  "resultPng": "/media/photos/renders/result.png",
  "inputSchema": {
    "texts": [
      { "key": "headline", "required": true },
      { "key": "subtitle", "required": true },
      { "key": "cta", "required": true }
    ],
    "images": [
      { "key": "heroImage", "required": true },
      { "key": "speakerImage", "required": true },
      { "key": "galleryImage", "required": true }
    ]
  }
}
```

### Если нужно только перегенерировать без новых файлов

Frontend может отправить обычный JSON:

```json
{
  "texts": {
    "headline": "ФЕСТИВАЛЬ ТЕАТРА",
    "subtitle": "Обновлённый подзаголовок",
    "cta": "Регистрация открыта"
  }
}
```

Если какие-то image-slot'ы не переданы повторно, backend возьмёт предыдущие значения.

---

## 8. Legacy-способ: отдельный upload endpoint

### Формат

`multipart/form-data`

Поле:

- `file`

### Response

```json
{
  "fileId": "aabbccdd11223344.jpg",
  "url": "/media/photos/uploads/aabbccdd11223344.jpg",
  "relativePath": "photos/uploads/aabbccdd11223344.jpg"
}
```

### Как использовать при нескольких image-slot'ах

Этот endpoint остаётся рабочим, но теперь нужен только если frontend хочет:

- заранее загрузить фото отдельным шагом;
- переиспользовать уже загруженный `relativePath`;
- или строить flow в два этапа.

Пример:

```json
{
  "heroImage": "photos/uploads/file1.jpg",
  "speakerPhoto": "photos/uploads/file2.jpg"
}
```

---

## 9. Сгенерировать изображение JSON-способом

### Endpoint

`PATCH /api/photos/sessions/{sessionId}/`

### Актуальный формат запроса

```json
{
  "texts": {
    "headline": "ПРЕМЬЕРА НЕДЕЛИ"
  },
  "images": {
    "heroImage": "photos/uploads/aabbccdd11223344.jpg"
  }
}
```

### Если нужно сменить шаблон в рамках сессии

```json
{
  "templateId": "poster_dark_v2",
  "texts": {
    "headline": "ПРЕМЬЕРА НЕДЕЛИ"
  },
  "images": {
    "heroImage": "photos/uploads/aabbccdd11223344.jpg"
  }
}
```

### Legacy-совместимость

Backend пока ещё понимает:

```json
{
  "mainText": "ПРЕМЬЕРА НЕДЕЛИ",
  "sourceImageUrl": "photos/uploads/aabbccdd11223344.jpg"
}
```

Но frontend лучше использовать новый формат `texts/images`.

### Response

```json
{
  "versionNumber": 1,
  "mainText": "ПРЕМЬЕРА НЕДЕЛИ",
  "texts": {
    "headline": "ПРЕМЬЕРА НЕДЕЛИ"
  },
  "images": {
    "heroImage": "/media/photos/uploads/aabbccdd11223344.jpg"
  },
  "templateId": "poster_dark",
  "resultWebp": "/media/photos/renders/result.webp",
  "resultPng": "/media/photos/renders/result.png",
  "inputSchema": {
    "texts": [
      {
        "key": "headline",
        "label": "Заголовок",
        "required": true,
        "maxLength": 200
      }
    ],
    "images": [
      {
        "key": "heroImage",
        "label": "heroImage",
        "required": true,
        "crop": "cover",
        "gravity": "center"
      }
    ]
  }
}
```

---

## 10. Получить историю и текущие данные сессии

### Endpoint

`GET /api/photos/sessions/{sessionId}/`

### Что приходит

- данные сессии;
- текущий шаблон;
- текущие `texts`;
- текущие `images`;
- `inputSchema`;
- история вариантов.

Это нужно для:

- экрана редактирования уже созданной карточки;
- повторной генерации;
- показа предыдущих результатов.

---

## 11. Скачать готовое изображение

### Для превью

Frontend может просто показать:

- `resultWebp`

### Для скачивания

Нужно брать имя файла из `resultPng` и вызывать:

`GET /api/photos/download/{filename}`

Пример:

- если `resultPng = "/media/photos/renders/abc12345.png"`
- то download endpoint:
  `GET /api/photos/download/abc12345.png`

---

## Что уже поддерживается сервером по вашему вопросу

### Поддерживается

- создание шаблонов внутри пустого брендбука;
- хранение файлов каждого шаблона отдельно;
- обновление конкретного шаблона с файлами;
- флаг `replaceAssets`, чтобы очистить старые ассеты шаблона перед новой загрузкой;
- получение полного template detail;
- получение runtime `inputSchema`;
- генерация через несколько `texts` и несколько `images`;
- один multipart-запрос на генерацию, где тексты и несколько фото уходят вместе.

### Пока не поддерживается в явном виде

- отдельный endpoint "создать пустой брендбук";
- `PUT` для шаблона, есть `PATCH`;
- тонкое удаление отдельных старых ассетов через список флагов пофайлово;
- специальный upload endpoint именно для template assets с отдельной жизнью вне create/update template запроса.

---

## Практическая рекомендация frontend

Для редактора шаблонов safest flow такой:

1. Создать `Theatre`.
2. При создании шаблона всегда отправлять весь template manifest.
3. Вместе с ним отправлять все файлы, на которые manifest ссылается.
4. При полном пересохранении шаблона отправлять `replaceAssets=true`.
5. Для пользовательской генерации всегда строить форму из `inputSchema`.
6. Для генерации использовать только `texts` и `images`, не legacy-поля.
