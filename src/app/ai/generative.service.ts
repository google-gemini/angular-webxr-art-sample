import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable( {
      providedIn: 'root'
} )
export class GenerativeService {
      private http = inject( HttpClient );
      private url = environment.apiUrl;;

      // Generates an image and description
      generateImage ( ops: any ) {
            const imagePrompt = ops.prompt;
            const question = ops.question; //|| "Describe the image and tell me what makes this artwork beautiful";
            const params = {
                  image_prompt: encodeURIComponent( imagePrompt ),
                  desc_prompt: encodeURIComponent( question )
            };
            const options = {
                  params: params,
                  headers: new HttpHeaders( { 'Content-Type': 'header' } )
            };

            return this.http.get( this.url, options );
      }
}
