
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
