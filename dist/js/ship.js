const SHIPSTATE = {
  IDLE: 'idle',
  TRAVELING: 'travel',
  ORBITING: 'orbit',
}
class Ship extends GfxGameObject {
  get orbitRangeSqr() {
    return (this._orbitTarget) ? Math.pow(this._orbitTarget.size, 2) : 150;
  }
  get orbitRange() {
    return (this._orbitTarget) ? this._orbitTarget.size : 100;
  }
  get speed() {
    return this._speed;
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
  orbit(target) {
    this._orbitTarget = target;
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
      _orbitTarget: primary,
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
        dirVec.set(0, 0);
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
      _orbitTarget: primary
    } = this;
    const now = game.time.totalElapsedSeconds() * this.speed;
    const dirVec = new Phaser.Point(Math.cos(now), Math.sin(now));
    dirVec.setMagnitude(this.orbitRange);
    this.x = primary.x + dirVec.x;
    this.y = primary.y + dirVec.y;
  }
  render() {
    super.render();
    const {
      _orbitTarget: primary
    } = this;
    if (primary) {
      lineGfx.lineStyle(1, 0x33ff33, 0.3);
      lineGfx.moveTo(this.x, this.y);
      lineGfx.lineTo(primary.x, primary.y);
      lineGfx.endFill();
    }
  }
}
