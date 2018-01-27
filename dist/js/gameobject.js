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
  get system() {
    return this._system;
  }
  set system(value) {
    this._system = value;
  }
  constructor(opts = {}) {
    this.id = opts.id || Math.random().toString().substr(2);
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this._size = opts.size || 1;
    this._fontProps = opts.fontProps || {};
    this._system = opts.system;
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
const TEXT_STYLE = {
  font: 'Audiowide',
  fontSize: FONTSIZE.NORMAL,
  stroke: '#000000',
  strokeThickness: 3,
  fill: '#43d637',
};
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
    // Set the text
    this.addIdText(gfx);
    gfx.addChild(this._text);
    this._sprite = gfx;
    this._sprite.anchor.x = this._sprite.anchor.y = 0.5;
  }
  addIdText(gfx) {
    this._text = game.add.text(this.x, this.y, this.id, Object.assign({}, TEXT_STYLE, this._fontProps));
  };
}
