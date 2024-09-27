import { Component } from '@angular/core';
import { Message } from 'primeng/api';
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

  constructor() {
    // Initializing messages inside the constructor
    this.messages = [
      { severity: 'success', detail: 'Success Message' },
      { severity: 'error', detail: 'Error Message' },
    ];
  }
}

