import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-topics-upload',
  templateUrl: './topics-upload.component.html',
  styleUrls: ['./topics-upload.component.css']
})
export class TopicsUploadComponent {
  // Define an output property
  @Output() dataUploaded: EventEmitter<any> = new EventEmitter();
  files: File[] = [];
  totalSize: number = 0;
  formData: FormData = new FormData();  // Initialize formData
  totalSizePercent: number = 0;
  topics: string[] = [];  // Array to hold topics extracted from JSON
  apiUrl: string = 'http://127.0.0.1:8000/clickbait-detection/titles-only-detection'; // API endpoint URL

  constructor(private config: PrimeNGConfig, private messageService: MessageService, private http: HttpClient) {}

  choose(event: Event, callback: Function) {
    callback();
  }

  // Handle file removal logic
  onRemoveTemplatingFile(event: Event, file: any, removeFileCallback: Function, index: number) {
    removeFileCallback(event, index);
    this.totalSize -= file.size;
    this.updateTotalSizePercent();
  }

  // Handle clearing file upload
  onClearTemplatingUpload(clear: Function) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
    localStorage.removeItem('uploadedFiles');  // Clear saved files from localStorage
  }

  // Display toast notification after successful upload
  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  // Handle file selection and parse JSON if applicable
  onSelectedFiles(event: any) {
    this.files = event.currentFiles as File[];
    this.formData = new FormData();  // Reset formData when new files are selected

    // Clear previous total size and reset percentage
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.topics = [];  // Clear previous topics

    this.files.forEach((file) => {
      this.totalSize += file.size;
      if (file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            // Extract all topics from the JSON file and add to topics array
            this.topics = jsonData.map((item: any) => item.original_topic);
            console.log('Extracted Topics:', this.topics);
          } catch (error) {
            console.error('Invalid JSON format', error);
          }

          // Store the file data in formData
          this.formData.append('file', file, file.name);
        };
        reader.readAsText(file);
      }
    });

    this.updateTotalSizePercent();
  }

  // Method to post the topics array directly to the backend
  uploadFile() {
    const payload = {
      titles: this.topics // Make sure this matches the Titles model in FastAPI
    };

    this.http.post(this.apiUrl, payload).subscribe({
      next: (response) => {
        console.log('Topics uploaded successfully:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Topics uploaded successfully',
          life: 3000,
        });
        this.dataUploaded.emit(response);
      },
      error: (error) => {
        console.error('Error uploading topics:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Topics upload failed',
          life: 3000,
        });
      }
    });
  }

  uploadEvent(callback: Function) {
    // Post the topics to the backend
    this.uploadFile();
    callback();
  }

  // Helper method to update total size percentage
  updateTotalSizePercent() {
    this.totalSizePercent = (this.totalSize / 1048576) * 100;  // Convert to MB and calculate percentage
  }

  // Helper function to convert Base64 to Blob
  base64ToBlob(base64: string, type: string) {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type });
  }

  formatSize(bytes: number): string {
    const k = 1024;
    const dm = 2;
    const sizes = this.config.translation.fileSizeTypes || ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  ngOnInit() {
    // Restore previously uploaded files from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      this.files = storedFiles.map((storedFile: any) => {
        const blob = this.base64ToBlob(storedFile.content, storedFile.type);
        return new File([blob], storedFile.name, { type: storedFile.type });
      });

      // Update the total size and percentage
      this.totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
      this.updateTotalSizePercent();
    }
  }

  uploadEventBtn() {
    // Post the file to the backend
    this.uploadFile();
  }
}
