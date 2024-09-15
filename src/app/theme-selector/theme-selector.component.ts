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
    <div class="dropdown dropdown-end" (click)="toggleDropdown()">
      <!-- Dropdown Toggle Button -->
      <div tabindex="0" role="button" aria-label="Select theme" class="btn m-1">
        Theme
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
        >
          <path
            d="m247-904 57-56 343 343q23 23 23 57t-23 57L457-313q-23 23-57 23t-57-23L153-503q-23-23-23-57t23-57l190-191-96-96Zm153 153L209-560h382L400-751Zm360 471q-33 0-56.5-23.5T680-360q0-21 12.5-45t27.5-45q9-12 19-25t21-25q11 12 21 25t19 25q15 21 27.5 45t12.5 45q0 33-23.5 56.5T760-280ZM80 0v-160h800V0H80Z"
          />
        </svg>
      </div>

      <!-- Dropdown Menu -->
      <ul
        *ngIf="isDropdownOpen"
        tabindex="0"
        class="dropdown-content bg-base-300 rounded-md z-[1] w-52 p-4 shadow-2xl max-h-[20vh] overflow-y-auto"
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
  isDropdownOpen: boolean = false;

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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.themeChange.emit(this.currentTheme);
    this.isDropdownOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
      event.preventDefault();
    }
  }
}
