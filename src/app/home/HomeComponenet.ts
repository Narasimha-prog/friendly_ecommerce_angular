import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {  FeaturedComponent } from '../hero/featured/FeaturedComponenet';

@Component({
  selector: 'app-home-componenet',
  imports: [CommonModule,RouterModule,FeaturedComponent],
  templateUrl: './HomeComponenet.html',
  styleUrl: './HomeComponenet.scss',
})
export class HomeComponenet {

}
