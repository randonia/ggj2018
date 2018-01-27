const FONTSIZE = {
  TINY: 10,
  SMALL: 14,
  NORMAL: 18,
  LARGE: 24,
};
const LEVEL_DATA = {
  systems: {
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
        orbitTarget: 'star|0xA01',
        orbitRange: 450,
        offset: Math.random(),
        id: 'AX03',
      }, {
        orbitTarget: 'planet|AX02',
        orbitRange: 50,
        size: 15,
        fontProps: {
          fontSize: FONTSIZE.TINY,
        },
        offset: Math.random(),
        id: 'AX02a',
      }],
      playerPrimary: 'star|0xA01',
    },
    system2: {
      name: 'SYSTEM B',
      stars: [{
        id: '1bC05',
        size: 250,
      }],
      planets: [{
        orbitTarget: 'star|1bC05',
        orbitRange: 150,
        offset: Math.random(),
        id: 'CX23'
      }],
      playerPrimary: '',
    },
  },
};

/*
 * System template
   systemID: {
        name: SYSTEMDISPLAYNAME,
        stars: [{
          id: '0xA01',
          size: 150,
        }],
        planets: [{
          orbitTarget: 'type|ID',
          orbitRange: integer,
          size: integer (optional),
          fontProps: {
            font text properties (optional),
          },
          offset: Math.random() usually,
          id: 'UNIQUE IDENTIFICATION'
        }],
        playerPrimary: '',
      },
 *
 */
