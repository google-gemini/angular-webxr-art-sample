# Angular WebXR Art Sample


Angular WebXR Art Sample is a WebXR Gallery that creates Generative AI images using [Vertex AI Image Generation](https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview) and creates captioning using [Gemini Multimodel API](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/overview#multimodal_models).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.0-rc.1.

[![Angular WebXR Art Sample](http://img.youtube.com/vi/B-k8ZNVM-F4/0.jpg)](https://youtu.be/B-k8ZNVM-F4)

## Pre-requisites

1. Node.js and npm
  * Download and install Go: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
2. Gemini API key
  * Launch Google AI Studio: https://aistudio.google.com/
  * Click “Get API Key”

## Setup

To get started with the Angular app without setting up the Gemini API, you can install the dependencies and run start script. 

```
yarn install
yarn start
```

### Setting up Gemini API

- Run `yarn env` to create environments folder for your project. 
- Create a [HTTP triggered Google Cloud Function](https://cloud.google.com/functions/docs/writing/write-http-functions#http-example-python) to make a call to GEMINI API. Copy paste the [Functions/getImages.py](Functions/getImages.py) code in Google Console and deploy.
- Add the Google Function API endpoint url to your environment file as shown in environment.sample.ts file

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
