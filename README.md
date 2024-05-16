# Angular WebXR Art Sample


Angular WebXR Art Sample is a WebXR Gallery that creates Generative AI images using [Vertex AI Image Generation](https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview) and creates captioning using [Gemini Multimodel API](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/overview#multimodal_models).

<a href="https://idx.google.com/import?url=https://github.com/google-gemini/angular-webxr-art-sample">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.idx.dev/btn/open_dark_32@2x.png">
  <source media="(prefers-color-scheme: light)" srcset="https://cdn.idx.dev/btn/open_light_32@2x.png">
  <img height="32" alt="Open in IDX" src="https://cdn.idx.dev/btn/open_purple_32@2x.png">
</picture>
</a>

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.0-rc.1.

[![Angular WebXR Art Sample](http://img.youtube.com/vi/XRvymNPSVF4/0.jpg)](https://www.youtube.com/shorts/XRvymNPSVF4)

## Pre-requisites

1. Node.js and npm
  * Download and install Go: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
2. Gemini API key
  * Launch Google AI Studio: https://aistudio.google.com/
  * Click “Get API Key”

## Setup


To get started with the Angular app without setting up the Gemini API, you can install the dependencies and run start script. 

You need have install Node version 18 and up installed in your development environment.

```
npm install
npm run start
```

### Setting up Gemini API

[Imagen on Vertex AI | AI Image Generator](https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview#feature-launch-stage) image generation feature currently requires allow list. Fill out the [the request form](https://docs.google.com/forms/d/1cqt9padvfMgqn23W5FMPTqh7bW1KLkEOsC5G6uC-uuM/viewform) to get access to the API.

[Enable Gemini Vertex AI](https://console.cloud.google.com/vertex-ai/generative/multimodal/create/text?model=gemini-1.5-pro-preview-0409) in a Google Cloud Project.


#### Run Gemini API locally

- [Install Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- Run the below commands in your terminal on the root of this project

```
cd server
gcloud init
gcloud config set project <PROJECT_ID>
gcloud auth application-default login
python3 -m venv .
. bin/activate
pip install -r requirements.txt
python main.py
```

- Once the Python server is running, start the Angular server in your root folder

```
npm i
```

#### Call the Gemini API in a cloud Function(Optional)

If you would like to run the API on a Google Cloud Function, follow these steps:

- Create a [HTTP triggered Google Cloud Function](https://cloud.google.com/functions/docs/writing/write-http-functions#http-example-python) to make a call to GEMINI API. Copy paste the [Functions/getImages.py](Functions/getImages.py) code in Google Console and deploy your function.
- Replace GEMINI_API_URL value in your src/environments/environment.ts file with the URL of the Google Function API endpoint.


### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
