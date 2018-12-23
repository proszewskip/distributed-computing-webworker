export interface MonoWasmApp {
  /**
   * Called by runtime.js after WASM is loaded.
   */
  init(): void;
}

export interface MonoWasmContext {
  BINDING: any;
  Module: any;

  /**
   * Has to be declared globally becuase it will be accessed by runtime.js
   */
  App: MonoWasmApp;
}

/**
 * Global context for the WebWorker
 */
export interface WorkerContext extends Worker, MonoWasmContext {
  importScripts: (...urls: string[]) => void;
}

export const workerContext: WorkerContext = self as any;
