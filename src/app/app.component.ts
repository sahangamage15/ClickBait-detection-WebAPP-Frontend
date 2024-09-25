import { Component } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from "@angular/common/http";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent {
  title = 'clickbait-detection-webapp-frontend';
// Define menu items for navigation
  items = [
    { label: 'Dashboard', icon: 'pi pi-fw pi-home' },
    { label: 'Transactions', icon: 'pi pi-fw pi-dollar' },
    { label: 'Products', icon: 'pi pi-fw pi-list' }
  ];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  uploadProgress: number = 0; // Track file upload progress
  maxFileSize: number = 1000000; // 1MB
  selectedFiles: File[] = []; // Store selected files for further operations

  constructor(private messageService: MessageService, private http: HttpClient) {}

  // Method to handle file selection and update file size
  onSelectedFiles(event: any) {
    this.selectedFiles = event.files; // Store selected files
    this.calculateTotalSize(event.files);
  }

  // Method to calculate the total file size and percentage
  calculateTotalSize(files: any[]) {
    this.totalSize = files.reduce((acc, file) => acc + file.size, 0);
    this.totalSizePercent = (this.totalSize / this.maxFileSize) * 100;

    // Show warning if the total size exceeds the maximum limit
    if (this.totalSizePercent > 100) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Total file size exceeds limit' });
    }
  }

  // Upload selected files to the backend
  uploadFiles() {
    if (this.selectedFiles.length === 0) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No files selected' });
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file); // Add files to FormData
    });

    this.http.post('https://your-api-url.com/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress) {
          // Update progress bar
          this.uploadProgress = event.total ? Math.round(100 * (event.loaded / event.total)) : 0;
        } else if (event instanceof HttpResponse) {
          // Handle successful upload
          this.onTemplatedUpload();
        }
      },
      error: () => {
        // Handle upload error
        this.onUploadError();
      }
    });
  }

  // Handle file upload success
  onTemplatedUpload() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File(s) uploaded successfully' });
    // Reset the selected files after successful upload
    this.selectedFiles = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.uploadProgress = 0; // Reset progress
  }

  // Handle file upload failure
  onUploadError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File upload failed' });
  }

  // Manually trigger file upload
  uploadEvent(callback: any) {
    if (this.selectedFiles.length > 0) {
      callback(); // Trigger file upload
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No files selected' });
    }
  }

  // Select files manually
  choose(event: any, callback: any) {
    callback();
  }

  // Remove file and recalculate size
  onRemoveTemplatingFile(event: any, file: any, callback: any, index: number) {
    callback(index);
    this.calculateTotalSize(event.files);
  }

  // Format file size
  formatSize(size: number): string {
    return `${(size / 1024).toFixed(2)} KB`; // Convert to KB and format
  }

  // Clear the file upload selection
  clearFiles(clearCallback: any) {
    clearCallback();
    this.selectedFiles = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.uploadProgress = 0; // Reset progress
  }
}
