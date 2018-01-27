const FONTSIZE = {
  TINY: 10,
  SMALL: 14,
  NORMAL: 18,
  LARGE: 24,
};
const LEVEL_DATA = {
  system1: {
    name: 'SYSTEM A',
    stars: [{
      id: '0xA01',
      size: 150,
    }],
    planets: [{
      orbitTarget: 'star|0xA01',
      orbitRange: 900,
      offset: Math.random(),
      id: 'AX01',
    }, {
      orbitTarget: 'star|0xA01',
      orbitRange: 300,
      offset: Math.random(),
      id: 'AX02',
    }, {
      orbitTarget: 'planet|AX02',
      orbitRange: 50,
      size: 15,
      fontProps: {
        fontSize: FONTSIZE.TINY,
      },
      offset: Math.random(),
      id: 'BX02',
    }],
  },
  playerPrimary: 'star|0xA01',
}
