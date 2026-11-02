# 五常乾丰农业 · 明鼎稻花香二号原粮

高端农业电商官网与产品包装三视图设计。项目为纯静态站点，可直接部署到任意静态托管服务。

## 运行

直接双击 `index.html` 即可浏览。为了保证本地视频、字体与资源路径在浏览器中保持一致，建议通过本地 HTTP 服务运行：

```powershell
python -m http.server 4173
```

然后打开 `http://127.0.0.1:4173/`。

## 已实现功能

- 全屏稻田视频 Banner，并带静态海报兜底和播放/暂停控制
- 中文、英文、日语、韩语四语实时切换
- 首页、甄选米礼、五常溯源、购物车、会员中心单页路由
- 普通袋装与高端礼盒两种规格
- 可鼠标或触屏拖动的 3D 包装展示，以及正面、侧面、背面快捷视图
- 账户注册、登录、退出与本地会员状态
- 购物车增删、数量调整、金额和积分实时计算
- 完整模拟结算：收货信息、支付方式、支付处理、支付成功与订单编号
- 消费 `1 元 = 10 积分`，支付成功后自动累计
- 个人中心积分、订单记录与历史订单
- 桌面端、平板、手机端响应式布局
- 流光、滚动进度、滚动揭示、轻量视差和减弱动效适配

## 体验账户

- 手机号：`13800138000`
- 密码：`123456`

账户和订单信息使用浏览器 `localStorage` 保存，清除站点数据后会恢复初始体验账户。支付流程为模拟流程，不会产生真实扣款。

## 包装设计交付

- [普通袋装三视图（SVG）](assets/packaging/bag-tri-view.svg)
- [普通袋装三视图（PNG）](bag-packaging-tri-view.png)
- [高端礼盒三视图（SVG）](assets/packaging/gift-tri-view.svg)
- [高端礼盒三视图（PNG）](gift-packaging-tri-view.png)
- [包装设计总览页面](packaging.html)

单面视图位于 `assets/packaging/`，均为独立 SVG，可用于后续改稿与印刷展示。

## 文件结构

```text
.
├── index.html
├── packaging.html
├── assets/
│   ├── css/styles.css
│   ├── js/app.js
│   ├── images/
│   ├── media/
│   └── packaging/
├── bag-packaging-tri-view.png
└── gift-packaging-tri-view.png
```

## 素材授权

首页稻田视频来自 Wikimedia Commons：

- 作者：Jnanaranjan Sahu
- 文件：A rice field in Kendrapara.webm
- 授权：CC BY-SA 3.0
- 来源：https://commons.wikimedia.org/wiki/File:A_rice_field_in_Kendrapara.webm

品牌包装、稻田插画、纹理和标识均作为本项目原创矢量设计交付。
