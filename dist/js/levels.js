const FONTSIZE = {
  TINY: 10,
  SMALL: 14,
  NORMAL: 18,
  LARGE: 24,
};

function rndOffset() {
  return Math.random() * Math.PI * 2;
}

const LEVEL_DATA = {
  systems: {
    system1: {
      name: 'S01A',
      stars: [{
        id: '0xA01',
        size: 150,
      }],
      planets: [{
        orbitTarget: 'star|0xA01',
        orbitRange: 900,
        offset: rndOffset(),
        id: 'AX01',
      }, {
        orbitTarget: 'star|0xA01',
        orbitRange: 300,
        offset: rndOffset(),
        id: 'AX02',
      }, {
        orbitTarget: 'star|0xA01',
        orbitRange: 450,
        offset: rndOffset(),
        id: 'AX03',
      }, {
        orbitTarget: 'planet|AX02',
        orbitRange: 50,
        size: 15,
        fontProps: {
          fontSize: FONTSIZE.TINY,
        },
        offset: rndOffset(),
        id: 'AX02a',
      }],
      playerPrimary: 'star|0xA01',
    },
    system2: {
      name: 'S02B',
      stars: [{
        id: '1bC05',
        size: 250,
      }],
      planets: [{
        orbitTarget: 'star|1bC05',
        orbitRange: 150,
        offset: rndOffset(),
        id: 'CX23'
      }, {
        orbitTarget: 'star|1bC05',
        orbitRange: 350,
        size: 25,
        offset: rndOffset(),
        id: 'CX33'
      }, {
        orbitTarget: 'planet|CX23',
        orbitRange: 50,
        size: 10,
        offset: rndOffset(),
        id: 'CX23b'
      }, {
        orbitTarget: 'planet|CX23',
        orbitRange: 60,
        size: 14,
        offset: rndOffset(),
        id: 'CX23b'
      }],
      playerPrimary: '',
    },
  },
};

/*
 * System template
   systemId: {
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
          offset: rndOffset() usually,
          id: 'UNIQUE IDENTIFICATION'
        }],
        playerPrimary: '',
      },
 *
 */
