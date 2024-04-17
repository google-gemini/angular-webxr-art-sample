import { Component, WritableSignal, signal } from '@angular/core';

@Component( {
  selector: 'art-tweet',
  standalone: true,
  imports: [],
  templateUrl: './tweet.component.html',
  styleUrl: './tweet.component.scss'
} )
export class TweetComponent {

  baseUrl = "https://twitter.com/intent/tweet";
  hashtags = "Angular,WebXR,AngularSignals";
  text = "Checkout Angular WebXR Art Gallery!";
  imageUrl = "https://raw.githubusercontent.com/ARtist-Devs/angular-webxr-gallery/main/src/assets/images/thumbnail.webp";

  public tweetHref: WritableSignal<string> = signal(
    `${this.baseUrl}?text=${encodeURIComponent( this.text )}&hashtags=${this.hashtags
    }&url=https://webxr.art&image=${this.imageUrl}`,
  );

  onTweet ( ops?: any ) {
    this.tweetHref.set(
      `${this.baseUrl}?text=${encodeURIComponent( this.text )}&hashtags=${this.hashtags
      }`,
    );
  }

}
