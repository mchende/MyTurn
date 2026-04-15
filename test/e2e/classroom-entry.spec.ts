import { expect, test } from '@playwright/test';

// Remove test.skip in 01-04 after homepage, lesson-entry link, and lesson route exist.
test.skip('home schedule allows lesson entry', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('今日课表')).toBeVisible();
  await expect(page.getByRole('link', { name: '进入课堂' })).toBeVisible();
});
