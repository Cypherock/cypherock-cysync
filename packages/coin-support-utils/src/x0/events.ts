import { X0FlowEvent } from '@cypherock/coin-support-interfaces';
import { Subscriber } from 'rxjs';

/**
 * Bridges X0 flow events onto a coin's existing device-event enum so UI
 * consumers keep working unchanged; X1-only events (device-screen
 * confirmations etc.) are simply never set.
 */
export function createX0EventEmitter<E extends number>(
  observer: Subscriber<unknown>,
  eventMap: Partial<Record<X0FlowEvent, E>>,
) {
  const events: Record<number, boolean | undefined> = {};

  const emit = (isDone: boolean) => {
    observer.next({
      type: 'Device',
      device: { isDone, events: { ...events } },
    } as any);
  };

  const onEvent = (event: X0FlowEvent) => {
    const mapped = eventMap[event];
    if (mapped === undefined) return;
    events[mapped] = true;
    emit(false);
  };

  const markDone = () => emit(true);

  return { onEvent, markDone };
}
