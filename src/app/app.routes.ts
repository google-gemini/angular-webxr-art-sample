import { Routes } from '@angular/router';

import { ImageGenComponent } from './ai/image-gen/image-gen.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LoadingComponent } from './loading/loading.component';
import { MuseumComponent } from './museum/museum.component';

export const routes: Routes = [
    {
        path: 'loading',
        component: LoadingComponent,
        title: 'Loading'
    },
    {
        path: 'museum',
        component: MuseumComponent,
        title: 'WebXR Museum'
    },
    {
        path: 'gallery',
        component: GalleryComponent,
        title: 'WebXR Gallery'
    },
    {
        path: 'imagegen',
        component: ImageGenComponent,
        title: 'Generative AI'
    },
    {
        path: '',
        redirectTo: '/museum',
        pathMatch: 'full'
    }
];
