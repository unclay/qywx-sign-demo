import path from 'path';
import fs from 'fs-extra';

// local js
import { config } from './config';

export const cache_dir = path.resolve(__dirname, '../../.cache');
export const cache_file_path = path.resolve(cache_dir, 'cache.json');

config.debug && console.log('cache file: ', cache_file_path);
export const cache: { [key: string]: any } = {};
export const readCache = (): { [key: string]: any } => {
  fs.ensureDirSync(cache_dir);
  let json = {};
  try {
    json = fs.readJsonSync(cache_file_path);
  } catch(_) {}
  Object.assign(cache, json);
  return cache;
};

export const writeCache = (json?: { [key: string]: any }) => {
  fs.writeJsonSync(cache_file_path, json || cache, {
    spaces: '\t',
  });
};

readCache();