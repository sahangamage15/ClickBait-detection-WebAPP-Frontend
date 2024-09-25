import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // Define the items array for the tab menu
  items: MenuItem[] = [];

  // Variable to track the active item
  activeItem: MenuItem | undefined;

  ngOnInit(): void {
    // Initialize the items in the tab menu with routerLinks
    this.items = [
      { label: 'Web Scraping', icon: 'pi pi-search', routerLink: '/web-scraping' },  // Search icon
      { label: 'Article Upload', icon: 'pi pi-upload', routerLink: '/article-upload' }  // Upload icon
    ];

    // Set the first item as the active item by default
    this.activeItem = this.items[0];
  }

  // Event handler for when the active tab changes
  onActiveItemChange(event: MenuItem): void {
    this.activeItem = event;
  }
}
