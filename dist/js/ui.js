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
    this._upperRight = upperRight;
    upperRight.position.x = game.camera.view.right;
    upperRight.addChild(this._planetsText);
    upperRight.addChild(this._starsText);
    upperRight.fixedToCamera = true;
  }
  updateSystemData(systemData) {
    this._systemData = systemData;
    this._planetsText.setText(sprintf('Planets:\n%s', systemData.planets.map(pData => pData.id).join('\n')));
    this._starsText.setText(sprintf('Stars:\n%s', systemData.stars.map(sData => sData.id).join('\n')));
  }
  update() {}
  render() {

  }
}
