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

test('guided speaking fallback path keeps one CTA and no answer leakage', async ({
  page,
}) => {
  await page.goto('/lesson/weekday-1700', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('button', { name: 'I said it' })).toBeVisible({
    timeout: 8_000,
  });

  await page.waitForTimeout(2_300);
  await expect(page.getByTestId('lesson-stage-prompt')).toHaveText(
    'Cora is helping you start again.',
  );

  await page.waitForTimeout(1_700);
  await expect(page.getByRole('button', { name: 'I said it' })).toBeVisible({
    timeout: 8_000,
  });

  await page.waitForTimeout(2_300);
  await expect(page.getByTestId('lesson-stage-prompt')).toHaveText(
    'Listen once more. Then say it with Cora.',
  );
  await expect(page.getByTestId('classroom-stage')).not.toContainText(/^apple$/i);

  await page.waitForTimeout(1_900);
  await expect(page.getByRole('button', { name: 'I said it with Cora' })).toBeVisible({
    timeout: 8_000,
  });
  await expect(page.getByRole('button', { name: /i said it|i answered/i })).toHaveCount(1);
  await page.getByRole('button', { name: 'I said it with Cora' }).click();

  await expect(page.getByTestId('lesson-stage-badge')).toHaveText(
    'Repeat after Cora · 2/5',
  );

  for (let index = 1; index < 5; index += 1) {
    await expect(page.getByRole('button', { name: 'I said it' })).toBeVisible({
      timeout: 8_000,
    });
    await page.getByRole('button', { name: 'I said it' }).click();
  }

  await expect(page.getByTestId('lesson-stage-badge')).toHaveText(
    'Picture talk · 1/5',
  );
  await expect(page.getByRole('button', { name: 'I answered' })).toBeVisible({
    timeout: 8_000,
  });

  await page.waitForTimeout(2_300);
  await expect(page.getByTestId('lesson-stage-prompt')).toHaveText(
    'Look again. I will make it smaller.',
  );
  await expect(page.getByTestId('classroom-stage')).not.toContainText(/Bobby goes first/i);

  await page.waitForTimeout(1_700);
  await expect(page.getByRole('button', { name: 'I answered' })).toBeVisible({
    timeout: 8_000,
  });

  await page.waitForTimeout(2_300);
  await expect(page.getByTestId('lesson-stage-prompt')).toHaveText(
    'Listen once more. Then say it with Cora.',
  );
  await expect(page.getByTestId('classroom-stage')).not.toContainText(/apple|banana/i);
  await expect(page.getByTestId('classroom-stage')).not.toContainText(
    /score|correct|incorrect/i,
  );

  await page.waitForTimeout(1_900);
  await expect(page.getByRole('button', { name: 'I said it with Cora' })).toBeVisible({
    timeout: 8_000,
  });
  await expect(page.getByRole('button', { name: /i said it|i answered/i })).toHaveCount(1);
  await page.getByRole('button', { name: 'I said it with Cora' }).click();

  await expect(page.getByTestId('lesson-stage-badge')).toHaveText('Picture talk · 2/5');
  await expect(page.getByTestId('classroom-stage')).not.toContainText(/Bobby goes first/i);
});
