import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer';

// Helper function moved outside
async function typeSlowly(page: Page, selector: string, text: string) {
  await page.waitForSelector(selector);
  for (let char of text) {
    await page.type(selector, char, { delay: 100 });
  }
}

export async function POST(req: Request) {
  // Create a TransformStream to send messages
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Helper to send messages to the client
  const sendMessage = async (message: string) => {
    console.log(message);
    await writer.write(
      new TextEncoder().encode(
        JSON.stringify({ status: 'loading', message }) + '\n'
      )
    );
  };

  // Start the automation in the background
  (async () => {
    let browser;
    try {
      await sendMessage("🤖 Thinking ...");
      
      browser = await puppeteer.launch({
        headless: false,  // Show browser for clipboard access
        defaultViewport: null,
        args: [
          '--start-maximized',
          '--allow-insecure-localhost',
          '--enable-clipboard-read',
          '--enable-clipboard-write',
          '--disable-permissions-api',
          '--allow-clipboard-access'
        ]
      });
      
      await sendMessage("🌐 Warming up the engines...");
      const page = await browser.newPage();
      
      // Auto-accept clipboard permission
      const context = page.browserContext();
      await context.overridePermissions('https://app.jobtread.com', ['clipboard-read', 'clipboard-write']);
      
      await page.setDefaultNavigationTimeout(60000);
      await page.setDefaultTimeout(30000);

      await sendMessage("🔑 Sneaking into JobTread...");
      await page.goto('https://app.jobtread.com');
      await typeSlowly(page, 'input[type="email"]', 'elliott@builtwithlovellc.com');
      await typeSlowly(page, 'input[type="password"]', '1Qaz!wsx');
      
      await sendMessage("🚪 Knocking on the door...");
      await page.click('button[type="submit"]');
      await page.evaluate(() => new Promise(r => setTimeout(r, 3000)));

      await sendMessage("🎯 Navigating to the secret vault...");
      await page.goto('https://app.jobtread.com/settings/integrations/api/grants');
      await page.evaluate(() => new Promise(r => setTimeout(r, 3000)));
      
      const buttonSelector = 'div[role="button"]';
      await page.waitForSelector(buttonSelector);
      
      const buttons = await page.$$('div[role="button"]');
      const buttonTexts = await Promise.all(
        buttons.map(button => page.evaluate(el => el.textContent, button))
      );
      const buttonIndex = buttonTexts.findIndex(text => text?.includes('Add Grant to All Organizations'));
      
      if (buttonIndex !== -1) {
        await buttons[buttonIndex].click();
      } else {
        throw new Error('Button not found');
      }

      const inputSelector = 'input.rounded.border.p-2.w-full';
      await page.waitForSelector(inputSelector);
      await page.$eval(inputSelector, (el: HTMLInputElement) => el.value = '');
      await typeSlowly(page, inputSelector, 'DATAx Grant');
      await page.click('button[type="submit"]');
      
      await sendMessage("📋 Getting the grant key...");
      // Wait for the text-center div that appears after submit
      await page.waitForSelector('.text-center > div:last-child');
      await page.evaluate(() => new Promise(r => setTimeout(r, 2000))); // Give it time to fully appear
      
      const grantKey = await page.evaluate(() => {
        const element = document.querySelector('.text-center > div:last-child');
        const text = element?.textContent?.trim() || '';
        // Look for a string that's 30+ characters of letters and numbers
        const match = text.match(/[A-Za-z0-9]{30,}/);
        return match ? match[0] : '';
      });

      if (!grantKey) {
        throw new Error('Could not find grant key');
      }
      
      await sendMessage(`🎉 Success! Grant key acquired: ${grantKey}`);
      
      // Send final success message with the key
      await writer.write(
        new TextEncoder().encode(
          JSON.stringify({ status: 'complete', grantKey }) + '\n'
        )
      );
      
    } catch (error) {
      await sendMessage(`💥 Error: ${error}`);
    } finally {
      if (browser) {
        await browser.close();
      }
      await writer.close();
    }
  })();

  // Return the readable stream to the client
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
