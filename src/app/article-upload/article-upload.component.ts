import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

// Interface to define the structure of data items
interface DataItem {
  topic: string;
  paragraph?: string;  // Paragraph is optional in some cases
}

@Component({
  selector: 'app-article-upload',
  templateUrl: './article-upload.component.html',
  styleUrls: ['./article-upload.component.css'],
})

export class ArticleUploadComponent {
  data: { topic: string, paragraph: string[] }[] = [];
  value: string | undefined;

  @Output() dataUploaded: EventEmitter<any> = new EventEmitter();

  relevantData: DataItem[] = [];
  irrelevantData: DataItem[] = [];

  topics: string[] = []; // Array to hold topics for processing
  topic: string = '';  // Single topic to be sent to backend

  // API endpoint URL
  apiUrl: string = 'http://127.0.0.1:8000/clickbait-detection/titles-only-detection';

  successMessage: string = ''; // Success message placeholder
  errorMessage: string = '';   // Error message placeholder

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  // Method to handle data upload and separate relevant/irrelevant data
  handleDataUpload(data: any) {
    // Assuming the data structure contains clickbait_flag
    console.log(data.data);
    this.relevantData = data.data.filter((item: any) => item.clickbait_flag).map((item: any) => ({
      topic: item.topic
    }));
    console.log("this.relevantData", this.relevantData);
    this.irrelevantData = data.data.filter((item: any) => !item.clickbait_flag).map((item: any) => ({
      topic: item.title
    }));
    console.log("this.irrelevantData", this.irrelevantData);
  }

  // Method to send a topic to the backend and get a response
  processTopic() {
    // Clear previous messages
    this.successMessage = '';
    this.errorMessage = '';

    // Check if the topic is provided
    if (!this.topic) {
      this.errorMessage = 'Please enter a topic to process';
      return;
    }

    // Send the topic to the backend using HTTP POST
    this.http.post<any>(this.apiUrl, { topic: this.topic })
      .subscribe(
        (response) => {
          this.successMessage = 'Topic processed successfully!';
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.successMessage });
        },
        (error) => {
          this.errorMessage = error.error.message || 'An error occurred while processing the topic';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage });
        }
      );
  }
}
