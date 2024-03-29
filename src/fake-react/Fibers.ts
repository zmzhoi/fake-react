import type { Component } from './Component';

export interface Fiber {
  id: string;
  name: string;
  context: Component;
  parent: HTMLElement;
  index: number;
  dom: HTMLElement | Text | null;
}

class Fibers {
  private fibers: Record<string, Fiber>;

  constructor() {
    this.fibers = {};
  }

  get(id: string) {
    return this.fibers[id];
  }
  set(fiber: Fiber) {
    this.fibers[fiber.id] = fiber;
  }
  remove(id: string) {
    delete this.fibers[id];
  }
}
export const fibers = new Fibers();
