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
  fillGfx(gfx) {
    gfx.lineStyle(2, this.primaryColor, 0.8);
    gfx.beginFill(this.secondaryColor, 0.1);
    gfx.drawCircle(0, 0, 100);
  }
}
class Star extends GfxGameObject {
  get primaryColor() {
    return Phaser.Color.RED;
  }
  fillGfx(gfx) {
    gfx.lineStyle(3, this.primaryColor, 0.8);
    gfx.beginFill(this.secondaryColor, 0.4);
    gfx.drawCircle(0, 0, 100);
  }
}
