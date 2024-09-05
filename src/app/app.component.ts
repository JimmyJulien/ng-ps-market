import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@core/header/header.component';
import { EventService } from './core/event/event.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <app-header/>

    <main>
      <router-outlet/>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    main {
      overflow: auto;
      padding: 1rem;
      height: 100%;
    }
  `]
})
export class AppComponent {

  readonly #eventService = inject(EventService);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.#eventService.setClickEvent(event);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    this.#eventService.setResizeEvent(event);
  }
}
