import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-category-dropdown',
  imports: [],
  templateUrl: './category-dropdown.html',
  styleUrl: './category-dropdown.scss',
})
export class CategoryDropdown {
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
}
