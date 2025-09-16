import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-dialog-header',
  imports: [MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="dialog-header flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h3
          class="title text-lg md:text-xl font-semibold leading-tight truncate"
          role="heading"
          aria-level="1"
        >
          {{ title }}
        </h3>

        @if (subtitle) {
          <p class="subtitle text-sm opacity-80 truncate">
            Cantidad: <span class="font-medium">{{ subtitle }}</span>
          </p>
        }
      </div>

      <button
        mat-icon-button
        aria-label="Cerrar dialogo"
        class="close-btn -mr-1 -mt-1 p-2 rounded-full hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        (click)="close()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </header>
  `,
})
export class DialogHeaderComponent {
  private ref = inject<MatDialogRef<unknown>>(MatDialogRef, { optional: true });

  @Input() title = '';
  @Input() subtitle?: string;

  close() {
    this.ref?.close();
  }
}
