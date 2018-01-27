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
    game.physics.arcade.enable(this.sprite);
  }
}
class Planet extends GfxGameObject {
  /**
      Options for a planet:
        orbitTarget: sprite to orbit
        orbitRange: how far to orbit the object
        offset: a static offset in orbit
    */
  constructor(opts) {
    Object.assign(opts, {
      size: opts.size || 50, // default size is 50
    });
    super(opts);
    this._orbitTarget = opts.orbitTarget || undefined;
    this._orbitRange = opts.orbitRange || 1;
    this._offset = opts.offset || 0;
    this._speed = Math.sqrt(1 / this._orbitRange);
  }
  fillGfx(gfx) {
    gfx.lineStyle(2, this.primaryColor, 0.8);
    gfx.beginFill(this.secondaryColor, 0.1);
    gfx.drawCircle(0, 0, this._size);
  }
  update() {
    super.update();
    const {
      _orbitTarget: primary,
      _orbitRange: distance,
      _offset: offset,
      _speed: speed,
    } = this;
    if (primary) {
      // Calculate this position in orbit
      // TODO: Offset time so they're not all the same
      const now = game.time.totalElapsedSeconds() * speed + offset;
      const dirVec = new Phaser.Point(Math.cos(now), Math.sin(now));
      dirVec.setMagnitude(this._orbitRange);
      this.x = primary.x + dirVec.x;
      this.y = primary.y + dirVec.y;
    }
  }
  render() {
    super.render();
    const {
      _orbitTarget: primary,
    } = this;
    if (primary) {
      lineGfx.lineStyle(1, Phaser.Color.YELLOW, 0.2);
      lineGfx.moveTo(this.x, this.y);
      lineGfx.lineTo(primary.x, primary.y);
      lineGfx.endFill();
    }
  }
}
class Star extends GfxGameObject {
  get primaryColor() {
    return Phaser.Color.RED;
  }
  get secondaryColor() {
    return Phaser.Color.YELLOW;
  }
  fillGfx(gfx) {
    gfx.lineStyle(5, this.primaryColor, 0.8);
    gfx.beginFill(this.secondaryColor, 0.8);
    gfx.drawCircle(0, 0, 100);
  }
}
