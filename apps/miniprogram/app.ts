import { createInitialAppState, type AppState } from './services/mock-service';

export interface AppOption {
  globalData: AppState;
  resetDemo(): void;
}

App<AppOption>({
  globalData: createInitialAppState(),
  resetDemo() {
    this.globalData = createInitialAppState();
  },
});
