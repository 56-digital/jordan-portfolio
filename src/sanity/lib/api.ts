const PROJECT_ID_PATTERN = /^[a-z0-9-]+$/;
const DATASET_PATTERN = /^[a-z0-9_-]+$/;

const rawProjectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '').trim();
const rawDataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || '').trim();
const rawApiVersion = (process.env.NEXT_PUBLIC_SANITY_API_VERSION || '').trim();

export const projectId = PROJECT_ID_PATTERN.test(rawProjectId) ? rawProjectId : '';
export const dataset = DATASET_PATTERN.test(rawDataset) ? rawDataset : 'production';
export const apiVersion = rawApiVersion || '2026-04-20';
export const studioUrl = '/studio';
export const isSanityConfigured = Boolean(projectId);
