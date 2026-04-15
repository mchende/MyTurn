import { expect, test } from '@playwright/test';

test.setTimeout(60_000);

test('home schedule allows lesson entry', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: '我的课堂' }).first()).toBeVisible();

  const entryLink = page.getByRole('link', { name: '进入课堂' }).first();
  await expect(entryLink).toBeVisible();
  await expect(entryLink).toHaveAttribute('href', /\/lesson\//);

  await entryLink.click();

  await expect(page).toHaveURL(/\/lesson\//);
  await expect(page.getByText('Teacher Mia')).toBeVisible();
});
