import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { FileUploadModule } from 'primeng/fileupload';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {AccordionModule} from "primeng/accordion";
import {TabMenuModule} from "primeng/tabmenu";
import {RouterModule, Routes} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {ToastModule} from "primeng/toast";
import {BadgeModule} from "primeng/badge";
import { WebScrapingComponent } from './web-scraping/web-scraping.component';
import { ArticleUploadComponent } from './article-upload/article-upload.component';
import {OrderListModule} from "primeng/orderlist";

const routes: Routes = [
  { path: 'web-scraping', component: WebScrapingComponent },
  { path: 'article-upload', component: ArticleUploadComponent },
  { path: '', redirectTo: '/web-scraping', pathMatch: 'full' },  // Default route
  { path: '**', redirectTo: '/web-scraping' }  // Wildcard route
];

@NgModule({
  declarations: [AppComponent, NavbarComponent, FileUploadComponent, WebScrapingComponent, ArticleUploadComponent],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatTabsModule,
    FileUploadModule,
    AccordionModule,
    TabMenuModule,
    AppRoutingModule,
    ToastModule,
    RouterModule,
    BadgeModule,
    OrderListModule
  ],
  providers: [
    provideHttpClient(withFetch()) // Enables fetch API for HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
