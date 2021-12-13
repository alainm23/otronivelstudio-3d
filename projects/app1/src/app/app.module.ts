import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component'

// List of providers
const providers: any [] = [];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers,
  bootstrap: [AppComponent]
})
export class AppModule { }

@NgModule({})
export class App1SharedModule{
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers
    }
  }
}
