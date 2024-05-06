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


import * as puppeteer from 'puppeteer';

const baseUrl = process.env['baseUrl'] ?? 'http://localhost:4200/';
let browser: puppeteer.Browser;
let page: puppeteer.Page;

export function setupBrowserHooks(path = ''): void {

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new'
    });
  });


  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(`${baseUrl}${path}`);
  });

  afterEach(async () => {
    await page?.close();
  });


  afterAll(async () => {
    await browser?.close();
  });

}

export function getBrowserState(): {
  browser: puppeteer.Browser;
  page: puppeteer.Page;
  baseUrl: string;
} {
  if (!browser) {
    throw new Error(
      'No browser state found! Ensure `setupBrowserHooks()` is called.'
    );
  }
  return {
    browser,
    page,
    baseUrl,
  };
}
