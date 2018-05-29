const AVATARS_URLS = [
  'https://storage.googleapis.com/sss-craft-folio-gotchi/avatars/mametchi.png',
  'https://storage.googleapis.com/sss-craft-folio-gotchi/avatars/decoratchi.png',
  'https://storage.googleapis.com/sss-craft-folio-gotchi/avatars/knighttchi.png',
  'https://storage.googleapis.com/sss-craft-folio-gotchi/avatars/tacttchi.png',
  'https://storage.googleapis.com/sss-craft-folio-gotchi/avatars/yumemitchi.png',
];

exports.getAll = () => AVATARS_URLS;
exports.getRandom = () => AVATARS_URLS[Math.floor(Math.random() * AVATARS_URLS.length)];
