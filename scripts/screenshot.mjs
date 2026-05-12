import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '..');
const DOCS = resolve(PROJECT_ROOT, 'docs');
mkdirSync(DOCS, { recursive: true });

const APP_URL = 'http://localhost:8081';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  const target = resolve(DOCS, `${name}.png`);
  await page.screenshot({ path: target, fullPage: true });
  console.log(`saved ${target}`);
}

async function waitForForm(page) {
  await page.waitForLoadState('networkidle');
  await page.getByText('Cadastro de Usuário').first().waitFor({ timeout: 60000 });
  await sleep(500);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('→ opening', APP_URL);
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  // start clean: AsyncStorage on web is localStorage
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForForm(page);

  // 1) empty form
  await shot(page, 'print-form-empty');

  // 2) validation errors – submit without filling anything
  await page.getByRole('button', { name: 'Enviar' }).click();
  await sleep(600);
  await shot(page, 'print-form-errors');

  // 3) fill the form properly
  const fillText = async (placeholder, value) => {
    const input = page.getByPlaceholder(placeholder).first();
    await input.click();
    await input.fill('');
    await input.fill(value);
  };

  await fillText('Digite seu nome', 'Lynn Bueno Rosa');
  await fillText('voce@email.com', 'lynn@cp3.com');
  await fillText('Mínimo de 6 caracteres', 'senha123');
  await fillText('Sua idade', '22');
  await fillText('Conte um pouco sobre você...', 'Cursando React Native na FIAP. Time CP3.');

  // radio Feminino
  await page.getByRole('radio', { name: 'Feminino' }).click();

  // select – open modal and pick São Paulo
  await page.getByRole('button', { name: /Selecione um estado/i }).click();
  await sleep(300);
  await page.getByText('São Paulo').click();
  await sleep(300);

  // date
  await fillText('DD/MM/AAAA', '15/06/2003');

  // checkbox
  await page.getByRole('checkbox', { name: /novidades/i }).click();

  // switch
  await page.getByRole('switch').click();

  await sleep(400);
  await shot(page, 'print-form-filled');

  // 4) submit → result screen
  await page.getByRole('button', { name: 'Enviar' }).click();
  await page.getByText('Formulário enviado').waitFor({ timeout: 15000 });
  await sleep(400);
  await shot(page, 'print-result');

  await browser.close();
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
