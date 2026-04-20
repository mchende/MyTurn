import { expect, test } from '@playwright/test';

test.setTimeout(60_000);

test('guided speaking upgrades from repeat-after-teacher into picture-talk on the same lesson flow', async ({
  page,
}) => {
  await page.goto('/lesson/weekday-1700', { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('lesson-stage-badge')).toHaveText(
    'Repeat after Cora · 1/5',
  );
  await expect(page.getByTestId('lesson-stage-prompt')).toHaveText(
    'Say it after the model.',
  );

  for (let index = 0; index < 5; index += 1) {
    await expect(page.getByRole('button', { name: 'I said it' })).toBeVisible({
      timeout: 8_000,
    });
    await page.getByRole('button', { name: 'I said it' }).click();
  }

  await expect(page.getByTestId('lesson-stage-badge')).toHaveText(
    'Picture talk · 1/5',
  );
  await expect(page.getByTestId('lesson-stage-prompt')).toHaveText(
    'Look at the picture and answer.',
  );
  await expect(page.getByRole('button', { name: 'I answered' })).toBeVisible({
    timeout: 8_000,
  });
  await expect(page.getByTestId('classroom-stage')).not.toContainText(/^apple$/i);
});
