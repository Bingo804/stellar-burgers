import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/constructor-api.har', {
    url: 'https://norma.education-services.ru/api/**',
    notFound: 'abort',
  });
});

test.describe('Конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('добавление булки в конструктор', async ({ page }) => {
    const bun = page.getByText('Краторная булка N-200i').locator('../..');

    await bun.getByRole('button', { name: 'Добавить' }).click();

    await expect(bun.locator('.counter__num')).toHaveText('2');
    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    const card = page.getByText('Говяжий метеорит (отбивная)').locator('../..');

    await card.getByRole('button', { name: 'Добавить' }).click();

    await expect(card.locator('.counter__num')).toHaveText('1');
    await expect(
      page.locator('.constructor-element__text', {
        hasText: 'Говяжий метеорит (отбивная)',
      })
    ).toBeVisible();
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    const ingredientName = 'Говяжий метеорит (отбивная)';

    await page.getByRole('link', { name: ingredientName }).click();

    const modal = page.locator('[class*="modal__modal_"]');

    await expect(modal).toBeVisible();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByText(ingredientName, { exact: true })).toBeVisible();
  });

  test('закрытие модального окна крестиком', async ({ page }) => {
    await page.getByRole('link', { name: 'Краторная булка N-200i' }).click();

    await expect(page.locator('[class*="modal__modal_"]')).toBeVisible();
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.locator('[class*="modal__modal_"]')).toBeHidden();
  });

  test('закрытие модального окна по оверлею', async ({ page }) => {
    await page.getByRole('link', { name: 'Краторная булка N-200i' }).click();

    await expect(page.locator('[class*="modal__modal_"]')).toBeVisible();

    await page.locator('[class*="modal-overlay__overlay_"]').click({
      position: { x: 10, y: 10 },
    });

    await expect(page.locator('[class*="modal__modal_"]')).toBeHidden();
  });

  test('переход на страницу авторизации при оформлении заказа', async ({ page }) => {
    const bun = page.getByText('Краторная булка N-200i').locator('../..');

    await bun.getByRole('button', { name: 'Добавить' }).click();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page).toHaveURL('/login');
  });
});

test('Создание заказа', async ({ page }) => {
  const userName = 'Тестовый пользователь';
  const orderNumber = 12345;
  const bunName = 'Краторная булка N-200i';
  const fillingName = 'Говяжий метеорит (отбивная)';

  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer mock-access-token',
      url: 'http://localhost:4000',
    },
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(userName, { exact: true })).toBeVisible();

  const bun = page.getByText(bunName, { exact: true }).locator('../..');
  await bun.getByRole('button', { name: 'Добавить' }).click();

  const filling = page.getByText(fillingName, { exact: true }).locator('../..');
  await filling.getByRole('button', { name: 'Добавить' }).click();

  const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
  const constructor = page.locator('section').filter({ has: orderButton });

  await expect(
    constructor.getByText(`${bunName} (верх)`, { exact: true })
  ).toBeVisible();
  await expect(constructor.getByText(fillingName, { exact: true })).toBeVisible();

  await orderButton.click();

  const orderModal = page.locator('[class*="modal__modal_"]');

  await expect(
    orderModal.getByRole('heading', {
      name: String(orderNumber),
      exact: true,
    })
  ).toBeVisible();

  await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(2);
  await expect(constructor.getByText('Выберите начинку', { exact: true })).toBeVisible();

  await orderModal.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await expect(orderModal).toBeHidden();
});
