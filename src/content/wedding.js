// All placeholder copy and imagery for the prototype lives here.
//
// Images: every image entry is passed to <Photo>. Add a `src` (an import
// from src/assets or a URL) to show a real photo; without `src`, Photo
// renders a styled gradient placeholder using `tone` and `motif`.
//   tone:  wine | blush | ivory | dusk | gold | mauve
//   motif: arch | sun | couple | none

export const couple = {
  first: 'Sophie',
  second: 'Julian',
}

export const wedding = {
  iso: '2027-08-21',
  short: '21.08.2027',
  dotted: '21 · 08 · 2027',
  day: '21',
  month: 'August',
  year: '2027',
  weekday: 'Saturday',
  venue: 'Château de Lumière',
  region: 'Provence, France',
  rsvpBy: '1 June 2027',
}

export const hero = {
  eyebrow: 'Together with their families',
  image: { tone: 'blush', motif: 'couple', alt: 'Portrait of Sophie and Julian' },
}

export const intro = {
  lead:
    'With full hearts and a little disbelief, we invite you to spend a summer evening in Provence with us — to witness our promises, raise a glass, and dance until the candles burn low.',
  sign: 'Sophie & Julian',
  badge: 'Sophie & Julian · 21 · 08 · 2027 · Provence · ',
  images: {
    main: { tone: 'wine', motif: 'arch', alt: 'Sophie and Julian walking through the vineyard' },
    small: { tone: 'ivory', motif: 'sun', alt: 'Hand-written letter and dried flowers' },
  },
}

export const story = {
  title: ['A love written', 'in chapters'],
  chapters: [
    {
      year: '2019',
      title: 'A borrowed umbrella',
      text: 'A sudden downpour on Rue des Martyrs, one umbrella between two strangers, and two trains missed entirely on purpose.',
      image: { tone: 'dusk', motif: 'arch', alt: 'Rainy Paris street at dusk' },
    },
    {
      year: '2021',
      title: 'Letters across the sea',
      text: 'Two cities, six hours apart. Hundreds of letters, a few too many airport goodbyes, and the quiet certainty that it was worth it.',
      image: { tone: 'ivory', motif: 'sun', alt: 'A bundle of letters tied with ribbon' },
    },
    {
      year: '2025',
      title: 'A question at dawn',
      text: 'On a hill above Gordes, before the lavender fields woke up, Julian finally asked. Sophie said yes before he could finish.',
      image: { tone: 'blush', motif: 'couple', alt: 'Sophie and Julian at sunrise above the lavender fields' },
    },
    {
      year: '2027',
      title: 'And now, forever',
      text: 'This summer we begin our next chapter — and we would love nothing more than to begin it surrounded by you.',
      image: { tone: 'wine', motif: 'arch', alt: 'The chapel doors of Château de Lumière' },
    },
  ],
}

export const gallery = {
  title: 'Frames of us',
  text: 'A few quiet moments from the years that led us here.',
  outro: 'and many more to come…',
  items: [
    { size: 'tall', tone: 'wine', motif: 'arch', caption: 'Golden hour, Luberon', alt: 'Couple portrait at golden hour' },
    { size: 'wide', tone: 'dusk', motif: 'sun', caption: 'The long road south', alt: 'Road through the Provençal hills' },
    { size: 'small', tone: 'gold', motif: 'none', caption: 'Sunday market', alt: 'Flowers at a village market' },
    { size: 'tall', tone: 'blush', motif: 'couple', caption: 'The yes', alt: 'Engagement moment' },
    { size: 'wide', tone: 'mauve', motif: 'arch', caption: 'Summer in Lisbon', alt: 'Evening in Lisbon' },
    { size: 'small', tone: 'ivory', motif: 'sun', caption: 'Letters', alt: 'Letters and a fountain pen' },
    { size: 'tall', tone: 'wine', motif: 'couple', caption: 'Home', alt: 'Sophie and Julian at home' },
  ],
}

export const details = {
  title: ['The day', 'itself'],
  text: 'One long summer day, from the first vows in the chapel to the last dance under the plane trees.',
  events: [
    {
      numeral: 'I',
      title: 'The Ceremony',
      time: '16:00',
      venue: 'Chapelle Saint-Michel',
      address: 'Route des Vignes, Gordes',
      note: 'Kindly be seated by 15:30',
    },
    {
      numeral: 'II',
      title: 'The Dinner',
      time: '19:00',
      venue: 'The Orangery',
      address: 'Château de Lumière',
      note: 'Long tables beneath the plane trees',
    },
    {
      numeral: 'III',
      title: 'The Celebration',
      time: '22:00',
      venue: 'The Courtyard',
      address: 'Château de Lumière',
      note: 'Music, champagne and dancing until late',
    },
  ],
  facts: [
    { label: 'Dress code', text: 'Black tie. Shades of wine, ivory and gold are warmly welcome.' },
    { label: 'Stay', text: 'Rooms are reserved nearby — details follow with your confirmation.' },
    { label: 'Travel', text: 'A shuttle will run from Avignon TGV throughout the day.' },
  ],
}

export const rsvp = {
  title: ['Will you', 'join us?'],
  text: 'Nothing would make our day more complete than having you there. Kindly let us know by 1 June 2027.',
  cta: 'Reply to the invitation',
  letter: {
    line: 'request the pleasure of your company',
    note: 'Kindly reply by 1 June 2027',
  },
}

export const finale = {
  eyebrow: 'Until then, with love',
  footer: 'Experimental prototype · placeholder names, content and imagery',
}
