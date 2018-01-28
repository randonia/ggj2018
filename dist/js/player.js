class Player extends Ship {
  constructor(opts = {}) {
    Object.assign(opts, {
      id: 'player',
    });
    super(opts);
    this._signals = {
      onPlayerChangeSystem: new Phaser.Signal(),
    };
  }
  addIdText(gfx) {
    this._text = game.add.text(0, 0, 'You', TEXT_STYLE);
  }
  registerSignals(signals) {
    signals.onCommandMove.add(this.handleMoveSignal, this);
    signals.onCommandScan.add(this.handleScanSignal, this);
    signals.onCommandWarp.add(this.handleWarpSignal, this);
  }
  unregisterSignals(signals) {
    signals.onCommandMove.remove(this.handleMoveSignal, this);
    signals.onCommandScan.remove(this.handleScanSignal, this);
    signals.onCommandWarp.remove(this.handleWarpSignal, this);
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
  handleWarpSignal(systemId) {
    this.travelToSystem(systemId);
  }
  travelToSystem(systemId) {
    if (super.travelToSystem(systemId)) {
      console.warn('PLAYER TRAVELING TO SYSTEM: ', systemId);
      game.camera.fade(Phaser.Color.AQUA, 1500);
      game.camera.onFadeComplete.add(this._resetFade, this, undefined, systemId);
    } else {
      console.warn('Player not traveling to system!');
    }
  }
  _resetFade(systemId) {
    game.camera.resetFX();
    game.camera.onFadeComplete.remove(this._resetFade, this);
    this._system = systemId;
    this._signals.onPlayerChangeSystem.dispatch(systemId);
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
