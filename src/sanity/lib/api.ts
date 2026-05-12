export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const rawProjectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '').trim();
const PROJECT_ID_PATTERN = /^[a-z0-9-]+$/;
export const projectId = PROJECT_ID_PATTERN.test(rawProjectId) ? rawProjectId : '';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-20';
export const studioUrl = '/studio';
export const isSanityConfigured = Boolean(projectId);
