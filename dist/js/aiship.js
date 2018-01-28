const AISTATE = {
  IDLE: 'idle',
  THINKING: 'thinking',
  MOVING: 'moving',
  ORBITING: 'orbiting',
  FLEEING: 'fleeing',
  WARPING: 'warping',
  TASKING: 'tasking',
}
class AIShip extends Ship {
  constructor(opts = {}) {
    Object.assign(opts, {
      id: opts.id || `s-${Math.random().toString().substr(3, 5)}`,
    });
    super(opts);
    // Make some AI stuff happen
    this._aiState = AISTATE.IDLE;
  }
  update() {
    super.update();
    switch (this._aiState) {
      case AISTATE.IDLE:
        // Do something instead of chill
        const {
          target,
          targetSystem,
          villainComplete,
        } = this.findTarget();
        if (villainComplete) {
          // Do something?
        } else {
          if (targetSystem !== this.system) {
            // Need to travel systems first
            this.travelToSystem(targetSystem);
          } else {
            this._aiState = AISTATE.MOVING;
            this.orbit(target);
          }
        }
        break;
      case AISTATE.MOVING:
        if (this._state === SHIPSTATE.ORBITING) {
          this._aiState = AISTATE.ORBITING;
        }
        break;
      default:
        // unhandled
        break;
    }
  }
  travelToSystem(systemId) {
    if (super.travelToSystem(systemId)) {
      this._aiState = AISTATE.WARPING;
    }
  }
  cleanUpWarp(ship, tween, systemId) {
    super.cleanUpWarp(ship, tween, systemId);
    this._aiState = AISTATE.IDLE;
  }
  target(orbitTarget) {
    super.target(orbitTarget);
    this._aiState = AISTATE.MOVING;
  }
  findTarget() {
    // Find a random target to go hang out in
    // Never target the player or another ship
    let possibleTargets = gameobjects.filter(go => this.filterTargetFunc(go)).concat();
    if (this._orbitTarget) {
      possibleTargets = gameobjects.filter(go => go.id.toLowerCase() !== this._orbitTarget.toLowerCase());
    }
    const target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
    return {
      target,
      targetSystem: target.system
    };
  }
  filterTargetFunc(go) {
    return go.id !== player.id && !(go instanceof Ship) && go.system == this.system;
  }
}
class VillainShip extends AIShip {
  constructor(opts = {}) {
    Object.assign(opts, {
      id: opts.id || (ENV.debug) ? `V-${Math.random().toString().substr(3, 5)}` : `s-${Math.random().toString().substr(3, 5)}`,
    });
    super(opts);
    this._goals = this.generateGoals();
    this.villain = true;
    this._signals = {
      onClockNotify: new Phaser.Signal(),
      onVillainComplete: new Phaser.Signal(),
    };
  }
  // Villain has their own update ticks
  update() {
    super.update();
    switch (this._aiState) {
      case AISTATE.ORBITING:
        // while the villain is orbiting, they are working on some task, so switch to tasking
        this._aiState = AISTATE.TASKING;
        break;
      case AISTATE.TASKING:
        // progress their doomsay clock
        if (!this._aiClock) {
          const timer = game.time.create(false);
          const villainLoopTimer = parseInt(ENV.villaintimer) || Phaser.Timer.SECOND * 5;
          timer.loop(villainLoopTimer, this.progressClock, this);
          this._aiClock = {
            timer,
            total: Math.floor(Math.random() * 10) + 4,
            progress: 0,
          };
          timer.start();
        }
        break;
      case AISTATE.THINKING:
        // The villain needs to hatch a plan
        if (!this._aiClock) {
          // Create a clock for hatching a plan
          const timer = game.time.events.add(Phaser.Timer.SECOND * 4, () => {
            this._signals.onClockNotify.dispatch('The villain has located the next target');
            this._aiClock = undefined;
            this._aiState = AISTATE.IDLE;
          }, this);
          this._aiClock = {
            timer,
          };
        }
        break;
      default:
        // chill
        break;
    }
  }
  progressClock() {
    const {
      _aiClock: clock,
    } = this;
    clock.progress++;
    if (clock.progress === clock.total) {
      // The villain has completed a task
      clock.timer.stop();
      this._aiState = AISTATE.THINKING;
      this._aiClock = undefined;
      this._signals.onClockNotify.dispatch('Villain completed a task!');
    } else {
      // it continues
      const msg = sprintf('Tick tock goes the clock %s / %s', clock.progress, clock.total);
      this._signals.onClockNotify.dispatch(msg)
    }
  }
  /** Randomly pick goals from the known universe. Once those are accomplished,
   * head to the final objective and the player loses
   */
  generateGoals() {
    const choices = gameobjects.filter(go => (go instanceof Planet) || (go instanceof Star)).concat();
    const DESIRED_GOALS = 5;
    const targets = [];
    while (targets.length < DESIRED_GOALS && choices.length) {
      targets.push(choices.splice(Math.floor(Math.random() * choices.length), 1)[0]);
    }
    console.log('TARGETS CHOSEN:', targets);
    if (targets.length !== DESIRED_GOALS) {
      console.warn(sprintf('Did not find enough goals - expected [%s] found [%s]', DESIRED_GOALS, targets.length));
    }
    return targets;
  }
  findTarget() {
    if (this._goals.length) {
      const targetSystem = this._goals[0].system;
      if (targetSystem === this.system) {
        return {
          target: this._goals.shift(),
          targetSystem,
        }
      } else {
        return {
          targetSystem
        };
      }
    } else {
      // The Villain has completed all objectives!
      this._signals.onVillainComplete.dispatch();
      return {
        villainComplete: true
      };
    }
  }
}
