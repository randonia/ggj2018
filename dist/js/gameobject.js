class GameObject {
  get sprite() {
    return this._sprite;
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
