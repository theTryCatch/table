import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AppFrame,
  iFTUIBrandingBarMenuItem,
  iFTUIUserProfileMenuItem,
} from './app-frame/app-frame.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AppFrame],
  templateUrl: './app.component.html',
})
export class AppComponent {
  applicationName: string = 'My Application';
  userProfileImage: string =
    'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

  companyLogo: string = `
    <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="26" fill="#2C4770" text-anchor="middle" alignment-baseline="middle">
        Morgan Stanley
      </text>
    </svg>
  `;
  brandingBarMenuItems: iFTUIBrandingBarMenuItem[] = [
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
  userProfileMenuItems: iFTUIUserProfileMenuItem[] = [{ label: 'Settings' }];
}
