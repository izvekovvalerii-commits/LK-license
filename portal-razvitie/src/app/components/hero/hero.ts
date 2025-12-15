import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent {
  constructor(private router: Router) { }

  onStartClick() {
    this.router.navigate(['/projects']);
  }
}
