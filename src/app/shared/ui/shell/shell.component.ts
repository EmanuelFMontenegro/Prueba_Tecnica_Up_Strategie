import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CocktailsFacade } from '@state/cocktails/facade/cocktails.facade';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  private readonly facade = inject(CocktailsFacade);
  private readonly router = inject(Router);

  onRandom(): void {
    this.facade.random();
    this.router.navigate(['/detail']);
  }
}
