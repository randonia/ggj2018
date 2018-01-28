class Player extends Ship {
  constructor(opts = {}) {
    Object.assign(opts, {
      id: 'player',
    });
    super(opts);
    this._scanning = false;
    this._signals = {
      onPlayerChangeSystem: new Phaser.Signal(),
      onPlayerScanSuccess: new Phaser.Signal(),
      onPlayerGoalChange: new Phaser.Signal(),
    };
    this._clueProgress = 0;
    this._clueGoal = Math.round(VILLAIN_GOAL_COUNT / 2);
  }
  addIdText(gfx) {
    this._text = game.add.text(0, 0, 'You', TEXT_STYLE);
  }
  registerSignals(signals) {
    signals.onCommandHack.add(this.handleHackSignal, this);
    signals.onCommandMove.add(this.handleMoveSignal, this);
    signals.onCommandScan.add(this.handleScanSignal, this);
    signals.onCommandWarp.add(this.handleWarpSignal, this);
  }
  unregisterSignals(signals) {
    signals.onCommandHack.remove(this.handleHackSignal, this);
    signals.onCommandMove.remove(this.handleMoveSignal, this);
    signals.onCommandScan.remove(this.handleScanSignal, this);
    signals.onCommandWarp.remove(this.handleWarpSignal, this);
  }
  handleMoveSignal(target) {
    this.orbit(target);
  }
  handleScanSignal() {
    this.scan((result) => {
      console.log('SCAN RESULTS:', result);
      if (result.planets && result.planets.length) {
        // PLANETS WORTH EXPLORING
        this._signals.onPlayerScanSuccess.dispatch(result.planets);
      }
    });
  }
  handleWarpSignal(systemId) {
    this.travelToSystem(systemId);
  }
  handleHackSignal(target) {
    if (!this._primary || this._primary.id !== target.id || this._state != SHIPSTATE.ORBITING) {
      // reject as invalid command
      // TODO: feedback
      console.warn('Invalid');
      return;
    }
    // Start hacking the planet
    const hack = new Hack({
      target,
      owner: this,
    });
    this.registerHack(hack);
    hack.start();
  }
  registerHack(hack) {
    gameobjects.push(hack);
    hack._signals.onHackComplete.add(this.handleOnHackComplete, this);
  }
  unregisterHack(hack) {
    hack._signals.onHackComplete.remove(this.handleOnHackComplete, this);
  }
  handleOnHackComplete(hackData) {
    console.log('Player reporting hack complete', hackData);
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
  scan(callbackFn) {
    if (!callbackFn) {
      console.warn('No callback provided');
      return;
    }
    // Do some pretend stuff for scanning
    console.log('Beginning scan...');
    this._scanning = true;
    setTimeout(() => {
      const visitedPlanets = planets.filter(p => p.system === currentSystem).filter(p1 => {
        const visitors = Object.keys(p1._visitors).map(visitorId => {
          return p1._visitors[visitorId];
        });
        console.log('visitors?', visitors);
        return visitors.filter(v => v).length;
      });
      console.log('planets:', visitedPlanets);
      this._scanning = false;
      callbackFn({
        planets: visitedPlanets,
      });
    }, 1000);
  }
}
