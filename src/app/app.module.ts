import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderIndicatorComponent } from './loader-indicator/loader-indicator.component';
import { FormatDurationPipe } from './format-duration.pipe';

@NgModule({
  declarations: [AppComponent, MainComponent, LoaderIndicatorComponent, FormatDurationPipe],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
