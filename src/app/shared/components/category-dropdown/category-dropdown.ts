import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-category-dropdown',
  imports: [],
  templateUrl: './category-dropdown.html',
  styleUrl: './category-dropdown.scss',
})
export class CategoryDropdown {
  private host = inject(ElementRef<HTMLElement>);

  placeholder = input.required<string>();
  options = input.required<readonly string[]>();
  selected = input<string | null>(null);

  /** When set, an extra entry is shown that clears the selection. */
  resetLabel = input<string | null>(null);

  selectionChange = output<string | null>();

  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  choose(category: string | null): void {
    this.selectionChange.emit(category);
    this.isOpen.set(false);
  }

  /** Clicks anywhere outside close the menu, which is what users expect from a dropdown. */
  @HostListener('document:click', ['$event.target'])
  closeOnOutsideClick(target: EventTarget | null): void {
    if (this.isOpen() && !this.host.nativeElement.contains(target as Node)) {
      this.isOpen.set(false);
    }
  }
}
