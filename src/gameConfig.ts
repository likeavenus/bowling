import { IGameState } from "./types";

class State implements IGameState {
    power: 0;
    isStarted: false;
    isEnded: false;
    isStrike: false;
    isTouched: false;
    roundsLimit: 2;
    constructor() {
        this.power = 0;
        this.isStarted = false;
        this.isEnded = false;
        this.isStrike = false;
        this.isTouched = false;
        this.roundsLimit = 2;
        return new Proxy(this, {
            get(target, name: keyof IGameState) {
                return target[name];
            },
            set(target, name: keyof IGameState, receiver: number) {
                if (name in target) {
                    target[name] = receiver;
                    return true;
                }
                return false;
            },
        });
    }

    public setInitialState(): IGameState {
        this.isTouched = false;
        this.power = 0;
        this.isStarted = false;
        this.isEnded = false;
        this.isStrike = false;
        this.roundsLimit = 2;
        return this;
    }
};

export const state = new State();