class Player extends Ship {
  constructor(opts = {}) {
    Object.assign(opts, {
      id: 'player',
    });
    super(opts);
  }
  addIdText(gfx) {
    this._text = game.add.text(0, 0, 'You', TEXT_STYLE);
  }
  registerSignals(signals) {
    signals.onCommandMove.add(this.handleMoveSignal, this);
  }
  unregisterSignals(signals) {
    signals.onCommandMove.remove(this.handleMoveSignal, this);
  }
  handleMoveSignal(target) {
    this.orbit(target);
  }
}
