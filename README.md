<div
  *ngIf="showModal"
  class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
  <div class="bg-white rounded-lg w-3/4 max-w-lg shadow-lg">
    <div class="p-4 flex justify-between items-center border-b border-gray-300">
      <h2 class="text-lg font-bold">API Results</h2>
      <button
        (click)="closeModal()"
        class="text-gray-500 hover:text-gray-800 font-bold">
        &times;
      </button>
    </div>
    <div class="p-4">
      <ng-container *ngIf="data">
        <div *ngFor="let item of data" class="py-2">
          <p>{{ item.title }}</p>
        </div>
      </ng-container>
      <ng-container *ngIf="!data">
        <p>No data available</p>
      </ng-container>
    </div>
    <div class="p-4 border-t border-gray-300">
      <button
        (click)="closeModal()"
        class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
        Close
      </button>
    </div>
  </div>
</div>
