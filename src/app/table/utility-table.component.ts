import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-utility-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./utility-table.component.html",
  styleUrls: ['./utility-table.component.css']
})
export class UtilityTableComponent implements OnInit {
  @Input() data: any[] | Observable<any[]> | undefined | null = [];
  @Input() defaultSortColumn: string | null = 'name';
  @Input() defaultSortDirection: 'asc' | 'desc' | '' = 'desc';
  @Input() paginationOptions: number[] = [8, 10, 15, 20];
  @Input() placeholderText: string = 'Search...';
  @Input() isVertical: boolean = false;
  @Input() hideSearchbox: boolean = false;
  @Input() hideViewSelector: boolean = false;
  @Input() hidePaginator: boolean = false;
  @Input() size: "xs" | "sm" | "md" | "lg" = "xs";
  @Input() noRowBorders: boolean = false;
  @Input() noActions: boolean = false;


  itemsPerPage = 0;
  displayedColumns: string[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  searchTerm: string = '';
  page: number = 1;
  totalPages: number = 1;

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';

  private dataSubject = new BehaviorSubject<any[]>([]);

  ngOnInit() {
    if (this.data !== undefined && this.data !== null) {
      const dataObservable: Observable<any[]> = this.data instanceof Observable ? this.data : of(this.data);
      this.itemsPerPage = this.paginationOptions[0] || 10; // Initialize itemsPerPage safely
      dataObservable.subscribe(data => {
        if (data === null || data === undefined) {
          data = [];
        }
        this.dataSubject.next(data);
        this.initializeTable(data);
        this.applyFilter(); // Initialize filtering and pagination
        if (this.defaultSortColumn) {
          this.sortData(this.defaultSortColumn, false); // Apply default sorting
        }
      });
    }
    if (!this.noActions) {
      this.displayedColumns.push("Actions");
    }
  }
  initializeTable(data: any[]) {
    if (data.length > 0) {
      this.displayedColumns = Object.keys(data[0]);
    }
  }

  applyFilter() {
    this.filteredData = this.dataSubject.getValue().filter(item =>
      Object.values(item).some(
        val => val?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );

    // Calculate total pages based on filtered data
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);

    // Ensure current page is within bounds
    if (this.page > this.totalPages) {
      this.page = this.totalPages;
    } else if (this.page < 1) {
      this.page = 1;
    }

    this.paginateData();
  }

  sortData(column: string | null, resetPage: boolean = true) {
    if (!column) return;

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = this.defaultSortDirection; // Use the input default sort direction
    }

    this.filteredData.sort((a, b) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';

      const comparison = valueA.toString().localeCompare(valueB.toString(), undefined, { numeric: true });

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    if (resetPage) {
      this.page = 1; // Reset to first page after sorting
    }

    this.paginateData();
  }

  paginateData() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Ensure endIndex does not exceed filteredData length
    if (endIndex > this.filteredData.length) {
      this.paginatedData = this.filteredData.slice(startIndex);
    } else {
      this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.paginateData();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.paginateData();
    }
  }

  onItemsPerPageChange() {
    this.page = 1; // Reset to first page when items per page changes
    this.applyFilter();
  }
}
