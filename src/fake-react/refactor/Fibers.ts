import type { Component } from './Component';

export interface Fiber {
  id: string;
  name: string;
  context: Component;
  parent: HTMLElement;
  child: Fiber | null;
  index: number;
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
}

export function createFiber(id: string, instance: Component, parent: HTMLElement, index = 0) {
  const fiber: Fiber = {
    id,
    name: instance.constructor.name,
    context: instance,
    index,
    parent,
    child: null,
  };

  return fiber;
}

export const fibers = new Fibers();
