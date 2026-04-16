import { expect, test } from '@playwright/test';

test.setTimeout(60_000);

test('home schedule allows lesson entry', async ({ page }) => {
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
  await expect(page.getByText('Cora 老师')).toBeVisible();
  await expect(
    page.getByText("It's your turn. Look at the picture and get ready."),
  ).toBeVisible();
  await expect(page.getByTestId('seat-empty')).toBeVisible();
  await expect(page.getByTestId('classroom-stage')).not.toContainText(/^apple$/i);
  await expect(page.getByText('你的发言时间')).toBeVisible();
  await expect(page.getByText('LIVE')).toBeVisible();

  await expect
    .poll(async () => page.getByTestId('seat-ai').getAttribute('data-on-stage'))
    .toBe('true');
  await expect(page.getByText('Bobby goes first')).toBeVisible();
});

test('classroom reward mode reproduces the celebration overlay', async ({ page }) => {
  await page.goto('/lesson/weekday-1700?reward=1', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('text=GREAT JOB!').last()).toBeVisible();
  await expect(page.getByText('Great job, brave voice.')).toBeVisible();
});
