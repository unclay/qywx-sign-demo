import path from 'path';
import express from 'express';

// local js
import { cache } from './modules/cache';
import { config } from './modules/config';
import * as sign from './modules/sign';

// local var
const app = express();
const port = 3000;

// local init
sign.init();

app.get('/cache', (req, res) => {
  res.send(JSON.stringify(cache, null, 2));
})
// https://open.work.weixin.qq.com/api/jsapisign
// https://open.work.weixin.qq.com/devtool/query?e=40093
app.get('/sign', (req, res) => {
  const result: any = {
    corp: sign.signature({
      ticket: cache.corp.ticket.ticket,
      url: req.query.url as string || '',
    }),
  };
  for (const item of config.app) {
    const appKey = `app_${item.agentid}`;
    result[appKey] = sign.signature({
      ticket: cache[appKey].ticket.ticket,
      url: req.query.url as string || '',
    });
  }
  return res.json(result);
})

app.use(express.static(path.resolve(__dirname, '../public')));//设置静态文件目录
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
