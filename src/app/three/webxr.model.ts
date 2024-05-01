import { Camera, Light } from 'three';

export type ColliderObjectModel = {
    name: string;
    mesh: any;
    cb: Function;
};

export type ColliderOptions = {
    name?: string;
    mesh: any;
    cb?: Function;
};

export type SceneOptions = {
    canvas: HTMLCanvasElement;
    animate?: Function;
    camera?: Camera;
    xrMode?: boolean;
    lights?: Light[];
};
