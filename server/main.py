# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import base64
import html
import json
import os

import vertexai
import vertexai.preview.generative_models as generative_models
from flask import Flask, jsonify, request
from vertexai.preview.vision_models import ImageGenerationModel
from vertexai.generative_models import GenerativeModel, Part, FinishReason

app = Flask(__name__)

MAX_IMAGE_COUNT = 5
VERTEX_MAX_IMAGE_COUNT = 4
PROJECT_ID = "imagenio"
LOCATION = "us-central1"

vertexai.init(project=PROJECT_ID, location=LOCATION)

image_model = ImageGenerationModel.from_pretrained("imagegeneration@006")

caption_model = GenerativeModel("gemini-1.5-pro-preview-0409")

caption_generation_config = {
    "max_output_tokens": 8192,
    "temperature": 1,
    "top_p": 0.95,
}

safety_settings = {
    generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}

@app.route("/imagen", methods=['GET', 'POST', 'OPTIONS'])
def get_image():
    if request.method == "OPTIONS":
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)
    
    request_json = request.get_json(silent=True)
    request_args = request.args

    default_image_prompt = 'a picture of a cute cat jumping'
    default_description_prompt = 'describe the image'
    default_image_count = 1
    image_prompt = (request_json or request_args).get('image_prompt', default_image_prompt)
    input_prompt = (request_json or request_args).get('desc_prompt', default_description_prompt)
    text_prompt =  f"""Do this for each image separately: "{html.escape(input_prompt)}". We will call the result of it as the information about an image. Give each image a title. Return the result as a list of objects in json format; each object will correspond one image and the fields for the object will be "title" for the title and "info" for the information."""
    image_count = int((request_json or request_args).get('image_count', default_image_count))

    if image_count > MAX_IMAGE_COUNT:
        return ("Invalid image_count. Maximum image count is 5.", 406)

    try:
        images = get_images_with_count(image_prompt, image_count)
        image_strings = []
        caption_input = []
        for img in images:
            temp_bytes = img._image_bytes
            image_strings.append(base64.b64encode(temp_bytes).decode("ascii"))
            temp_image=Part.from_data(
                    mime_type="image/png",
                    data=temp_bytes)
            caption_input.append(temp_image)
        captions = caption_model.generate_content(
            caption_input + [text_prompt],
            generation_config=caption_generation_config,
            safety_settings=safety_settings,
        )
        captions_list = make_captions(captions)
    except Exception as error:
        return (jsonify({ "error": str(error) }), 500, { "Access-Control-Allow-Origin": "*" })
    
    resp_images_dict = []
    for img, cap in zip(image_strings, captions_list):
        resp_images_dict.append({"image": img, "caption": cap["description"], "title": cap["title"]})
    resp = jsonify(resp_images_dict)
    resp.headers.set("Access-Control-Allow-Origin", "*")
    return resp


def get_images_with_count(image_prompt, image_count):
    current_image_count = 0
    images = []
    while current_image_count < image_count:
        remaining_image_count = image_count - current_image_count
        allowed_image_count = min(VERTEX_MAX_IMAGE_COUNT, remaining_image_count)
        temp_images = image_model.generate_images(
            prompt=image_prompt,
            # Optional parameters
            number_of_images=allowed_image_count,
            language="en",
            # You can't use a seed value and watermark at the same time.
            # add_watermark=False,
            # seed=100,
            aspect_ratio="1:1",
            safety_filter_level="block_some",
            person_generation="allow_adult",
        )
        images.extend(temp_images)
        current_image_count = len(images)
        print(f'Images generated so far: {current_image_count}')
    return images


def make_captions(captions):
    captions_text = captions.text
    # Sometimes the result is returned with a json field specifier
    print(captions_text)
    if captions_text.startswith("```json"):
        captions_text = captions_text[7:-4]
    captions_list = json.loads(captions_text)
    final_captions = []
    for caption in captions_list:
        title = caption["title"]
        desc = caption["info"]
        final_captions.append({"title": title, "description": desc})
    return final_captions


@app.route("/")
def hello_world():
    """Example Hello World route."""
    name = os.environ.get("NAME", "World")
    return f"Hello {name}!"


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
