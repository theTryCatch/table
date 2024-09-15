import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router'; // Import RouterLink
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';

// Define interfaces
export interface UserProfileMenuItem {
  label: string;
  badge?: string;
}

export interface BrandingBarMenuItem {
  label: string;
  route?: string;
  icon?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, ThemeSelectorComponent], // Include RouterLink in the imports array
  template: `
    <div class="navbar bg-base-100 sticky top-0 z-50">
      <!-- Left Side: Sidebar Toggle Button and Logo -->
      <div class="flex items-center space-x-2">
        <!-- Sidebar Toggle Button -->
        <button class="btn btn-square btn-ghost" (click)="onSidebarToggle()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        <!-- Parameterized Company Logo, hidden on small screens -->
        <div class="flex-none hidden md:block" [innerHTML]="companyLogo"></div>
      </div>

      <!-- Middle: Application Name and Additional Menu Items -->
      <div class="flex-1 text-center md:text-left flex items-center space-x-4">
        <!-- Parameterized Application Name -->
        <a class="btn btn-ghost text-xl">{{ applicationName }}</a>

        <!-- Additional Branding Bar Menu Items -->
        <ng-container *ngFor="let item of brandingBarMenuItems">
          <a
            *ngIf="item.route"
            class="btn btn-ghost"
            [routerLink]="item.route"
          >
            <!-- Display icon or label based on availability -->
            <i *ngIf="item.icon" [class]="item.icon"></i>
            <span *ngIf="!item.icon">{{ item.label }}</span>
          </a>
        </ng-container>
      </div>

      <!-- Right Side: Theme Selector and User Profile -->
      <div class="flex-none flex items-center space-x-2">
        <!-- Color Picker Button -->
        <app-theme-selector initialTheme="dark"></app-theme-selector>

        <!-- User Profile -->
        <div class="dropdown dropdown-end">
          <!-- Checkbox to control the dropdown visibility -->
          <input
            type="checkbox"
            id="userMenuDropdown"
            class="dropdown-toggle hidden"
            #dropdownCheckbox
          />
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-circle avatar"
          >
            <div class="w-10 rounded-full">
              <!-- Parameterized User Profile Image -->
              <img
                [src]="userProfileImage"
                alt="User Profile Image"
                (click)="dropdownCheckbox.checked = !dropdownCheckbox.checked"
              />
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            [class.hidden]="!dropdownCheckbox.checked"
            *ngIf="userProfileMenuItems.length > 0"
          >
            <li *ngFor="let item of userProfileMenuItems">
              <a
                (click)="
                  onUserProfileMenuItemClick(item);
                  dropdownCheckbox.checked = false
                "
                [class.justify-between]="item.badge"
              >
                {{ item.label }}
                <span *ngIf="item.badge" class="badge">{{ item.badge }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  @Input() brandingBarMenuItems: BrandingBarMenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'icon-class-dashboard' },
    { label: 'Reports', route: '/reports' },
    { label: 'Help', route: '/help', icon: 'icon-class-help' }
  ]; // Default value for the branding bar menu items

  @Input() userProfileMenuItems: UserProfileMenuItem[] = [
    { label: 'Settings' }
  ]; // Default value for the user profile menu items

  applicationName: string = 'Agent Assist';
  userProfileImage: string =
    'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

  companyLogo: string = `
    <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="26"
        fill="#2C4770"
        text-anchor="middle"
        alignment-baseline="middle"
      >
        Morgan Stanley
      </text>
    </svg>
  `;

  @Output() sidebarToggled = new EventEmitter<void>();
  @Output() menuItemSelected = new EventEmitter<UserProfileMenuItem>();
  @Output() colorPickerSelected = new EventEmitter<void>();

  onSidebarToggle(): void {
    console.log('Sidebar toggle button clicked');
    this.sidebarToggled.emit();
  }

  onColorPicker(): void {
    console.log('Color picker button clicked');
    this.colorPickerSelected.emit();
  }

  onUserProfileMenuItemClick(item: UserProfileMenuItem): void {
    console.log('User profile menu item clicked:', item.label);
    this.menuItemSelected.emit(item);
  }
}
