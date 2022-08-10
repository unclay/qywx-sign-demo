import path from 'path';
import fs from 'fs-extra';

export interface configAppModel {
  agentid: number,
  secret: string,
}
export interface configModel {
  debug: boolean,
  corpid: string,
  app: configAppModel[]
}
export const config: configModel = {
  debug: false,
  corpid: '',
  app: [],
};
export const config_file_path = path.resolve(__dirname, '../config.json');
export const config_local_file_path = path.resolve(__dirname, '../config.local.json');

try {
  const conf: configModel = fs.readJsonSync(config_file_path);
  const localConf: configModel = fs.readJsonSync(config_local_file_path);
  const appMap: { [key: number]: configAppModel } = {};
  for (const item of conf.app) {
    if (item.agentid > 0) appMap[item.agentid] = item;
  }
  for (const item of localConf.app) {
    if (item.agentid > 0) appMap[item.agentid] = {
      ...(appMap[item.agentid] || {}),
      ...item,
    };
  }
  Object.assign(config, {
    ...config,
    ...localConf,
    app: Object.values(appMap),
  });
} catch(err) {
  console.error(err);
}
