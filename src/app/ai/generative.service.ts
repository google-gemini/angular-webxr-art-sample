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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable( {
      providedIn: 'root'
} )
export class GenerativeService {

      private http = inject( HttpClient );
      private url = environment.GEMINI_API_URL;

      generateImages ( ops: any ) {

            const imagePrompt = ops.prompt;
            const question = ops.question;
            const params = {
                  image_prompt: encodeURIComponent( imagePrompt ),
                  desc_prompt: encodeURIComponent( question ),
                  image_count: 5
            };
            const options = {
                  params: params,
                  headers: new HttpHeaders( { 'Content-Type': 'header' } )
            };
            return this.http.get( `${this.url}`, options );
      }

}
