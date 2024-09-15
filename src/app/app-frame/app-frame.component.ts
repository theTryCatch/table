import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, ThemeSelectorComponent],
  templateUrl: './app-frame.component.html',
  styles: [],
})
export class AppFrame {
  @Input() brandingBarMenuItems: iFTUIBrandingBarMenuItem[] = [];
  @Input() userProfileMenuItems: iFTUIUserProfileMenuItem[] = [];
  @Input() applicationName: string = '';
  @Input() userProfileImage: string = '';
  @Input() companyLogo: string = '';
  @Output() sidebarToggled = new EventEmitter<void>();
  @Output() userProfileMenuItemSelected =
    new EventEmitter<iFTUIUserProfileMenuItem>();
  @Output() menuItemSelected = new EventEmitter<{
    item: iFTUIBrandingBarMenuItem;
    hierarchy: iFTUIBrandingBarMenuItem[];
  }>();
  @Output() colorPickerSelected = new EventEmitter<void>();

  constructor(private elRef: ElementRef, private router: Router) {}
  isDropdownOpen = false; // State to control dropdown visibility

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
    console.log(item);
  }

  onMenuItemClick(
    item: iFTUIBrandingBarMenuItem,
    hierarchy: iFTUIBrandingBarMenuItem[] = [item]
  ): void {
    // Emit the item and hierarchy as an object
    this.menuItemSelected.emit({ item, hierarchy });
    console.log({ item, hierarchy });

    // Check if the route exists
    if (
      !item.route ||
      !this.router.config.some((route) => route.path === item.route)
    ) {
      throw new Error(`Route '${item.route}' does not exist.`);
    }

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
    const detailsElements =
      this.elRef.nativeElement.querySelectorAll('details');
    detailsElements.forEach((details: HTMLDetailsElement) => {
      details.open = false;
    });
  }
}
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
