const HACKSTYLE = {
  font: 'Audiowide',
  fontWeight: 'bold',
  fontSize: FONTSIZE.NORMAL,
  stroke: '#000000',
  strokeThickness: 4,
  fill: '#43d637',
};
class Hack extends GameObject {
  constructor(opts = {}) {
    super(opts);
    this._target = opts.target;
    this.x = opts.target.x;
    this.y = opts.target.y;
    this._signalReceiver = opts.owner;
    this.isUI = true;
    this._duration = 5000; // all hacks last 5 seconds
    this._signals = {
      onHackComplete: new Phaser.Signal(),
    };
    this._sprite = game.add.graphics();

    this._progressText = game.add.text(0, 0, '', HACKSTYLE);
    this._sprite.addChild(this._progressText);
  }
  start() {
    console.info('Hack started');
    this._started = true;
    this._startTime = game.time.time;
  }
  update() {
    super.update();
    this.x = this._target.x;
    this.y = this._target.y;
    if (this._ended) {
      return;
    }
    if (this._started) {
      const elapsed = game.time.time - this._startTime;
      const percentComplete = elapsed / this._duration * 100;
      this._progressText.setText(sprintf('Hacking.....%s%%', (Math.min(100, percentComplete).toFixed(2))));
      console.log(sprintf('Hack remaining: %s%%', percentComplete));
      this._complete = this._startTime + this._duration < game.time.time;
    }
    if (this._complete) {
      // Hack completed
      this._signals.onHackComplete.dispatch({
        success: true,
        target: this._target,
      });
      this.cleanUp();
    }
  }
  cleanUp() {
    console.log('Cleaning up hack');
    this._ended = true;

    this._textTween = game.add.tween(this._sprite).to({
      alpha: 0
    }, 350, 'Linear', true);
    setTimeout(() => {
      this._textTween.stop();
      this._sprite.destroy();
      this._sprite = undefined;
    }, 2000);
  }
  render() {}
}
