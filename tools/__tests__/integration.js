import path from 'path';
import { readFile, writeFile } from '../lib/fs';
import {
  killApp,
  waitApp,
  timeout,
  openBrowser,
  getUrl,
} from '../lib/test-fns';
import { spawn } from '../lib/cp';

const startApp = (cwd, port) =>
  spawn('yarn', ['start', '--silent'], {
    cwd,
    env: { PORT: String(port) },
  });

describe('yarn start', () => {
  const port = 5000;
  const cwd = path.resolve(__dirname, '../..');
  const app = startApp(cwd, port);
  let browser;
  let page;

  beforeAll(async () => {
    await waitApp(port);
    [browser, page] = await openBrowser(port);
  }, 60 * 1000);

  afterAll(async () => {
    await browser.close();
    await killApp(app);
  });

  test('launches the App', async done => {
    const expected = 'Anasayfa';
    const actual = await page.$$eval('h1', es => es[0].textContent);

    expect(actual).toEqual(expected);
    done();
  });

  test(
    'does Hot Module Reload',
    async done => {
      const sourcePath = 'src/routes/home/Home.js';
      const sourceAbsPath = path.join(cwd, sourcePath);
      const expected = 'HMR!!!';
      const defaultH1 = '<h1>Anasayfa</h1>';
      const modifiedH1 = `<h1>${expected}</h1>`;

      const modifySource = async () => {
        const content = await readFile(sourceAbsPath);
        if (!content.includes(defaultH1)) {
          throw new Error('This test cannot run. Check "defaultH1".');
        }
        await writeFile(sourceAbsPath, content.replace(defaultH1, modifiedH1));
      };

      const resetSource = async () => {
        const content = await readFile(sourceAbsPath);
        await writeFile(sourceAbsPath, content.replace(modifiedH1, defaultH1));
      };

      await modifySource();
      await timeout(3 * 1000);
      const actual = await page.$$eval('h1', es => es[0].textContent);

      expect(actual).toEqual(expected);

      await resetSource();
      done();
    },
    30 * 1000
  );

  test('fetches some data', async done => {
    await page.goto(`${getUrl(port)}/iddaa/futbol`);
    const list = await page.$('.js-eventList');

    expect(list).not.toBeNull();
    done();
  });
});
