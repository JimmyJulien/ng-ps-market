import { Component } from '@angular/core';

@Component({
  selector: 'app-icone-ps-market',
  standalone: true,
  template: `
  <svg viewBox="0 0 800 800">
    <line x1="400" y1="250" x2="400" y2="550" stroke="white" stroke-width="32"></line>
    <line x1="520" y1="280" x2="280" y2="520" stroke="white" stroke-width="32"></line>
    <line x1="550" y1="400" x2="250" y2="400" stroke="white" stroke-width="32"></line>
    <line x1="520" y1="520" x2="280" y2="280" stroke="white" stroke-width="32"></line>
    <circle cx="400" cy="100" r="80" stroke="white" stroke-width="32"></circle>
    <circle cx="620" cy="180" r="80" stroke="white" stroke-width="32"></circle>
    <circle cx="700" cy="400" r="80" stroke="white" stroke-width="32"></circle>
    <circle cx="620" cy="620" r="80" stroke="white" stroke-width="32"></circle>
    <circle cx="400" cy="700" r="80" stroke="white" stroke-width="32"></circle>
    <circle cx="180" cy="620" r="80" stroke="white" stroke-width="32"></circle>
    <circle cx="100" cy="400" r="80" stroke="white" stroke-width="32"></circle>
    <circle cx="180" cy="180" r="80" stroke="white" stroke-width="32"></circle>
  </svg>
  `,
  styles: ``
})
export class PSMarketIcone {}
