/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {setupBrowserHooks, getBrowserState} from './utils';

describe('App test', function () {
  setupBrowserHooks();
  it('is running', async function () {
    const {page} = getBrowserState();
    const element = await page.locator('::-p-text(angular-webxr-gallery)').wait();

    expect(element).not.toBeNull();

  });
  it('is running with canvas element', async function () {
    const { page } = getBrowserState();

    // Your existing test code...

    // Check for the presence of the Angular webXR gallery element
    const galleryElement = await page.locator('::-p-text(angular-webxr-gallery)').wait();
    expect(galleryElement).not.toBeNull();

    // New test command to check for a canvas element
    const canvasElement = await page.locator('canvas').wait();

    // Assertion for the canvas element
    expect(canvasElement).not.toBeNull();
  });

});
