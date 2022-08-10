## 企业微信签名

### 配置文件

支持本地配置文件，默认读取 `src/config.json`, 再读取 `src/config.local.json` 做合并。

如何自定义配置文件，在 `src` 下面创建一个 `config.local.json` 文件，内容如下：

```json
{
  "debug": false,
  "corpid": "",
  "app": [
    {
      "agentid": 0,
      "secret": ""
    }
  ]
}
```

### 签名

demo请用测试环境的应用，这样不会造成线上token过期，影响线上项目
