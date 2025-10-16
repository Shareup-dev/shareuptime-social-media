export default [
  {
    name: 'star',
    emoji: '⭐',
    img: require('../assets/emoji/star.gif'),
  },
  {
    name: 'laugh',
    emoji: '😂',
    img: require('../assets/emoji/laughing.gif'),
  },
  {
    name: 'love',
    img: require('../assets/emoji/love.gif'),
    emoji: '❤️',
  },
  {
    name: 'cry',
    img: require('../assets/emoji/crying.gif'),
    emoji: '😭',
  },
  {
    name: 'angry',
    img: require('../assets/emoji/angry.gif'),
    emoji: '😡',
  },
  // {
  //   name: 'celebrate',
  //   img: require('../assets/emoji/celebrate.gif'),
  //   emoji: '🥳',
  // },
  // {
  //   name: 'smiley',
  //   img: require('../assets/emoji/smiley.gif'),
  //   emoji: '☺️',
  // },
  {
    name: 'wow',
    img: require('../assets/emoji/wow.gif'),
    emoji: '😮',
  },
];

export const findEmoji = (name) => {
  switch (name) {
    case 'laugh':
      return '😂';
    case 'love':
      return '❤️';
    case 'wow':
      return '😮';
    case 'cry':
      return '😭';
    case 'angry':
      return '😡';
    case 'smiley':
      return '☺️';
    case 'celebrate':
      return '🥳';

    case 'star':
      return '⭐';
    default:
      '⭐';
  }
};
