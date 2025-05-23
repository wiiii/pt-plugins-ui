// src/utils/eventBus.ts
import mitt from 'mitt';

type Events = {
  refreshAccount: void;
};

export const eventBus = mitt<Events>();
