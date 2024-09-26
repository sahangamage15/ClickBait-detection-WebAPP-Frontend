import { Component  , OnInit } from '@angular/core';
import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit{
  files: File[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  data: { topic: string, paragraph: string[] }[] = [];  // Array to hold parsed JSON data (topics and paragraphs)

  constructor(private config: PrimeNGConfig, private messageService: MessageService) {}

  choose(event: Event, callback: Function) {
    callback();
  }

  // Handle file removal logic
  onRemoveTemplatingFile(event: Event, file: any, removeFileCallback: Function, index: number) {
    removeFileCallback(event, index);
    this.totalSize -= file.size;
    this.totalSizePercent = this.totalSize / 10;
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

    // Clear previous total size and reset percent
    this.totalSize = 0;
    this.totalSizePercent = 0;

    // Read the files
    this.files.forEach((file) => {
      if (file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64File = e.target.result;
            // Store the file data (you may want to save more details like name and type)
          const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
          storedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            content: base64File
          });
          
          localStorage.setItem('uploadedFiles', JSON.stringify(storedFiles));
          
            try {
              const jsonData = JSON.parse(e.target.result); 
              // Adjust for your JSON structure: extract 'original_topic' and 'original_paragraphs'
              this.data = jsonData.map((item: any) => ({
                topic: item.original_topic,
                paragraph: item.original_paragraphs  // assuming this is a string, not an array
              }));

            } catch (error) {
              console.error('Invalid JSON format', error);
            }
        };
        reader.readAsText(file);
      }

      this.totalSize += file.size;
    });

    this.totalSizePercent = this.totalSize / 10;
  }


  uploadEvent(callback: Function) {
    callback();
  }

  // Format file sizes to readable formats
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
      console.log(storedFiles);

      this.files = storedFiles.map((storedFile: any) => {
        const blob = this.base64ToBlob(storedFile.content, storedFile.type);
        return new File([blob], storedFile.name, { type: storedFile.type });
      });

      // Update the total size and percentage
      this.totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
      this.totalSizePercent = this.totalSize / 10;
    }
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
  
}
