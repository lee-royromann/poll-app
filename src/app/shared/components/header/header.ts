import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  /** The dark logo is used on the light detail screen, the orange one on the dark home. */
  logo = input('logo_orange.svg');
}
