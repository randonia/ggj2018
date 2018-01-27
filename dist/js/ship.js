const SHIPSTATE = {
  IDLE: 'idle',
  TRAVELING: 'travel',
  ORBITING: 'orbit',
}
class Ship extends GfxGameObject {
  get orbitRangeSqr() {
    return (this._primary) ? Math.pow(this._primary.size, 2) : 150;
  }
  get orbitRange() {
    return (this._primary) ? this._primary.size : 100;
  }
  get speed() {
    return this._speed;
  }
  get orbitSpeed() {
    return 10 / this._primary.size;
  }
  constructor(opts = {}) {
    Object.assign(opts, {
      size: opts.size || 10,
    });
    super(opts);
    this._dir = new Phaser.Point();
    this._speed = 1;
  }
  fillGfx(gfx) {
    const shapePath = this._getShape();
    gfx.lineStyle(1, this.primaryColor, 1);
    gfx.beginFill(this.secondaryColor, 0.5);
    gfx.drawPolygon(shapePath);
  }
  _getShape() {
    return [
      new Phaser.Point(0, 0),
      new Phaser.Point(-0.5, 0.5),
      new Phaser.Point(0, -1),
      new Phaser.Point(0.5, 0.5),
      new Phaser.Point(0, 0),
    ].map(item => item.multiply(20, 20));
  }
  // By name
  target(orbitTarget) {
    this._orbitTarget = orbitTarget;
    // find the primary
    this._primary = gameobjects.filter(go => go.id.toLowerCase() === orbitTarget.toLowerCase())[0];
    this._state = SHIPSTATE.TRAVELING;
  }
  // By object
  orbit(target) {
    this._primary = target;
    this._orbitTarget = target.id;
    this._state = SHIPSTATE.TRAVELING;
  }
  update() {
    super.update();
    switch (this._state) {
      case SHIPSTATE.TRAVELING:
        this._travelUpdate();
        break;
      case SHIPSTATE.ORBITING:
        this._orbitUpdate();
        break;
      default:
        // Must be idling
        break;
    }
  }
  _travelUpdate() {
    const {
      _primary: primary,
      _dir: dirVec,
    } = this;
    if (primary) {
      const sqrMg = Phaser.Math.distanceSq(primary.x, primary.y, this.x, this.y);
      if (sqrMg >= this.orbitRangeSqr) {
        // Keep traveling toward the item
        Phaser.Point.subtract(primary.pos, this.pos, dirVec);
        dirVec.normalize();
      } else {
        // We're done traveling, start orbiting
        this._state = SHIPSTATE.ORBITING;
        this._offset = Math.atan(dirVec.y / dirVec.x);
      }
      this.x += dirVec.x * this.speed;
      this.y += dirVec.y * this.speed;
    } else {
      // Not targeting anything.... idle I guess
      this._state = SHIPSTATE.IDLE;
    }
  }
  _orbitUpdate() {
    const {
      _primary: primary,
      _offset: offset,
    } = this;
    const now = game.time.totalElapsedSeconds() * this.orbitSpeed + (offset || 0);
    const dirVec = new Phaser.Point(Math.cos(now), Math.sin(now));
    dirVec.setMagnitude(this.orbitRange);
    this.x = primary.x + dirVec.x;
    this.y = primary.y + dirVec.y;
    // TODO: Rotate the sprite as a function of perp to the target
  }
  render() {
    super.render();
    const {
      _primary: primary
    } = this;
    if (primary) {
      lineGfx.lineStyle(1, 0x33ff33, 0.3);
      lineGfx.moveTo(this.x, this.y);
      lineGfx.lineTo(primary.x, primary.y);
      lineGfx.endFill();
    }
  }
}
