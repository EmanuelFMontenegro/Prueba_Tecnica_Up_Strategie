import { Component, EventEmitter, Output, computed, signal, effect, input } from '@angular/core';

type Timer = ReturnType<typeof setTimeout> | null;

@Component({
  standalone: true,
  selector: 'app-alphabet-filter',
  templateUrl: './alphabet-filter.html',
})
export class AlphabetFilter {

  selected  = input<string | null>(null);
  isLoading = input<boolean>(false);

  @Output() pick = new EventEmitter<string | null>();


  letters = computed<string[]>(() =>
    Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  );

  readonly busy = signal(false);

  private readonly fromLetterWindow = signal(false);
  private windowTimer: Timer = null;
  private showT: Timer = null;
  private hideT: Timer = null;

  choose(l: string) {
    if (this.selected() === l) return;
    this.fromLetterWindow.set(true);
    if (this.windowTimer) { clearTimeout(this.windowTimer); this.windowTimer = null; }
    this.windowTimer = setTimeout(() => this.fromLetterWindow.set(false), 1200);
    this.pick.emit(l);
  }

  clear() { this.pick.emit(null); }


  private readonly _busyFx = effect((onCleanup) => {
    const loadingFromStore = this.isLoading();
    const fromLetter = this.fromLetterWindow();

    if (this.showT) { clearTimeout(this.showT); this.showT = null; }
    if (this.hideT) { clearTimeout(this.hideT); this.hideT = null; }

    if (loadingFromStore && fromLetter) {
      this.showT = setTimeout(() => this.busy.set(true), 180);
    } else {
      if (this.busy()) this.hideT = setTimeout(() => this.busy.set(false), 240);
      else this.busy.set(false);
    }

    onCleanup(() => {
      if (this.showT) { clearTimeout(this.showT); this.showT = null; }
      if (this.hideT) { clearTimeout(this.hideT); this.hideT = null; }
    });
  }, { allowSignalWrites: true });
}
