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
    signals.onCommandScan.add(this.handleScanSignal, this);
  }
  unregisterSignals(signals) {
    signals.onCommandMove.remove(this.handleMoveSignal, this);
    signals.onCommandScan.remove(this.handleScanSignal, this);
  }
  handleMoveSignal(target) {
    this.orbit(target);
  }
  handleScanSignal(target) {
    this.scan(target, (result) => {
      console.log('SCAN RESULTS:', result);
      switch (result.status) {
        case 'success':
          console.log('Found a clue');
          break;
        case 'failure':
          console.log('Alerted the villain');
          break;
        case 'nothing':
          break;
      }
    });
  }
  // Must provide a callback fn
  scan(target, callbackFn) {
    if (!callbackFn) {
      console.warn('No callback provided');
      return;
    }
    // Do some pretend stuff for scanning
    console.log('Beginning scan of ', target);
    setTimeout(() => {
      callbackFn({
        target,
        status: 'success'
      });
    }, 1000);
  }
}
