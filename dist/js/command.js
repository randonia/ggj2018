class Command {
  constructor() {
    log('Command console online');
    this.signals = {
      onCommand: new Phaser.Signal(),
      onKeyPressed: new Phaser.Signal(),
    }
    this._message = '';
    this._cursor = NaN;

    this._signals = {
      // Dispatches a move command
      onCommandHack: new Phaser.Signal(),
      onCommandMove: new Phaser.Signal(),
      onCommandScan: new Phaser.Signal(),
      onCommandWarp: new Phaser.Signal(),
    };

    game.input.keyboard.onPressCallback = (k, e) => this.handleKeyPress(k, e);
    // Handle special keys
    this._keys = {
      BACKSPACE: game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE),
      LEFT: game.input.keyboard.addKey(Phaser.KeyCode.LEFT),
      RIGHT: game.input.keyboard.addKey(Phaser.KeyCode.RIGHT),
      UP: game.input.keyboard.addKey(Phaser.KeyCode.UP),
      DOWN: game.input.keyboard.addKey(Phaser.KeyCode.DOWN),
      SPACEBAR: game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR),
      ENTER: game.input.keyboard.addKey(Phaser.KeyCode.ENTER),
      TAB: game.input.keyboard.addKey(Phaser.KeyCode.TAB),
    };
    Object.keys(this._keys).forEach(keyKey => this._keys[keyKey].onDown.add(this.handleKeySignal, this));
    // Ensure the player exists before registering
    setTimeout(() => this.registerPlayer(), 125);
  }
  registerPlayer(attempts = 0) {
    if (attempts > 5) {
      console.error('Could not register player to command interface');
      return;
    }
    if (player) {
      // Do registering of signals
      log('registering player with command interface');
      player.registerSignals(this._signals);
    } else {
      setTimeout(() => this.registerPlayer(attempts + 1), 250);
    }
  }
  // Specific handler for _keys registered inputs
  handleKeySignal(signal) {
    this.handleKeyPress(signal.event);
  }
  /**
   * Generic key handler for all keys. Accepts phaser signals and keypress events
   */
  handleKeyPress(kEvent) {
    switch (kEvent.keyCode) {
      case Phaser.KeyCode.BACKSPACE:
        this.deleteChar();
        break;
      case Phaser.KeyCode.LEFT:
      case Phaser.KeyCode.RIGHT:
      case Phaser.KeyCode.UP:
      case Phaser.KeyCode.DOWN:
        console.warn('CMD NAV NOT IMPLEMENTED');
        break;
      case Phaser.KeyCode.SPACEBAR:
        this.addTextToCommand(' ');
        break;
      case Phaser.KeyCode.ENTER:
        this.submitCommand();
        break;
      case Phaser.KeyCode.TAB:
        console.warn('CMD AUTOCOMPLETE NOT IMPLEMENTED');
        break;
      default:
        this.addTextToCommand(kEvent);
        break;
    }
  }
  submitCommand() {
    log(`SUBMITTING COMMAND: [${this._message}]`);
    const [command, ...params] = this._message.split(' ');
    switch (command) {
      case 'h':
      case 'hack':
        this.commandHack(params);
        break;
      case 'mv':
      case 'move':
        this.commandMove(params);
        break;
      case 's':
      case 'scan':
        this.commandScan(params);
        break;
      case 'w':
      case 'warp':
        this.commandWarp(params);
        break;
      default:
        console.warn(sprintf('Unhandled command: %s [%s]', command, params));
        break;
    }
    this._message = '';
  }
  commandWarp(params) {
    if (params.length !== 1) {
      console.warn('params are wrong', params);
      return;
    }
    const systemName = params[0].trim().toLowerCase();
    const systemKey = Object.keys(LEVEL_DATA.systems).filter((sysKey) => {
      return LEVEL_DATA.systems[sysKey] && LEVEL_DATA.systems[sysKey].name.trim().toLowerCase() === systemName;
    })[0];
    if (systemKey) {
      this._signals.onCommandWarp.dispatch(systemKey);
    } else {
      console.warn('Invalid system id');
    }
  }
  commandHack(params) {
    const {
      target
    } = this._handleFindByIdCommand(params);
    if (!target) {
      console.warn('Invalid target id:', params);
    } else {
      console.log('Submitting hack');
      this._signals.onCommandHack.dispatch(target);
    }
  }
  commandMove(params) {
    const {
      target
    } = this._handleFindByIdCommand(params);
    if (!target) {
      console.warn('Invalid target id:', params);
    } else {
      this._signals.onCommandMove.dispatch(target);
    }
  }
  commandScan(params) {
    this._signals.onCommandScan.dispatch();
  }
  _handleFindByIdCommand(params) {
    if (params.length !== 1) {
      console.warn('params are wrong', params);
      return {};
    }
    const targetId = params[0];
    const target = gameobjects.filter(go => go.id.toLowerCase() === targetId.toLowerCase())[0];
    return {
      target
    };
  }
  deleteChar(wholeWord = false) {
    if (wholeWord) {
      this._message = this._message.substr(0, this._message.length - 1);
      console.warn('NOT IMPLEMENTED: deleteChar(wholeWord)');
    } else {
      this._message = this._message.substr(0, this._message.length - 1);
    }
  }
  addTextToCommand(char) {
    this._message += char;
  }
  update() {

  }
  render() {
    game.debug.text(sprintf('$: %s', convert(this._message)), 100, HEIGHT - 50);
  }
}
