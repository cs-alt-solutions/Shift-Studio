/* src/utils/storage.js */

const APP_PREFIX = 'SHIFT_STUDIO_V2';

export const loadState = (key, fallback = null) => {
  try {
    const serialized = localStorage.getItem(`${APP_PREFIX}_${key}`);
    return serialized ? JSON.parse(serialized) : fallback;
  } catch (err) {
    console.warn(`[Storage] Load failed for ${key}`, err);
    return fallback;
  }
};

export const saveState = (key, state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(`${APP_PREFIX}_${key}`, serialized);
  } catch (err) {
    console.warn(`[Storage] Save failed for ${key}`, err);
  }
};