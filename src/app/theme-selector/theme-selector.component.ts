import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type Theme =
  | 'light'
  | 'dark'
  | 'cupcake'
  | 'bumblebee'
  | 'emerald'
  | 'corporate'
  | 'synthwave'
  | 'retro'
  | 'cyberpunk'
  | 'valentine'
  | 'halloween'
  | 'garden'
  | 'forest'
  | 'aqua'
  | 'lofi'
  | 'pastel'
  | 'fantasy'
  | 'wireframe'
  | 'black'
  | 'luxury'
  | 'dracula'
  | 'cmyk'
  | 'autumn'
  | 'business';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          class="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path
            d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"
          ></path>
        </svg>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl max-h-[50vh] overflow-auto"
      >
        <li *ngFor="let theme of themes">
          <input
            type="radio"
            name="theme-dropdown"
            class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            [attr.aria-label]="theme"
            [value]="theme"
            [checked]="theme === currentTheme"
            (click)="applyTheme(theme)"
          />
        </li>
      </ul>
    </div>
  `,
  styles: [],
})
export class ThemeSelectorComponent implements OnInit {
  @Input() initialTheme: Theme = 'light';
  @Output() themeChange: EventEmitter<Theme> = new EventEmitter<Theme>();

  themes: Theme[] = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
  ];
  currentTheme: Theme = this.initialTheme;

  ngOnInit() {
    if (!this.themes.includes(this.initialTheme)) {
      throw new Error(
        `Invalid initial theme: "${
          this.initialTheme
        }". It must be one of the predefined themes: ${this.themes.join(', ')}.`
      );
    }
    this.applyTheme(this.initialTheme);
  }

  applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.themeChange.emit(this.currentTheme);
  }
}
