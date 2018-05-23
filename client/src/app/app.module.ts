import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatFrameComponent } from './chat-frame/chat-frame.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {GreyToast} from './grey.toast';


@NgModule({
  declarations: [
    AppComponent,
    ChatFrameComponent,
    WelcomeComponent,
    FooterComponent,
    HeaderComponent,
    GreyToast
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    ToastrModule.forRoot({
      toastComponent: GreyToast
    })
  ],
  entryComponents: [GreyToast],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
