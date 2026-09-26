// Placeholder copy and data for every section of the invitation.
// Section components only render what is here, so the final names,
// dates, texts and photos can be dropped in without touching layout.
//
// Images: add `src` (an import from src/assets or a URL) to an image
// entry to show a real photo; without it <ImageFrame> renders a neutral
// placeholder. Aspect ratios are part of the layout and live in the
// section components.

export const couple = {
  bride: 'Невеста',
  groom: 'Жених',
}

export const wedding = {
  date: '00.00.0000',
  city: 'Город',
}

export const hero = {
  marker: { number: '01', label: 'Intro' },
  eyebrow: 'Приглашение на свадьбу',
  scrollHint: 'Листайте',
  image: { alt: 'Портрет пары' },
}

export const invitation = {
  marker: { number: '02', label: 'Invitation' },
  title: 'Дорогие родные и близкие',
  paragraphs: [
    'Здесь будет текст приглашения. Несколько тёплых предложений о том, как важно для пары разделить этот день с самыми близкими людьми.',
    'Второй абзац — место для деталей: приглашение провести вечер вместе, отметить начало новой семьи и сохранить общие воспоминания.',
  ],
  signature: 'С любовью',
  image: { alt: 'Фотография пары' },
}

export const story = {
  marker: { number: '03', label: 'Our story' },
  title: 'Наша история',
  lead: 'Короткий подзаголовок о том, как всё началось.',
  paragraphs: [
    'Здесь будет рассказ о знакомстве пары: где и когда они встретились, какими были первые впечатления и первые общие планы.',
    'Место для продолжения истории — важные моменты, путешествия и то, как пара пришла к решению пожениться.',
  ],
  images: {
    main: { alt: 'Большая фотография пары' },
    detail: { alt: 'Второе фото' },
  },
}

export const schedule = {
  marker: { number: '04', label: 'Wedding day' },
  title: 'Программа дня',
  lead: 'Здесь будет короткое описание дня и основных моментов праздника.',
  events: [
    { time: '17:00', title: 'Сбор гостей' },
    { time: '17:30', title: 'Церемония' },
    { time: '18:00', title: 'Фотосессия' },
    { time: '18:55', title: 'Начало банкета' },
    { time: '00:00', title: 'Завершение праздника' },
  ],
}

export const location = {
  marker: { number: '05', label: 'Location' },
  title: 'Место проведения',
  venue: {
    name: 'Название площадки',
    address: 'Город, улица, дом',
    description:
      'Здесь будет короткое описание места: атмосфера, как добраться и на что обратить внимание по приезде.',
  },
  // `url` will point to the real map; while it is null the button is inert.
  map: { label: 'Карта', url: null, buttonLabel: 'Посмотреть на карте' },
  image: { alt: 'Фотография площадки' },
}

export const dressCode = {
  marker: { number: '06', label: 'Dress code' },
  title: 'Дресс-код',
  description:
    'Здесь будет описание дресс-кода: общий стиль, пожелания к нарядам и оттенки, которые будут гармонично смотреться на празднике.',
  paletteLabel: 'Палитра',
  // Neutral placeholder tones only, not the final wedding palette.
  palette: [
    { name: 'Тон 01', value: '#ffffff' },
    { name: 'Тон 02', value: '#f1ece4' },
    { name: 'Тон 03', value: '#ddd6cb' },
    { name: 'Тон 04', value: '#bdb5a9' },
    { name: 'Тон 05', value: '#8d877e' },
    { name: 'Тон 06', value: '#45413c' },
  ],
  looks: [
    { alt: 'Образ 01' },
    { alt: 'Образ 02' },
    { alt: 'Образ 03' },
    { alt: 'Образ 04' },
  ],
}

export const details = {
  marker: { number: '07', label: 'Details' },
  title: 'Детали',
  lead: 'Важная информация для гостей.',
  items: [
    { title: 'Подарки', text: 'Здесь будет информация о пожеланиях по подаркам.' },
    { title: 'Транспорт', text: 'Здесь будет информация о трансфере и парковке.' },
    { title: 'Размещение', text: 'Здесь будет информация о проживании для гостей.' },
    { title: 'Вопросы', text: 'Здесь будут контакты для связи по любым вопросам.' },
  ],
}

export const rsvp = {
  marker: { number: '08', label: 'RSVP' },
  title: 'Подтвердите присутствие',
  description: 'Здесь будет короткая просьба подтвердить присутствие.',
  deadline: 'Ответ до 00.00.0000',
  fields: {
    name: { label: 'Ваше имя' },
    attendance: {
      legend: 'Вы будете с нами?',
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'К сожалению, нет' },
      ],
    },
    plusOne: {
      legend: 'Будете ли вы с +1?',
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' },
      ],
    },
    companion: { label: 'Имя сопровождающего' },
    comment: { label: 'Комментарий' },
  },
  submitLabel: 'Отправить',
}

export const finale = {
  marker: { number: '09', label: 'Finale' },
  title: 'Будем ждать вас!',
  image: { alt: 'Фотография пары' },
}
