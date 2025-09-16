import { Injectable, signal } from '@angular/core';

export type Lang = 'es' | 'en';
const LANG_STORAGE_KEY = 'ui:lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<Lang>((localStorage.getItem(LANG_STORAGE_KEY) as Lang) ?? 'es');

  setLang(l: Lang) {
    this.lang.set(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {}
  }
}
