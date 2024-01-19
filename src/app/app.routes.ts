import { Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { LoadingComponent } from './loading/loading.component';

export const routes: Routes = [
    {
        path: 'loading',
        component: LoadingComponent,
        title: 'Loading'
    },
    {
        path: 'gallery',
        component: GalleryComponent,
        title: 'WebXR Gallery'
    },
    {
        path: '',
        redirectTo: '/loading',
        pathMatch: 'full'
    }
];
