import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="navbar bg-base-100">
      <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl">DaisyUI Theme Switcher</a>
      </div>
      <div class="flex-none">
        <select class="select select-bordered" [(ngModel)]="selectedTheme" (change)="onThemeChange($event)">
          <option *ngFor="let theme of themes" [value]="theme">{{ theme }}</option>
        </select>
      </div>
    </div>
    <div class="p-4">
      <p>Current theme: {{ selectedTheme }}</p>
    </div>
  `,
  styles: [],
})
export class AppFrame implements OnInit {
  themes: string[] = [];
  selectedTheme = 'light';

  ngOnInit() {
    this.loadThemes();
  }

  loadThemes() {
    // Check if DaisyUI is loaded and themes are available
    if (window && (window as any).daisyui) {
      this.themes = (window as any).daisyui.themes.map((theme: any) => theme.name);
    } else {
      // Fallback to hardcoded themes in case the dynamic load fails
      this.themes = ['light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate'];
    }
  }

  onThemeChange(event: any) {
    const selectedTheme = event.target.value;
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }
}
