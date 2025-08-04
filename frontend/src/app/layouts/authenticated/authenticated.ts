import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './authenticated.html'
})
export class AuthenticatedLayoutComponent {
  // The method is no longer needed here!
}