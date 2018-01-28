const UI_STYLE = {
  font: 'Audiowide',
  fontWeight: 'bold',
  fontSize: FONTSIZE.NORMAL,
  stroke: '#000000',
  strokeThickness: 1,
  fill: '#43d637',
};
class UIController {
  constructor() {
    const upperRight = game.add.graphics(0, 0);
    this._planetsText = game.add.text(-180, 0, '', UI_STYLE);
    this._starsText = game.add.text(-300, 0, '', UI_STYLE);
    this._systemInfo = game.add.text(-500, 0, '', UI_STYLE);
    this._upperRight = upperRight;
    upperRight.position.x = game.camera.view.right;
    upperRight.addChild(this._planetsText);
    upperRight.addChild(this._starsText);
    upperRight.addChild(this._systemInfo);
    upperRight.fixedToCamera = true;

    this._suspectPlanets = {};
    setTimeout(() => this.registerPlayer(), 125);
    setTimeout(() => this.registerVillain(), 125);
  }
  registerPlayer(attempts = 0) {
    if (!player) {
      setTimeout(() => this.registerplayer(attempts + 1), 250);
    } else {
      // register signals with the player
      log('Player registered with UI');
      player._signals.onPlayerScanSuccess.add(this.handlePlayerScanSuccess, this);
      player._signals.onPlayerGoalChange.add(this.handlePlayerGoalChange, this);
    }
  }
  registerVillain(attempts = 0) {
    if (!villain) {
      setTimeout(() => this.registerVillain(attempts + 1), 250);
    } else {
      // register signals with the villain
      log('Villain registered with UI');
      villain._signals.onClockNotify.add(this.onVillainClockNotify, this);
      villain._signals.onVillainComplete.add(this.onVillainCompleteNotify, this);
    }
  }
  handlePlayerGoalChange(progress, total) {
    log(sprintf('Player goal: %s/%s', progress, total));
  }
  handlePlayerScanSuccess(planets) {
    console.log('HANDLING SCANNED PLAYER SUCCESS:', planets);
    planets.forEach(planet => this._suspectPlanets[planet.id] = planet);
    this.updatePlanetText();
  }
  onVillainClockNotify(message) {
    log(sprintf('UI: Villain progress: %s', message));
  }
  onVillainCompleteNotify() {
    log('UI: Villain completed mission');
  }
  updatePlanetText() {
    const suspectPlanetsStr = Object.keys(this._suspectPlanets).join('\n');
    const _otherPlanets = planets.filter(p => p.system === currentSystem && !this._suspectPlanets[p.id]);
    this._planetsText.setText(sprintf('Clue Planets:\n%s\nSystem Planets:\n%s', suspectPlanetsStr, _otherPlanets.map(pData => pData.id).join('\n')));
  }
  updateSystemData(systemId) {
    const systemData = LEVEL_DATA.systems[systemId];
    this._systemData = systemData;
    this.updatePlanetText();
    this._starsText.setText(sprintf('Stars:\n%s', systemData.stars.map(sData => sData.id).join('\n')));
    let sysInfo = sprintf('Current system:\n%s', systemData.name);
    // Glorious UI programming
    const otherSystems = Object.keys(LEVEL_DATA.systems).filter(sKey => sKey !== systemId).map(sKey => LEVEL_DATA.systems[sKey].name);
    sysInfo += sprintf('\nOther systems:\n%s', otherSystems.join('\n'));
    this._systemInfo.setText(sysInfo);
  }
  update() {}
  render() {

  }
}
