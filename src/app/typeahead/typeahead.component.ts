import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'ftui-typeahead',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './typeahead.component.html',
})
export class FUITypeaheadComponent implements OnChanges {
  @Input() data: any[] | Observable<any[]> = [];
  @Input() propertyName: string = ''; // Property name for filtering items
  @Input() maxSuggestionListHeight: string = '200px'; // Default max height
  @Input() placeholderText: string = 'Search'; // Placeholder text on the typeahead
  @Input() sortDirection: 'asc' | 'dsc' | null = null; // Sorting direction
  @Input() defaultValue: any = null; // Default value to be selected
  @Output() selectionChange = new EventEmitter<any>(); // Emit selected object

  searchText = '';
  selectedSuggestion: any | null = null;
  suggestions: any[] = [];
  allSuggestions: any[] = [];
  fullData: any[] = []; // To store the full dataset
  private dataSubscription: Subscription | null = null;

  highlightedIndex = -1; // Index of highlighted suggestion for arrow navigation
  showSuggestions = false; // Flag to control when to show suggestions

  constructor(private eRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.loadSuggestions();
    }

    if (changes['propertyName']) {
      try {
        this.validatePropertyName();
        this.loadSuggestions();
      } catch (error: any) {
        console.error(error.message);
      }
    }

    if (changes['defaultValue']) {
      this.setDefaultValue();
    }
  }

  validatePropertyName() {
    if (!this.propertyName) {
      throw new Error('The property name cannot be empty.');
    }

    const sampleObject = this.fullData[0];
    if (!sampleObject) {
      throw new Error('Data is empty. Ensure that your data is loaded before validating the property name.');
    }

    const value = this.getNestedProperty(sampleObject, this.propertyName);
    if (Array.isArray(value)) {
      if (value.length === 0 || !this.isPrimitive(value[0])) {
        throw new Error(`The property name "${this.propertyName}" does not point to an array of primitive values.`);
      }
    } else if (!this.isPrimitive(value)) {
      throw new Error(`The property name "${this.propertyName}" does not point to a primitive value.`);
    }
  }

  isPrimitive(value: any): boolean {
    return ['string', 'number', 'boolean'].includes(typeof value);
  }

  loadSuggestions() {
    if (this.data instanceof Observable) {
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
      }
      this.dataSubscription = this.data.pipe(
        tap((items) => {
          this.fullData = items;
          this.setDefaultValue(); // Check default value after data is loaded
        }),
        map((items) => this.extractSuggestions(items))
      ).subscribe((suggestions) => {
        this.allSuggestions = suggestions;
        if (this.showSuggestions) {
          this.suggestions = [...this.allSuggestions];
        }
      });
    } else {
      this.fullData = this.data;
      this.allSuggestions = this.extractSuggestions(this.data);
      if (this.showSuggestions) {
        this.suggestions = [...this.allSuggestions];
      }
      this.setDefaultValue(); // Check default value after data is loaded
    }
  }

  extractSuggestions(items: any[]): any[] {
    if (!this.propertyName) {
      return [];
    }

    const allSuggestions = items
      .map((item) => this.getNestedProperty(item, this.propertyName))
      .flat()
      .filter((value) => value !== null && value !== undefined)
      .map((value) => (typeof value === 'string' ? value.trim() : value));

    let sortedSuggestions = Array.from(new Set(allSuggestions));

    // Apply sorting if sortDirection is provided
    if (this.sortDirection === 'asc') {
      sortedSuggestions.sort((a, b) => (a > b ? 1 : -1));
    } else if (this.sortDirection === 'dsc') {
      sortedSuggestions.sort((a, b) => (a < b ? 1 : -1));
    }

    return sortedSuggestions;
  }

  getNestedProperty(obj: any, propertyPath: string): any {
    const properties = propertyPath.split('.');
    let value = obj;
    for (const prop of properties) {
      if (Array.isArray(value)) {
        value = value.find((item) => item && item.hasOwnProperty(prop));
        if (!value) {
          return [];
        }
      }

      value = value[prop];
      if (!value && value.hasOwnProperty(prop)) {
        value = value[prop];
      } else {
        return [];
      }
    }
    return Array.isArray(value) ? value : [value];
  }

  onInputChange() {
    this.showSuggestions = true;
    const searchValue = this.searchText.toLowerCase();
    this.suggestions = this.allSuggestions.filter((item) =>
      (typeof item === 'string' ? item.toLowerCase() : item.toString()).includes(searchValue)
    );
    this.highlightedIndex = -1; // Reset highlighted index on input change
  }

  onInputFocus() {
    this.showSuggestions = true;
    this.suggestions = [...this.allSuggestions];
  }

  selectSuggestion(suggestion: any) {
    this.searchText = typeof suggestion === 'string' ? suggestion : suggestion.toString();
    this.selectedSuggestion = suggestion;
    this.suggestions = [];
    this.showSuggestions = false;

    const selectedObject = this.fullData.find((item) =>
      this.getNestedProperty(item, this.propertyName).includes(suggestion)
    );

    if (selectedObject) {
      this.selectionChange.emit(selectedObject);
    }
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  handleArrowDown(event: KeyboardEvent) {
    event.preventDefault(); // Prevent default page scrolling
    if (this.suggestions.length > 0) {
      this.highlightedIndex = (this.highlightedIndex + 1) % this.suggestions.length;
      this.scrollToHighlightedItem(); // Scroll to the highlighted item
      this.cdr.detectChanges(); // Manually trigger change detection
    }
  }

  @HostListener('document:keydown.arrowup', ['$event'])
  handleArrowUp(event: KeyboardEvent) {
    event.preventDefault(); // Prevent default page scrolling
    if (this.suggestions.length > 0) {
      this.highlightedIndex = (this.highlightedIndex - 1 + this.suggestions.length) % this.suggestions.length;
      this.scrollToHighlightedItem(); // Scroll to the highlighted item
      this.cdr.detectChanges(); // Manually trigger change detection
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    if (this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
      this.selectSuggestion(this.suggestions[this.highlightedIndex]);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    this.suggestions = [];
    this.showSuggestions = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleAltDown(event: KeyboardEvent) {
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault(); // Prevent default action
      this.showSuggestions = true;
      this.suggestions = [...this.allSuggestions];
      this.highlightedIndex = -1; // Reset highlighted index when showing suggestions
    }
  }

  scrollToHighlightedItem() {
    const highlightedElement = this.eRef.nativeElement.querySelector(
      'ul li:nth-child(' + (this.highlightedIndex + 1) + ')'
    );
    if (highlightedElement) {
      highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  onMouseOver(index: number) {
    this.highlightedIndex = index;
  }

  onMouseOut() {
    this.highlightedIndex = -1;
  }

  private setDefaultValue() {
    if (this.defaultValue) {
      const isValidDefault = this.fullData.some((item) =>
        this.getNestedProperty(item, this.propertyName).includes(this.defaultValue)
      );

      if (!isValidDefault) {
        throw new Error('The default value provided is not found in the data.');
      }

      this.searchText = typeof this.defaultValue === 'string' ? this.defaultValue : this.defaultValue.toString();
      this.selectedSuggestion = this.defaultValue;
      this.suggestions = [];
      this.showSuggestions = false;

      const selectedObject = this.fullData.find((item) =>
        this.getNestedProperty(item, this.propertyName).includes(this.defaultValue)
      );

      if (selectedObject) {
        this.selectionChange.emit(selectedObject);
      }
    }
  }
}
