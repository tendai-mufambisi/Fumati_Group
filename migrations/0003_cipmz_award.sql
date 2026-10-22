-- CEO Tinashe Changweya: CIPMZ 40 Under 40 Young Project Leaders in Zimbabwe 2026.
-- Goes to the top of the awards list, so it becomes the featured award.
INSERT INTO awards (title, organisation, year, recipient, description, image, position)
SELECT
  '40 Under 40 Young Project Leaders in Zimbabwe',
  'Chartered Institute of Project Managers Zimbabwe (CIPMZ), with the Institute of Project Management Australia',
  '2026',
  'Mr. Tinashe Changweya, CEO & Founder',
  'Listed among Zimbabwe''s 40 Under 40 Young Project Leaders for hard work, innovation and determination in delivering projects — recognition of his contribution and his potential to shape the future of the profession.',
  '/images/cipmz-40-under-40-tinashe-changweya-2026.webp',
  COALESCE(MIN(position), 1) - 1
FROM awards;

-- Latest milestone at the end of the timeline.
INSERT INTO timeline (year, title, text, position)
SELECT
  '2026',
  '40 Under 40 Young Project Leader',
  'CEO Tinashe Changweya listed among CIPMZ''s 40 Under 40 Young Project Leaders in Zimbabwe.',
  COALESCE(MAX(position), 0) + 1
FROM timeline;

-- Add it to the CEO's achievements, but only if the owner hasn't rewritten them yet.
UPDATE settings
SET value = '40 Under 40 Young Project Leaders in Zimbabwe 2026 — CIPMZ' || char(10) || value,
    updated_at = datetime('now')
WHERE key = 'ceo_credentials'
  AND value = 'Outstanding Businessman of the Year — Northern Region Megafest Business Awards' || char(10) || 'Led Fumati to Company of the Year — Engineering Services' || char(10) || '15+ years of engineering leadership';
