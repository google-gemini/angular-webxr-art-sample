# Angular WebXR Art Sample

Angular WebXR Art Sample is a WebXR Gallery that creates Generative AI images using [Vertex AI Image Generation](https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview) and creates captioning using [Gemini Multimodel API](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/overview#multimodal_models).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.0-rc.1.

## Setup

To get started with the Angular app without setting up the Gemini API, you can install the dependencies and run start script. 

`
yarn install
yarn start
`

### Setting up Gemini API

- Run `yarn env` to create environments folder for your project. 
- Create a [HTTP triggered Google Cloud Function](https://cloud.google.com/functions/docs/writing/write-http-functions#http-example-python) to make a call to GEMINI API. Copy paste the [Functions/getImages.py](Functions/getImages.py) code in Google Console and deploy.
- Add the Google Function API endpoint url to your environment file as shown in environment.sample.ts file

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
