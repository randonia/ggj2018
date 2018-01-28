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
    this._planetsText = game.add.text(-100, 0, '', UI_STYLE);
    this._starsText = game.add.text(-200, 0, '', UI_STYLE);
    this._systemInfo = game.add.text(-375, 0, '', UI_STYLE);
    this._upperRight = upperRight;
    upperRight.position.x = game.camera.view.right;
    upperRight.addChild(this._planetsText);
    upperRight.addChild(this._starsText);
    upperRight.addChild(this._systemInfo);
    upperRight.fixedToCamera = true;

    setTimeout(() => this.registerVillain(), 125);
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
  onVillainClockNotify(message) {
    log(sprintf('UI: Villain progress: %s', message));
  }
  onVillainCompleteNotify() {
    log('UI: Villain completed mission: %s');
  }
  updateSystemData(systemData) {
    this._systemData = systemData;
    this._planetsText.setText(sprintf('Planets:\n%s', systemData.planets.map(pData => pData.id).join('\n')));
    this._starsText.setText(sprintf('Stars:\n%s', systemData.stars.map(sData => sData.id).join('\n')));
    this._systemInfo.setText(sprintf('Current system:\n%s', systemData.name));
  }
  update() {}
  render() {

  }
}
