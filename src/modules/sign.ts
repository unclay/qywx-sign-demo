import axios from 'axios';
import assert from 'node:assert';
import crypto from 'crypto';

// local js
import { config } from './config';
import { cache, writeCache } from './cache';
import { randomString } from '../utils';

const urlPrev = `https://qyapi.weixin.qq.com/cgi-bin`;

export const init = async () => {
  assert(config.corpid, '企业微信id不能为空');
  assert(config.app && config.app.length > 0, '应用管理不能为空');

  for (const item of config.app) {
    if (!item.agentid) continue;
    const appKey = `app_${item.agentid}`;
    if (!cache[appKey]) cache[appKey] = {};
    // 应用程序的 access_token
    if (!cache[appKey].token || Math.floor(Date.now() * 0.001) >= cache[appKey].token.created_at + cache[appKey].token.expires_in) {
      const res = await axios.get(`${urlPrev}/gettoken?corpid=${config.corpid}&corpsecret=${item.secret}`);
      cache[appKey].token = {
        access_token: res.data.access_token,
        expires_in: res.data.expires_in,
        created_at: Math.floor(Date.now() * 0.001),
      };
      writeCache();
      config.debug && console.log(`load app ${item.agentid} token`);
    }
    // 应用程序的 ticket
    if (!cache[appKey].ticket || Math.floor(Date.now() * 0.001) >= cache[appKey].ticket.created_at + cache[appKey].ticket.expires_in) {
      const res = await axios.get(`${urlPrev}/ticket/get?access_token=${cache[appKey].token.access_token}&type=agent_config`);
      cache[appKey].ticket = {
        ticket: res.data.ticket,
        expires_in: res.data.expires_in,
        created_at: Math.floor(Date.now() * 0.001),
      };
      writeCache();
      config.debug && console.log(`load app ${item.agentid} ticket`);
    }
  }

  // 企业号的 ticket
  if (!cache.corp || Math.floor(Date.now() * 0.001) >= cache.corp.ticket.created_at + cache.corp.ticket.expires_in) {
    cache.corp = cache.corp || {};
    const appKey = `app_${config.app[0].agentid}`;
    const res = await axios.get(`${urlPrev}/get_jsapi_ticket?access_token=${cache[appKey].token.access_token}`);
    cache.corp.token = cache[appKey].token;
    cache.corp.ticket = {
      ticket: res.data.ticket,
      expires_in: res.data.expires_in,
      created_at: Math.floor(Date.now() * 0.001),
    };
    writeCache();
    config.debug && console.log('load corp ticket');
  }
};

export const signature = (options: { ticket: string, url: string } = { ticket: '', url: '' }) => {
  const { ticket, url } = options;
  const noncestr = randomString(16);
  const timestamp = Date.now();
  const str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url || ''}`;
  const obj = crypto.createHash('sha1');
  obj.update(str);
  const signature = obj.digest('hex');
  return {
    noncestr,
    timestamp,
    signature,
    url,
    ticket,
  }
};