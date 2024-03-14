import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TweetComponent } from './tweet/tweet.component';

@Component( {
  selector: 'art-root',
  standalone: true,
  imports: [RouterOutlet, TweetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
} )
export class AppComponent {
  title = 'angular-webxr-gallery';
}
