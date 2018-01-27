const AISTATE = {
  IDLE: 'idle',
  THINKING: 'thinking',
  MOVING: 'moving',
  ORBITING: 'orbiting',
  FLEEING: 'fleeing',
}
class AIShip extends Ship {
  constructor(opts = {}) {
    Object.assign(opts, {
      id: opts.id || `s-${Math.random().toString().substr(3, 5)}`,
    });
    super(opts);
    // Make some AI stuff happen
    this._aiState = AISTATE.IDLE;
  }
  update() {
    super.update();
    switch (this._aiState) {
      case AISTATE.IDLE:
        // Do something instead of chill
        this.orbit(this.findTarget());
        this._aiState = AISTATE.MOVING;
        break;
      case AISTATE.MOVING:
        if (this._state === SHIPSTATE.ORBITING) {
          this._aiState = AISTATE.ORBITING;
        }
        break;
      default:
        // unhandled
        break;
    }
  }
  findTarget() {
    // Find a random target to go hang out in
    // Never target the player or another ship
    let possibleTargets = gameobjects.filter(go => this.filterTargetFunc(go)).concat();
    if (this._orbitTarget) {
      possibleTargets = gameobjects.filter(go => go.id.toLowerCase() !== this._orbitTarget.toLowerCase());
    }
    const target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
    return target;
  }
  filterTargetFunc(go) {
    return go.id !== player.id && !(go instanceof Ship) && go.system == this.system;
  }
}
class VillainShip extends AIShip {
  constructor(opts = {}) {
    Object.assign(opts, {
      id: opts.id || 'villain',
    });
    super(opts);
  }
}
