import { expect, test } from '@playwright/test';

test.setTimeout(90_000);

test('homepage to complete lesson to warm homepage return stays in one web loop', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('link', { name: '进入教室' })).toBeVisible();
  await page.getByRole('link', { name: '进入教室' }).click();

  await expect(page).toHaveURL(/\/lesson\/weekday-1700/);

  for (let index = 0; index < 5; index += 1) {
    await expect(page.getByRole('button', { name: 'I said it' })).toBeVisible({
      timeout: 8_000,
    });
    await page.getByRole('button', { name: 'I said it' }).click();
  }

  await expect(page.getByTestId('lesson-stage-badge')).toHaveText('Picture talk · 1/5', {
    timeout: 8_000,
  });

  for (let index = 0; index < 5; index += 1) {
    await expect(page.getByRole('button', { name: 'I answered' })).toBeVisible({
      timeout: 8_000,
    });
    await page.getByRole('button', { name: 'I answered' }).click();

    if (index === 0) {
      await expect(page.getByText('Nice answer.')).toBeVisible();
    }
  }

  await expect(page.locator('text=GREAT JOB!').last()).toBeVisible({ timeout: 12_000 });
  await expect(page.getByTestId('lesson-stage-badge')).toHaveText('Class complete', {
    timeout: 12_000,
  });
  await expect(page.getByTestId('lesson-stage-prompt')).toHaveText('See you next time.');
  await expect(page.getByText('You finished class. See you next time.')).toBeVisible();

  await expect(page).toHaveURL(/\/\?completedSession=weekday-1700/, { timeout: 12_000 });
  await expect(page.getByText('刚完成这节课')).toBeVisible();
  await expect(page.getByTestId('session-timeline')).toContainText('刚完成');
  await expect(page.getByRole('link', { name: '进入教室' })).toHaveAttribute(
    'href',
    '/lesson/weekday-1700',
  );
});
