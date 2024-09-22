import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';
import { iFTUIUserProfileMenuItem } from './app-frame/app-frame.component';

@Component({
  standalone: true,
  imports: [CommonModule, ThemeSelectorComponent],
  selector: 'app-root',
  template: `
    <div class="flex flex-col h-screen">
      <!-- Navbar (fixed and always on top) -->
      <nav
        class="bg-blue-700 text-white p-4 flex justify-between items-center fixed w-full top-0 z-50 !navbar"
      >
        <div class="flex items-center gap-4">
          <!-- Left sidenav toggle button -->
          <button
            class="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded transition-colors"
            (click)="toggleSidenav('left')"
          >
            <ng-container *ngIf="leftSidenavState === 'closed'">
              <svg
                class="transition-transform duration-500"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path
                  d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
                />
              </svg>
            </ng-container>
            <ng-container *ngIf="leftSidenavState !== 'closed'">
              <svg
                class="transition-transform duration-500"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path
                  d="m177-120-57-57 184-183H200v-80h240v240h-80v-104L177-120Zm343-400v-240h80v104l183-184 57 57-184 183h104v80H520Z"
                />
              </svg>
            </ng-container>
          </button>
          <a class="btn btn-ghost normal-case text-xl">My Application</a>
        </div>

        <div class="navbar-end flex items-center space-x-2">
          <app-theme-selector initialTheme="dark"></app-theme-selector>

          <div class="dropdown dropdown-end z-40" *ngIf="userProfileImage">
            <button tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img [src]="userProfileImage" alt="User Profile Image" />
              </div>
            </button>
            <ul
              tabindex="0"
              class="dropdown-content menu menu-sm bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
            >
              <li *ngFor="let item of userProfileMenuItems">
                <a (click)="onUserProfileMenuItemClick(item)">{{
                  item.label
                }}</a>
              </li>
            </ul>
          </div>

          <!-- Right sidenav toggle button -->
          <button
            class="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded transition-colors"
            (click)="toggleSidenav('right')"
          >
            <ng-container *ngIf="rightSidenavState === 'closed'">
              <svg
                class="transition-transform duration-500"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path
                  d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
                />
              </svg>
            </ng-container>
            <ng-container *ngIf="rightSidenavState === 'expanded'">
              <svg
                class="transition-transform duration-500"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path
                  d="m177-120-57-57 184-183H200v-80h240v240h-80v-104L177-120Zm343-400v-240h80v104l183-184 57 57-184 183h104v80H520Z"
                />
              </svg>
            </ng-container>
          </button>
        </div>
      </nav>

      <div class="flex flex-grow pt-16 overflow-auto">
        <!-- Left sidenav -->
        <div
          class="bg-gray-800 text-white transition-all duration-500 ease-in-out fixed z-40 min-h-screen overflow-auto"
          [ngClass]="{
            'w-64': leftSidenavState === 'expanded' && !isSmallScreen,
            'w-16': leftSidenavState === 'icons' && !isSmallScreen,
            'w-full h-full': leftSidenavState === 'expanded' && isSmallScreen,
            'w-0 hidden': leftSidenavState === 'closed'
          }"
        >
          <ul class="p-4 space-y-4">
            <li class="my-2">
              <a href="#" class="text-white flex items-center space-x-4">
                <span class="iconify" data-icon="ic:baseline-dashboard"></span>
                <span *ngIf="leftSidenavState === 'expanded' || isSmallScreen"
                  >Dashboard</span
                >
              </a>
            </li>
            <li class="my-2">
              <a href="#" class="text-white flex items-center space-x-4">
                <span class="iconify" data-icon="ic:baseline-person"></span>
                <span *ngIf="leftSidenavState === 'expanded' || isSmallScreen"
                  >Profile</span
                >
              </a>
            </li>
          </ul>

          <ul class="menu rounded-box bg-base-300">
            <li><a>Item 1</a></li>
            <li>
              <details open>
                <summary>Parent</summary>
                <ul>
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                  <li>
                    <details open>
                      <summary>Parent</summary>
                      <ul>
                        <li><a>Submenu 1</a></li>
                        <li>
                          <details open>
                            <summary>Parent</summary>
                            <ul>
                              <li><a>Submenu 1</a></li>
                              <li>
                                <details open>
                                  <summary>Parent</summary>
                                  <ul>
                                    <li><a>Communications</a></li>
                                  </ul>
                                </details>
                              </li>
                            </ul>
                          </details>
                        </li>
                      </ul>
                    </details>
                  </li>
                </ul>
              </details>
            </li>
            <li><a>Item 3</a></li>
          </ul>
        </div>

        <!-- Main Content -->
        <div
          class="flex-grow bg-gray-100 p-6 transition-all duration-500"
          [ngClass]="{
            'ml-64': leftSidenavState === 'expanded' && !isSmallScreen,
            'ml-16': leftSidenavState === 'icons' && !isSmallScreen,
            'ml-0': leftSidenavState === 'closed' || isSmallScreen
          }"
          [style.marginRight]="getRightSidenavMargin()"
        >
          <h1 class="text-2xl font-bold">Main Content</h1>
          <p>
            Content area. The right sidenav now overlaps the content without
            pushing it under the left sidenav.
          </p>
        </div>

        <!-- Right sidenav -->
        <div
          class="bg-gray-800 text-white transition-all duration-500 ease-in-out fixed z-40 min-h-screen right-0"
          [ngClass]="{
            'w-64': rightSidenavState === 'expanded' && !isSmallScreen,
            'w-full h-full': rightSidenavState === 'expanded' && isSmallScreen,
            'w-0 hidden': rightSidenavState === 'closed'
          }"
        >
          <ul class="p-4 space-y-4">
            <li class="my-2">
              <a href="#" class="text-white flex items-center space-x-4">
                <span class="iconify" data-icon="ic:baseline-dashboard"></span>
                <span *ngIf="rightSidenavState === 'expanded' || isSmallScreen"
                  >Dashboard</span
                >
              </a>
            </li>
            <li class="my-2">
              <a href="#" class="text-white flex items-center space-x-4">
                <span class="iconify" data-icon="ic:baseline-person"></span>
                <span *ngIf="rightSidenavState === 'expanded' || isSmallScreen"
                  >Profile</span
                >
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  onUserProfileMenuItemClick(_t36: iFTUIUserProfileMenuItem) {
    throw new Error('Method not implemented.');
  }

  leftSidenavState: 'closed' | 'icons' | 'expanded' = 'expanded';
  rightSidenavState: 'closed' | 'expanded' | 'icons' = 'closed';
  isSmallScreen: boolean = false;
  userProfileImage: string =
    'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';
  userProfileMenuItems: iFTUIUserProfileMenuItem[] = [{ label: 'Settings' }];

  constructor() {
    this.updateSidenavState(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateSidenavState(event.target.innerWidth);
  }

  toggleSidenav(side: 'left' | 'right') {
    if (side === 'left') {
      this.leftSidenavState = this.getNextSidenavState(
        this.leftSidenavState,
        'left'
      );
      if (this.isSmallScreen && this.leftSidenavState !== 'closed') {
        this.rightSidenavState = 'closed'; // Close the right sidenav on small screens
      }
    } else {
      this.rightSidenavState = this.getNextSidenavState(
        this.rightSidenavState,
        'right'
      );
      if (this.isSmallScreen && this.rightSidenavState !== 'closed') {
        this.leftSidenavState = 'closed'; // Close the left sidenav on small screens
      }
    }
  }

  getNextSidenavState(
    currentState: 'closed' | 'icons' | 'expanded',
    side: 'left' | 'right'
  ): 'closed' | 'icons' | 'expanded' {
    // For right sidenav, only toggle between "closed" and "expanded"
    if (side === 'right') {
      return currentState === 'expanded' ? 'closed' : 'expanded';
    }

    // For left sidenav on small screens, toggle between "closed" and "expanded"
    if (this.isSmallScreen) {
      return currentState === 'expanded' ? 'closed' : 'expanded';
    } else {
      // For larger screens, toggle left sidenav between "closed", "icons", and "expanded"
      if (currentState === 'expanded') {
        return 'icons';
      } else if (currentState === 'icons') {
        return 'closed';
      } else {
        return 'expanded';
      }
    }
  }

  updateSidenavState(screenWidth: number) {
    this.isSmallScreen = screenWidth < 640;
    if (this.isSmallScreen) {
      this.leftSidenavState = 'closed';
      this.rightSidenavState = 'closed';
    } else if (screenWidth >= 640 && screenWidth < 1024) {
      this.leftSidenavState = 'icons';
      this.rightSidenavState = 'closed';
    } else {
      this.leftSidenavState = 'expanded';
      this.rightSidenavState = 'closed';
    }
  }

  getSidenavWidth(
    state: 'closed' | 'icons' | 'expanded',
    side: 'left' | 'right'
  ) {
    if (state === 'expanded') {
      return this.isSmallScreen ? '100%' : '16rem'; // Full width on small screens, 16rem otherwise
    } else if (state === 'icons' && side === 'left') {
      return '4rem'; // Icons-only width for left sidenav
    }
    return '0'; // Closed
  }

  getRightSidenavMargin() {
    if (this.rightSidenavState === 'expanded' && !this.isSmallScreen) {
      return '16rem'; // Full width (64) on large screens
    }
    return '0'; // No margin for small screens or closed sidenav
  }
}
