var gameobjects;
var planets;
var stars;
var lineGfx;
/**
 * Base state class
 **/
class GameState {
  preload() {}
  create() {
    lineGfx = game.add.graphics(0, 0);
    game.world.setBounds(-2 * WIDTH, -2 * HEIGHT, 2 * WIDTH, 2 * HEIGHT);
    game.camera.setSize(WIDTH / 2, HEIGHT / 2);
    game.camera.setPosition(0, 0);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.disableVisibilityChange = true;
    this._gameobjects = [];
    this._planets = [];
    this._stars = [];
    gameobjects = this._gameobjects; // Take this out after dev
    planets = this._planets; // Take this out after dev
    stars = this._stars; // Take this out after dev
    const star1 = this._createStar();
    this._createPlanet({
      orbitTarget: star1,
      orbitRange: 900,
      offset: Math.random(),
      speed: Math.random(),
    });
    this._createPlanet({
      orbitTarget: star1,
      orbitRange: 300,
      offset: Math.random(),
      speed: Math.random(),
    });
  }
  _createPlanet(opts = {}) {
    const p = new Planet(opts);
    this._planets.push(p);
    return p;
  }
  _createStar(opts = {}) {
    const s = new Star(opts);
    this._stars.push(s);
    return s;
  }
  update() {
    gameobjects.forEach(go => go.update());
    planets.forEach(planet => planet.update());
  }
  render() {
    lineGfx.clear();
    gameobjects.forEach(go => go.render());
    planets.forEach(planet => planet.render());
    const line = new Phaser.Line(0, 0, 0, 0);
    game.debug.cameraInfo(game.camera, 32, 32);

    // Draw each planet to each other planet
    for (var pAIdx = 0; pAIdx < planets.length; pAIdx++) {
      const planetA = planets[pAIdx];
      for (var pBIdx = 0; pBIdx < planets.length; pBIdx++) {
        const planetB = planets[pBIdx];
        if (planetA === planetB) {
          continue;
        }
        line.fromSprite(planetA.sprite, planetB.sprite);
        lineGfx.lineStyle(1, 0xffffff, 0.2);
        lineGfx.moveTo(line.start.x, line.start.y);
        lineGfx.lineTo(line.end.x, line.end.y);
        lineGfx.endFill();
      }
    }

  }
}
