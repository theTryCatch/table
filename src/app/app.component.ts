import { Component, EventEmitter, Output, Input, HostListener, ElementRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';

// Define interfaces with iFTUI prefix
export interface iFTUIUserProfileMenuItem {
  label: string;
  badge?: string;
}

export interface iFTUIBrandingBarMenuItem {
  label: string;
  route?: string;
  icon?: string;
  children?: iFTUIBrandingBarMenuItem[]; // Nested items for submenus
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, ThemeSelectorComponent],
  template: `
    <div class="navbar bg-base-100">
      <!-- Navbar Start with menu toggle for small screens -->
      <div class="navbar-start">
        <!-- Dropdown for small screens -->
        <div class="dropdown lg:hidden">
          <button tabindex="0" class="btn btn-ghost" (click)="toggleDropdown()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <ul *ngIf="isDropdownOpen" class="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <ng-container *ngFor="let item of brandingBarMenuItems">
              <li *ngIf="!item.children">
                <a [routerLink]="item.route" (click)="onMenuItemClick(item)">{{ item.label }}</a>
              </li>
              <li *ngIf="item.children" tabindex="0">
                <details #detailsMenu>
                  <summary (click)="toggleDetails($event, detailsMenu)">{{ item.label }}</summary>
                  <ul class="p-2">
                    <ng-container *ngFor="let child of item.children">
                      <li><a [routerLink]="child.route" (click)="onMenuItemClick(child)">{{ child.label }}</a></li>
                    </ng-container>
                  </ul>
                </details>
              </li>
            </ng-container>
          </ul>
        </div>

        <!-- Branding and App Name -->
        <div class="flex items-center space-x-2">
          <div class="hidden md:block" [innerHTML]="companyLogo"></div>
          <a class="btn btn-ghost normal-case text-xl">{{ applicationName }}</a>
        </div>
      </div>

      <!-- Center Menu for larger screens -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <ng-container *ngFor="let item of brandingBarMenuItems">
            <li *ngIf="!item.children">
              <a [routerLink]="item.route" (click)="onMenuItemClick(item)">{{ item.label }}</a>
            </li>
            <li *ngIf="item.children" tabindex="0">
              <details #detailsMenu>
                <summary (click)="toggleDetails($event, detailsMenu)">{{ item.label }}</summary>
                <ul class="p-2 bg-base-100">
                  <ng-container *ngFor="let child of item.children">
                    <li><a [routerLink]="child.route" (click)="onMenuItemClick(child)">{{ child.label }}</a></li>
                  </ng-container>
                </ul>
              </details>
            </li>
          </ng-container>
        </ul>
      </div>

      <!-- Right-side items -->
      <div class="navbar-end flex items-center space-x-2">
        <!-- Theme Selector Component -->
        <app-theme-selector initialTheme="dark"></app-theme-selector>

        <!-- User Profile Dropdown -->
        <div class="dropdown dropdown-end">
          <button tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img [src]="userProfileImage" alt="User Profile Image" />
            </div>
          </button>
          <ul tabindex="0" class="dropdown-content menu menu-sm bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
            <li *ngFor="let item of userProfileMenuItems">
              <a (click)="onUserProfileMenuItemClick(item)">{{ item.label }}
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
  @Input() brandingBarMenuItems: iFTUIBrandingBarMenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'icon-class-dashboard' },
    { label: 'Reports', route: '/reports' },
    {
      label: 'Help',
      route: '/help',
      icon: 'icon-class-help',
      children: [
        { label: 'Submenu 1', route: '/help/submenu1' },
        { label: 'Submenu 2', route: '/help/submenu2' },
      ],
    },
  ];

  @Input() userProfileMenuItems: iFTUIUserProfileMenuItem[] = [{ label: 'Settings' }];

  applicationName: string = 'Agent Assist';
  userProfileImage: string = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

  companyLogo: string = `
    <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="26" fill="#2C4770" text-anchor="middle" alignment-baseline="middle">
        Morgan Stanley
      </text>
    </svg>
  `;

  @Output() sidebarToggled = new EventEmitter<void>();
  @Output() userProfileMenuItemSelected = new EventEmitter<iFTUIUserProfileMenuItem>();
  @Output() menuItemSelected = new EventEmitter<{
    item: iFTUIBrandingBarMenuItem;
    hierarchy: iFTUIBrandingBarMenuItem[];
  }>();
  @Output() colorPickerSelected = new EventEmitter<void>();

  isDropdownOpen = false; // State to control dropdown visibility

  constructor(private elRef: ElementRef) {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSidebarToggle(): void {
    this.sidebarToggled.emit();
  }

  onColorPicker(): void {
    this.colorPickerSelected.emit();
  }

  onUserProfileMenuItemClick(item: iFTUIUserProfileMenuItem): void {
    this.userProfileMenuItemSelected.emit(item);
    this.closeMenus();
  }

  onMenuItemClick(item: iFTUIBrandingBarMenuItem): void {
    this.menuItemSelected.emit({ item, hierarchy: [item] });
    this.closeMenus();
  }

  toggleDetails(event: MouseEvent, detailsMenu: HTMLDetailsElement): void {
    if (detailsMenu) {
      event.preventDefault();
      detailsMenu.open = !detailsMenu.open;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeMenus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenus();
  }

  closeMenus(): void {
    this.isDropdownOpen = false;

    // Close all open details elements
    const detailsElements = this.elRef.nativeElement.querySelectorAll('details');
    detailsElements.forEach((details: HTMLDetailsElement) => {
      details.open = false;
    });
  }
}
