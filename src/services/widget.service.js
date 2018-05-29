const skyTextures = [
  'https://storage.googleapis.com/sss-craft-folio-gotchi/widgets/sky/sky_1.jpg',
  'https://storage.googleapis.com/sss-craft-folio-gotchi/widgets/sky/sky_2.jpg',
];

const groundTextures = [
  'https://storage.googleapis.com/sss-craft-folio-gotchi/widgets/ground/grass.jpg',
  'https://storage.googleapis.com/sss-craft-folio-gotchi/widgets/ground/rock.png',
  'https://storage.googleapis.com/sss-craft-folio-gotchi/widgets/ground/sand.jpg',
];

const outdoor = [
  {
    url: 'https://storage.googleapis.com/sss-craft-folio-gotchi/widgets/outdoor/cefetmg.jpg',
    clickAction: 'http://www.cefetmg.br/',
  },
  {
    url: 'https://storage.googleapis.com/sss-craft-folio-gotchi/widgets/outdoor/github.png',
    clickAction: 'https://github.com/SoSistemasSistemas',
  },
  {
    url: 'https://storage.googleapis.com/sss-craft-folio-gotchi/widgets/outdoor/google.jpg',
    clickAction: 'https://www.google.com.br/',
  },
];

const console = {
  backgroundColor: '515151',
  textColor: 'FFEB3B',
  height: 60,
};

const signPlaque = {
  text: 'Seja muito bem-vindo ao meu mundo!',
};

exports.getDefaultWidgets = () => ({
  skyTextures: skyTextures.map((url, index) => ({
    url,
    active: index === 0,
  })),
  groundTextures: groundTextures.map((url, index) => ({
    url,
    active: index === 0,
  })),
  outdoor,
  console,
  signPlaque,
});
