import { Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { LoadingComponent } from './loading/loading.component';
import { TestComponent } from './three/test/test.component';
import { PortalComponent } from './portal/portal.component';

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
        path: 'portal',
        component: PortalComponent,
        title: 'Portal'
    },
    {
        path: 'test',
        component: TestComponent,
        title: 'Test'
    },
    {
        path: '',
        redirectTo: '/gallery',
        pathMatch: 'full'
    }
];
