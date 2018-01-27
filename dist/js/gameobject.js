class GameObject {
  get sprite() {
    return this._sprite;
  }
  get pos() {
    return this.sprite.position;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
  }
  get size() {
    return this._size;
  }
  constructor(opts = {}) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this._size = opts.size || 1;
  }
  update(delta) {
    if (this._sprite) {
      this._sprite.position.set(this.x, this.y);
    }
  }
  render() {
    if (ENV.debug && this._sprite) {
      game.debug.body(this._sprite);
    }
  }
  destroy() {
    if (this._sprite) {
      this._sprite.destroy();
    }
  }
}
class GfxGameObject extends GameObject {
  get primaryColor() {
    return Phaser.Color.WHITE;
  }
  get secondaryColor() {
    return Phaser.Color.WHITE;
  }
  constructor(opts) {
    super(opts);
    var gfx = game.add.graphics(0, 0);
    this.fillGfx(gfx);
    this._sprite = gfx;
    this._sprite.anchor.x = this._sprite.anchor.y = 0.5;
  }
}
