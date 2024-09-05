import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  #$clickEvent = signal<Event | null>(null);
  #$resizeEvent = signal<Event | null>(null);
  
  getClickEvent(): Signal<Event | null> {
    return this.#$clickEvent;
  }

  setClickEvent(event: Event): void {
    this.#$clickEvent.set(event);
  }

  getResizeEvent(): Signal<Event | null> {
    return this.#$resizeEvent;
  }

  setResizeEvent(event: Event): void {
    this.#$resizeEvent.set(event);
  }
}
