import { Routes } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { TestComponent } from './three/test/test.component';
import { ImageGenComponent } from './ai/image-gen/image-gen.component';
import { MuseumComponent } from './museum/museum.component';

export const routes: Routes = [
    {
        path: 'loading',
        component: LoadingComponent,
        title: 'Loading'
    },
    {
        path: 'gallery',
        component: MuseumComponent,
        title: 'WebXR Gallery'
    },
    {
        path: 'test',
        component: TestComponent,
        title: 'Test'
    },
    {
        path: 'imagegen',
        component: ImageGenComponent,
        title: 'Generative AI'
    },
    {
        path: '',
        redirectTo: '/gallery',
        pathMatch: 'full'
    }
];
