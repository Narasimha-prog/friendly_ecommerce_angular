import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaConfig, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awsome-icons';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from "./layout/footer/footer";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Toast} from './shared/model/toast/toast';
import {AuthService} from './auth/authService'


@Component({
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, Navbar, Footer,CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {

  private faIconLibrary = inject(FaIconLibrary);
  private faConfig = inject(FaConfig);
  private auth = inject(AuthService);

toastService = inject(Toast);
platformId = inject(PLATFORM_ID);

constructor(){
if(isPlatformBrowser(this.platformId)){

  this.auth.fetch();
}

this.auth.connectedUserQuery= this.auth.fetch();

}
  ngOnInit() {
    this.initFontAwesome();
    this.toastService.show('Welcome to the E-commerce Application!', 'SUCCESS');
  }
  
   private initFontAwesome() {
    this.faConfig.defaultPrefix = 'far';
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }
 
}
