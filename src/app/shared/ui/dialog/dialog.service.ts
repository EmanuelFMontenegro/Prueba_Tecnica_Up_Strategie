import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Injectable({ providedIn: 'root' })
export class AppDialogService {
  private dialog = inject(MatDialog);

  open<T, D = unknown, R = unknown>(
    component: ComponentType<T>,
    data?: D,
    size: DialogSize = 'md',
    extra?: Partial<MatDialogConfig<D>>
  ): MatDialogRef<T, R> {
    const base: MatDialogConfig<D> = {
      data,
      autoFocus: false,
      restoreFocus: true,
      panelClass: this.mergePanelClass(extra?.panelClass, ['app-dialog', `app-dialog--${size}`]),
      backdropClass: this.mergePanelClass(extra?.backdropClass, ['app-dialog__backdrop']),
      enterAnimationDuration: '120ms',
      exitAnimationDuration: '100ms',
      ...this.sizeToConfig(size),
      ...extra,
    };

    if (size === 'full') {
      base.disableClose ??= true;
    }

    return this.dialog.open(component, base);
  }

  private sizeToConfig(size: DialogSize): Partial<MatDialogConfig> {
    switch (size) {
      case 'sm':  return { maxWidth: '420px',  width: '92vw'  };
      case 'md':  return { maxWidth: '640px',  width: '92vw'  };
      case 'lg':  return { maxWidth: '860px',  width: '92vw'  };
      case 'xl':  return { maxWidth: '1040px', width: '96vw'  };
      case 'full':return { maxWidth: '100vw',  width: '100vw', height: '100dvh' };
    }
  }

  private mergePanelClass(
    incoming: MatDialogConfig['panelClass'],
    base: string[]
  ): string[] {
    if (!incoming) return base;
    return Array.isArray(incoming) ? [...base, ...incoming] : [...base, incoming];
  }
}
