import { expect, test } from '@playwright/test';

test.setTimeout(60_000);

test('home schedule allows lesson entry', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('近期待办')).toBeVisible();

  const entryLink = page.getByRole('link', { name: '上课' }).first();
  await expect(entryLink).toBeVisible();
  await expect(entryLink).toHaveAttribute('href', /\/lesson\//);

  await entryLink.click();

  await expect(page).toHaveURL(/\/lesson\//);
  await expect(page.getByText('118语感启蒙营（4月） - 113')).toBeVisible();
  await expect(page.getByText('Carl11801154')).toBeVisible();
});
