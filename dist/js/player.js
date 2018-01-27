class Player extends Ship {
  addIdText(gfx) {
    this._text = game.add.text(this.x, this.y, '', TEXT_STYLE);
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
