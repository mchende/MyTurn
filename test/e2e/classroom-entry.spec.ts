import { expect, test } from '@playwright/test';

import { installFakeBrowserAudio } from './helpers/fake-browser-audio';

test.setTimeout(60_000);

test('home schedule allows lesson entry', async ({ context, page }) => {
  await installFakeBrowserAudio(page, context);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('每日语感启蒙')).toBeVisible();
  await expect(page.getByText('Bobby 同学')).toBeVisible();

  const hasViewportOverflow = await page.evaluate(() => {
    return (
      document.documentElement.scrollHeight > window.innerHeight ||
      document.documentElement.scrollWidth > window.innerWidth
    );
  });
  expect(hasViewportOverflow).toBe(false);

  const entryLink = page.getByRole('link', { name: '进入教室' });
  await expect(entryLink).toBeVisible();
  await expect(entryLink).toHaveAttribute('href', /\/lesson\//);

  await entryLink.click();

  await expect(page).toHaveURL(/\/lesson\//);
  await expect(page.getByTestId('audio-preflight-card')).toBeVisible();
  await page.getByTestId('preflight-skip-button').click();
  await expect(page.getByText('Cora 老师')).toBeVisible();
  await expect(page.getByText(/Repeat after Cora/i)).toBeVisible();
  await expect(page.getByText('Listen first. Bobby will model one.')).toBeVisible();
  await expect(page.getByTestId('seat-empty')).toBeVisible();
  await expect(page.getByTestId('classroom-stage')).not.toContainText(/^apple$/i);
  await expect(page.getByText('Podium')).toBeVisible();
  await expect(page.getByText('LIVE')).toBeVisible();

  await expect
    .poll(async () => page.getByTestId('seat-ai').getAttribute('data-on-stage'))
    .toBe('true');
  await expect(page.getByText('Listen to Bobby once, then you speak.')).toBeVisible();
  await expect(page.getByText('Bobby is modeling')).toBeVisible();
  await expect(page.getByTestId('classroom-audio-warning')).toContainText(
    'Audio check skipped',
  );
});

test('classroom reward mode reproduces the celebration overlay', async ({
  context,
  page,
}) => {
  await installFakeBrowserAudio(page, context);
  await page.goto('/lesson/weekday-1700?reward=1', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('text=GREAT JOB!').last()).toBeVisible();
});
