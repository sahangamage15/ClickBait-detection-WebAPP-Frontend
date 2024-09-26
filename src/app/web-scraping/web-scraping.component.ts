import { Component } from '@angular/core';

interface DataItem {
  topic: string;
  paragraph: string;
}

@Component({
  selector: 'app-web-scraping',
  templateUrl: './web-scraping.component.html',
  styleUrls: ['./web-scraping.component.css']
})
export class WebScrapingComponent {
  // Define the arrays with the correct type
  relevantData: DataItem[] = [];
  irrelevantData: DataItem[] = [];

  // Method to handle the data uploaded event from the child
  handleDataUpload(data: any) {
    // Assuming the data structure contains clickbait_flag
    console.log(data.data);
    this.relevantData = data.data.filter((item: any) => item.clickbait_flag).map((item: any) => ({
      topic: item.title,
      paragraph: item.content
    }));
    console.log("this.relevantData", this.relevantData);
    this.irrelevantData = data.data.filter((item: any) => !item.clickbait_flag).map((item: any) => ({
      topic: item.title,
      paragraph: item.content
    }));
    console.log("this.irrelevantData", this.irrelevantData);
  }
}
