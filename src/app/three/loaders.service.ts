import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class LoadersService {
  public loadingProgress: WritableSignal<number> = signal( 0 );
  constructor() { }

  loadGLTF ( path: string ) {

  }
}
