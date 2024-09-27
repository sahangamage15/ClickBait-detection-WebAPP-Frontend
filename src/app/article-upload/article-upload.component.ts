import { Component } from '@angular/core';
import { Message } from 'primeng/api';
interface DataItem {
  topic: string;
  paragraph: string;
}
// import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-article-upload',
  templateUrl: './article-upload.component.html',
  styleUrls: ['./article-upload.component.css'], // Corrected to styleUrls
})

export class ArticleUploadComponent {
  data: { topic: string, paragraph: string[] }[] = [];
  value: string | undefined;
  messages: Message[];
  // Define the arrays with the correct type
  relevantData: DataItem[] = [];
  irrelevantData: DataItem[] = [];

  // Method to handle the data uploaded event from the child
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

  constructor() {
    // Initializing messages inside the constructor
    this.messages = [
      { severity: 'success', detail: 'Success Message' },
      { severity: 'error', detail: 'Error Message' },
    ];
  }
}

