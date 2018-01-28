var gameobjects;
var planets;
var stars;
var lineGfx;
var player;
var command;
var UI;
var currentSystem;
var villain;
/**
 * Base state class
 **/
class GameState {
  preload() {}
  create() {
    lineGfx = game.add.graphics(0, 0);
    game.world.setBounds(-2 * WIDTH, -2 * HEIGHT, 4 * WIDTH, 4 * HEIGHT);
    game.camera.setBoundsToWorld();
    game.camera.roundPx = false;

    // Prevent pausing on lose focus
    game.stage.disableVisibilityChange = true;

    this._gameobjects = [];
    this._planets = [];
    this._stars = [];
    gameobjects = this._gameobjects; // Take this out after dev
    planets = this._planets; // Take this out after dev
    stars = this._stars; // Take this out after dev

    player = new Player({
      x: 150,
      y: 25,
    });
    gameobjects.push(player);
    game.camera.follow(player.sprite, undefined, 0.1, 0.1);
    command = new Command();
    UI = new UIController();
    // Construct the entire universe at once
    this.buildGalaxy(LEVEL_DATA);
    // And then load into this our existing system
    this.loadSystem('system1');
    setTimeout(() => villain = this._createVillain(), 250);
  }
  // Load in data from levels.js
  buildGalaxy(allSystems) {
    Object.keys(allSystems.systems).forEach((systemId) => {
      const systemData = allSystems.systems[systemId];
      // First create everything in this system
      systemData.stars.forEach(starData => {
        // Create stars
        this._createStar(Object.assign({}, starData, {
          system: systemId
        }));
      });
      systemData.planets.forEach(planetData => {
        // Create planets
        this._createPlanet(Object.assign({}, planetData, {
          system: systemId
        }));
      });
      // Now go through and set orbits for planets (do this after so planets can orbit other planets)
      this._planets.forEach(planet => {
        // Find the target
        const [targetType, targetId] = planet._orbitTarget.split('|');
        let target;
        switch (targetType) {
          case 'star':
            target = this._stars.filter(otherStar => otherStar.id === targetId)[0];
            break;
          case 'planet':
            target = this._planets.filter(otherPlanet => otherPlanet.id === targetId)[0];
            break;
          default:
            console.warn('Unhandled type:', targetType);
            break;
        }
        if (target) {
          planet.setOrbit(target);
        } else {
          console.warn('No orbit target for ', planet.id);
        }
      });
    });
  }
  loadSystem(systemId) {
    this._currentSystem = currentSystem = systemId;
    player.system = systemId;
    const systemData = LEVEL_DATA.systems[systemId];
    // Update the system data
    UI.updateSystemData(systemData);
    gameobjects.forEach(go => go.sprite.visible = go.system === systemId);
    setTimeout(() => this._createAIShip(), 250);
  }
  _createVillain(opts = {}) {
    const _villain = new VillainShip(Object.assign({}, opts, {system: this._currentSystem}));
    this._gameobjects.push(_villain);
    return _villain;
  }
  _createAIShip(opts = {}) {
    const ship = new AIShip({
      system: this._currentSystem
    });
    this._gameobjects.push(ship);
    return ship;
  }
  _createPlanet(opts = {}) {
    const p = new Planet(opts);
    this._planets.push(p);
    this._gameobjects.push(p);
    return p;
  }
  _createStar(opts = {}) {
    const s = new Star(opts);
    this._stars.push(s);
    this._gameobjects.push(s);
    return s;
  }
  update() {
    gameobjects.forEach(go => go.update());
    command.update();
  }
  render() {
    lineGfx.clear();
    gameobjects.forEach(go => go.render());
    const line = new Phaser.Line(0, 0, 0, 0);
    if (ENV.debug) {
      game.debug.cameraInfo(game.camera, 32, 32);
      game.debug.spriteInfo(player.sprite, 32, 180);
    }
    command.render();
    // Draw each planet to each other planet
    for (var pAIdx = 0; pAIdx < planets.length; pAIdx++) {
      const planetA = planets[pAIdx];
      if (planetA.system !== this._currentSystem) {
        continue;
      }
      for (var pBIdx = 0; pBIdx < planets.length; pBIdx++) {
        const planetB = planets[pBIdx];
        if (planetA === planetB || planetB.system !== this._currentSystem) {
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
