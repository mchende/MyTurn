import { expect, test } from '@playwright/test';

test.setTimeout(60_000);

test('home schedule allows lesson entry', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('每日语感启蒙')).toBeVisible();

  const entryLink = page.getByRole('link', { name: '进入教室' });
  await expect(entryLink).toBeVisible();
  await expect(entryLink).toHaveAttribute('href', /\/lesson\//);

  await entryLink.click();

  await expect(page).toHaveURL(/\/lesson\//);
  await expect(page.getByText('Cora 老师')).toBeVisible();
  await expect(page.getByText('榜单奖励时刻')).toBeVisible();
});

test('classroom reward mode reproduces the celebration overlay', async ({ page }) => {
  await page.goto('/lesson/weekday-1700?reward=1', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText('GREAT JOB!')).toBeVisible();
  await expect(page.getByText('Excellent!')).toBeVisible();
});
