import { NgClass } from '@angular/common';
import { Component, computed, effect, ElementRef, forwardRef, HostBinding, HostListener, inject, input, signal, viewChild, viewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventService } from '@app/core/event/event.service';
import { Referentiel } from '@app/shared/types/app.types';

@Component({
  selector: 'app-selection-multiple',
  standalone: true,
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectionMultipleComponent),
      multi: true
    }
  ],
  templateUrl: './selection-multiple.component.html',
  styleUrl: './selection-multiple.component.scss'
})
export class SelectionMultipleComponent implements ControlValueAccessor {

  readonly $clickDocument = inject(EventService).getClickEvent();

  readonly $clickComposant = signal<Event | null>(null);

  readonly $options = input.required<Referentiel[]>();
  
  readonly $optionsSelectionnees = signal<Referentiel[]>([]);

  readonly $idPremiereOption = computed(() => {
    if(this.$options().length === 0) return null;
    return this.$options()[0].id;
  });

  readonly $idDerniereOption = computed(() => {
    if(this.$options().length === 0) return null;
    return this.$options()[this.$options().length - 1].id;
  });

  readonly $elementAffichage = viewChild<ElementRef<HTMLDivElement>>('affichage');
  
  readonly $elementsOption = viewChildren<ElementRef<HTMLDivElement>>('option');

  readonly $affichageOptions = computed(() => {
    const optionsSelectionnees = this.$optionsSelectionnees();

    if(optionsSelectionnees.filter(o => !!o). length === 0) {
      return '';
    }

    return optionsSelectionnees
    .map(option => option.libelle)
    .join(', ');
  });

  sontOptionsAccessibles = false;

  onChange!: (options: Referentiel[]) => void;

  onTouched!: () => void;

  @HostBinding('class.desactive') estChampDesactive = false;

  constructor() {
    effect(() => {
      const clickDocument = this.$clickDocument() || null;
      const clickComposant = this.$clickComposant() || null;

      // Pas de click
      if(!clickDocument && !clickComposant) {
        this.sontOptionsAccessibles = false;
      }
      // Clic en dehors du composant
      else if(clickDocument?.target !== clickComposant?.target) {
        this.sontOptionsAccessibles = false;
      }
      // Clic dans le composant
      else {
        this.sontOptionsAccessibles = !this.sontOptionsAccessibles;
      }
    });

    effect(() => {
      this.onChange(this.$optionsSelectionnees());
    });
  }

  @HostListener('click', ['$event'])
  onClickInside(event: Event): void {
    this.$clickComposant.set(event);
  }

  @HostListener('keydown.tab', ['$event'])
  onTab(event: Event): void {
    // Si options non visibles, on ne fait rien
    if(!this.sontOptionsAccessibles) {
      return;
    };

    const idOption = (event.target as HTMLElement).getAttribute('data-smo-id');
    
    // Si target sans attribut 'data-smo-id', on navigue vers la première option
    if(!idOption) {
      event.preventDefault();
      this.$elementsOption()[0].nativeElement.focus();
      return;
    }

    // Si dernière option, on ne fait rien
    if(+idOption === this.$idDerniereOption()) {
      event.preventDefault();
    }
  }

  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDown(event: Event): void {
    event.preventDefault();

    // Si options non visibles, on ne fait rien
    if(!this.sontOptionsAccessibles) return;

    const idOption = (event.target as HTMLElement).getAttribute('data-smo-id');

    // Si target sans attribut 'data-smo-id', on navigue vers la première option
    if(!idOption) {
      this.$elementsOption()[0].nativeElement.focus();
      return;
    }
    
    // Si dernière option, on ne fait rien
    if(+idOption === this.$idDerniereOption()) return;

    // Sinon on focus l'élément suivant
    const elementOptionIndex = this.$elementsOption()?.findIndex(e => e.nativeElement.getAttribute('data-smo-id') === idOption);
    this.$elementsOption()[elementOptionIndex + 1].nativeElement.focus();
  }

  @HostListener('keydown.shift.tab', ['$event'])
  onShiftTab(event: Event): void {
    // Si options non visibles, on ne fait rien
    if(!this.sontOptionsAccessibles) {
      return;
    }

    const idOption = (event.target as HTMLElement).getAttribute('data-smo-id');

    // Si target sans attribut 'data-smo-id', on ne fait rien
    if(!idOption) {
      event.preventDefault();
      return;
    }

    // Si première option, on bloque l'event
    if(+idOption === this.$idPremiereOption()) {
      event.preventDefault();
    }
  }

  @HostListener('keydown.arrowup', ['$event'])
  onArrowUp(event: Event): void {
    event.preventDefault();

    // Si options non visibles, on ne fait rien
    if(!this.sontOptionsAccessibles) return;

    const idOption = (event.target as HTMLElement).getAttribute('data-smo-id');

    // Si target sans attribut 'data-smo-id', on navigue vers la première option
    if(!idOption) {
      this.$elementsOption()[0].nativeElement.focus();
      return;
    }
    
    // Si première option, on ne fait rien
    if(+idOption === this.$idPremiereOption()) return;

    // Sinon on focus l'élément précédent
    const elementOptionIndex = this.$elementsOption()?.findIndex(e => e.nativeElement.getAttribute('data-smo-id') === idOption);
    this.$elementsOption()[elementOptionIndex - 1].nativeElement.focus();
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    // On masque les options
    this.sontOptionsAccessibles = false;

    // On redonne le focus à l'input d'affichage
    this.$elementAffichage()?.nativeElement.focus();
  }

  toggleOptions(event?: Event): void {
    if(event) {
      event.preventDefault();
    }

    this.sontOptionsAccessibles = !this.sontOptionsAccessibles;
  }

  selectionnerOption(option: Referentiel, event?: Event): void {
    if(event) {
      event.preventDefault();
    }

    if(this.$optionsSelectionnees().findIndex(o => o.id === option.id) > -1) {
      const nouvellesOptionsSelectionnees = this.$optionsSelectionnees().filter(o => o.id !== option.id);
      this.$optionsSelectionnees.set(nouvellesOptionsSelectionnees);
    }
    else {
      const nouvellesOptionsSelectionnees = [...this.$optionsSelectionnees(), option];
      this.$optionsSelectionnees.set(nouvellesOptionsSelectionnees);
    }
  }

  writeValue(options: Referentiel[]): void {
    this.$optionsSelectionnees.set(options);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(estDesactive: boolean): void {
    this.estChampDesactive = estDesactive;
  }
}
