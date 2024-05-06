/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
