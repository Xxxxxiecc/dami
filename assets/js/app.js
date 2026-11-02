/* =========================================================
   五常乾丰农业 · 明鼎稻花香二号原粮
   Client-side storefront: language, routing, auth, cart,
   points, product viewer, and simulated checkout.
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const clamp = (number, min, max) => Math.min(Math.max(number, min), max);
  const digits = (value) => String(value || "").replace(/\D/g, "");
  const money = (value) => Number(value).toLocaleString("zh-CN");
  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);

  const STORAGE = {
    cart: "qf_cart_v1",
    users: "qf_users_v1",
    session: "qf_session_v1",
    language: "qf_language_v1"
  };

  const PRODUCTS = {
    classic: {
      id: "mingding-classic-5kg",
      price: 89,
      oldPrice: 119,
      images: {
        front: "assets/packaging/bag-front.svg",
        side: "assets/packaging/bag-side.svg",
        back: "assets/packaging/bag-back.svg"
      },
      tagKey: "product.tagClassic",
      descKey: "products.classicDesc"
    },
    gift: {
      id: "mingding-gift-5kg",
      price: 299,
      oldPrice: 369,
      images: {
        front: "assets/packaging/gift-front.svg",
        side: "assets/packaging/gift-side.svg",
        back: "assets/packaging/gift-back.svg"
      },
      tagKey: "product.tagGift",
      descKey: "products.giftDesc"
    }
  };

  const I18N = {
    zh: {
      "meta.title": "明鼎稻花香二号原粮 | 五常乾丰农业",
      "brand": "五常乾丰农业",
      "nav.home": "首页",
      "nav.products": "甄选米礼",
      "nav.about": "五常溯源",
      "nav.member": "会员中心",
      "nav.cart": "购物车",
      "nav.login": "登录",
      "hero.film": "五常稻田 · 实景影像",
      "hero.eyebrow": "北纬 45° · 中国五常",
      "hero.title1": "五常黑土",
      "hero.title2": "一季稻香",
      "hero.subtitle": "从寒地稻田到一碗温润米饭。明鼎稻花香二号原粮，只取当季新米，守住土地本真的香气。",
      "hero.shop": "甄选当季米礼",
      "hero.story": "聆听五常故事",
      "hero.meta1": "充足日照",
      "hero.meta2": "天生积温",
      "hero.meta3": "一年一季",
      "hero.scroll": "向下寻香",
      "strip.1": "五常核心产区",
      "strip.2": "一季一作",
      "strip.3": "当季新米",
      "strip.4": "原产地直发",
      "strip.5": "东方礼序",
      "strip.6": "自然米香",
      "origin.stamp": "五常<br>原产",
      "origin.vertical": "天地有常 · 稻亦有道",
      "origin.kicker": "风土之礼",
      "origin.title1": "好米，从不辜负",
      "origin.title2": "一方水土。",
      "origin.lead": "五常乾丰农业扎根黑龙江五常核心稻区，以敬畏土地的方式，等待每一株稻穗自然成熟。",
      "origin.body": "寒地黑土、昼夜温差与长白山余脉的清冽水系，共同塑造稻花香二号清甜、软糯、油润的米质。我们坚持一季一作、当季鲜碾，让每一碗米饭都保留黑土地最本真的香气。",
      "origin.feature1": "寒地黑土",
      "origin.feature1sub": "自然孕育",
      "origin.feature2": "一季一作",
      "origin.feature2sub": "顺时而收",
      "origin.feature3": "当季鲜碾",
      "origin.feature3sub": "锁住米香",
      "product.kicker": "当季甄选",
      "product.title": "一袋稻花香，盛满五常的秋",
      "product.subtitle": "普通袋装，是日常的一碗好饭；高端礼盒，是郑重相赠的一份心意。",
      "product.drag": "按住拖动 · 360° 查看",
      "product.front": "正面",
      "product.side": "侧面",
      "product.back": "背面",
      "product.tagClassic": "日常袋装 · 5KG",
      "product.tagGift": "高端礼盒 · 5KG",
      "product.name": "明鼎 稻花香二号原粮",
      "product.reviews": "2,186 位会员珍藏",
      "product.spec": "选择规格",
      "product.specHint": "两种米礼，同一片稻田",
      "product.classic": "普通袋装",
      "product.gift": "高端礼盒",
      "product.daily": "日常之选",
      "product.giftFor": "礼赠之选",
      "product.price": "会员价",
      "product.points": "购买可得积分",
      "product.addCart": "加入购物车",
      "product.buyNow": "立即购买",
      "product.assurance1": "原产地直发",
      "product.assurance2": "破损包赔",
      "product.assurance3": "顺丰包邮",
      "craft.kicker": "一季一作",
      "craft.title": "让时间，成为米香的一部分",
      "craft.subtitle": "不追赶季节，只等待成熟。每一步都循着五常的节气，把自然的馈赠安静地留在一粒米里。",
      "craft.season1": "立夏 · 播种",
      "craft.step1": "寒地育秧",
      "craft.step1desc": "甄选稻花香二号原种，在昼夜温差中缓慢生长，积攒清甜。",
      "craft.season2": "小满 · 生长",
      "craft.step2": "活水润田",
      "craft.step2desc": "长白山余脉水系灌溉，黑土与清流共同孕育稻穗。",
      "craft.season3": "秋分 · 成熟",
      "craft.step3": "顺时收割",
      "craft.step3desc": "等待稻穗自然低头，不抢早，不催熟，守住本真风味。",
      "craft.season4": "入冬 · 尝新",
      "craft.step4": "当季鲜碾",
      "craft.step4desc": "低温慢碾、密封锁鲜，把五常秋天送到你的餐桌。",
      "design.kicker": "东方米礼",
      "design.title1": "装得下心意，",
      "design.title2": "也装得下风土。",
      "design.body": "从日常的一餐，到郑重相赠的一礼。明鼎以墨绿为底、米白为纸、哑金为引，将五常稻田的克制与丰盛，收进一方东方包装。",
      "design.view": "查看包装三视图",
      "design.color1": "米白",
      "design.color2": "哑金",
      "design.color3": "墨绿",
      "design.modalTitle": "明鼎产品包装三视图",
      "design.download": "下载矢量原稿",
      "design.brandLabel": "品牌",
      "design.originLabel": "产地",
      "member.kicker": "明鼎米友会",
      "member.title": "每一碗好饭，都有回响",
      "member.body": "注册会员，消费 1 元即得 10 积分。积分与每一份订单一同沉淀，见证餐桌上的四季。",
      "member.join": "成为米友",
      "member.viewAccount": "查看会员中心",
      "products.kicker": "明鼎米礼",
      "products.title": "把五常的秋天，带回家",
      "products.subtitle": "同一片黑土地，两种恰到好处的相遇。日常自享，或郑重礼赠。",
      "products.all": "全部米礼",
      "products.classicFilter": "普通袋装",
      "products.giftFilter": "高端礼盒",
      "products.count": "款当季甄选",
      "products.dailyBadge": "日常之选",
      "products.giftBadge": "礼赠之选",
      "products.classicDesc": "一季新米，米粒饱满，饭香清甜。适合每天的一碗好饭。",
      "products.giftDesc": "独立分装，烫金礼盒，东方礼序。把五常风土郑重相赠。",
      "products.service1": "原产地直发",
      "products.service1desc": "从五常稻区直接发出",
      "products.service2": "新鲜锁香",
      "products.service2desc": "低温鲜碾并密封包装",
      "products.service3": "安心配送",
      "products.service3desc": "破损包赔，顺丰包邮",
      "products.service4": "会员积分",
      "products.service4desc": "消费 1 元得 10 积分",
      "about.kicker": "五常溯源",
      "about.title1": "一方黑土，",
      "about.title2": "一季好稻。",
      "about.subtitle": "五常乾丰农业相信，最好的味道来自土地、时令与耐心。",
      "about.originKicker": "风土源头",
      "about.originTitle": "五常，稻香生长的答案",
      "about.p1": "五常位于黑龙江省南部，坐拥世界稀有的寒地黑土。长白山余脉环抱，拉林河与溪浪河润泽田野，昼夜温差让稻米在缓慢生长中积攒更多风味。",
      "about.p2": "明鼎稻花香二号原粮便生长于这片北纬 45° 的核心稻区。我们遵循一季一作的节律，只在稻谷自然成熟后收割，以当季鲜米回应每一份期待。",
      "about.num1": "黄金稻作纬度",
      "about.num2": "天生积温",
      "about.num3": "一年一季",
      "about.num4": "五常原粮",
      "about.value1": "敬畏土地",
      "about.value1desc": "尊重自然节律，让土地保有呼吸与生息，以长期主义守护黑土。",
      "about.value2": "本真米香",
      "about.value2desc": "不过度加工，不抢早收割，保留当季原粮的清甜与油润。",
      "about.value3": "东方礼序",
      "about.value3desc": "以克制、雅致的东方审美，重新表达一碗米饭的价值。",
      "about.designTitle": "从稻田，到一方好礼",
      "about.designBody": "查看明鼎普通袋装与高端礼盒的完整包装三视图。",
      "cart.kicker": "您的米礼",
      "cart.title": "购物车",
      "cart.continue": "继续选购",
      "cart.items": "商品清单",
      "cart.clear": "清空购物车",
      "cart.empty": "购物车里还没有米礼",
      "cart.emptyHint": "从一片五常稻田开始，选一份属于你的当季好米。",
      "cart.choose": "去挑选米礼",
      "cart.benefit1": "满 199 元包邮",
      "cart.benefit1sub": "顺丰配送，原产地直发",
      "cart.benefit2": "消费即得积分",
      "cart.benefit3": "高端礼赠服务",
      "cart.benefit3sub": "礼盒可选祝福卡",
      "cart.summary": "订单小计",
      "cart.subtotal": "商品金额",
      "cart.shipping": "配送费",
      "cart.pointsEarn": "可得积分",
      "cart.total": "合计",
      "cart.checkout": "立即结算",
      "cart.secure": "安全模拟支付 · 本项目不会产生真实扣款",
      "cart.coupon": "礼遇",
      "cart.couponText": "首单享高端礼盒礼卡，结算后可添加祝福语。",
      "account.kicker": "明鼎米友会",
      "account.title": "会员中心",
      "account.backHome": "返回首页",
      "account.guestKicker": "MINGDING MEMBERSHIP",
      "account.guestTitle": "登录，续写你的米香时光",
      "account.guestBody": "查看积分、订单记录与会员专属米礼。新会员注册即享首单积分。",
      "account.login": "登录账户",
      "account.register": "注册会员",
      "account.demoHint": "体验账户：13800138000 / 123456",
      "account.welcome": "欢迎回来",
      "account.level": "稻香会员",
      "account.points": "会员积分",
      "account.pointUnit": "积分",
      "account.orders": "历史订单",
      "account.orderUnit": "笔",
      "account.rule": "积分规则",
      "account.ruleValue": "1 元 = 10 积分",
      "account.recentOrders": "订单记录",
      "account.refresh": "刷新",
      "account.noOrders": "还没有订单",
      "account.noOrdersHint": "从一碗五常好饭开始吧。",
      "account.shopNow": "去选购",
      "account.perks": "会员权益",
      "account.perk1": "消费积分",
      "account.perk1desc": "消费 1 元自动累计 10 积分",
      "account.perk2": "米礼优先",
      "account.perk2desc": "当季新米与礼盒优先购买",
      "account.perk3": "新鲜直达",
      "account.perk3desc": "五常原产地直发，锁住米香",
      "account.logout": "退出登录",
      "account.continue": "继续寻香",
      "account.status": "已完成",
      "account.itemsCount": "件商品",
      "account.historyTitle": "明鼎稻花香二号原粮",
      "auth.asideTitle": "一碗好饭，<br>值得被记住。",
      "auth.asideBody": "加入明鼎米友会，消费即可累计积分，收藏属于你的五常四季。",
      "auth.login": "登录",
      "auth.register": "注册",
      "auth.loginTitle": "欢迎回来",
      "auth.loginSubtitle": "登录账户，查看积分与订单记录。",
      "auth.registerTitle": "加入明鼎米友会",
      "auth.registerSubtitle": "注册会员，消费自动累计积分。",
      "auth.phone": "手机号码",
      "auth.password": "登录密码",
      "auth.name": "称呼",
      "auth.phonePlaceholder": "请输入手机号码",
      "auth.passwordPlaceholder": "请输入密码",
      "auth.namePlaceholder": "例如：林女士",
      "auth.registerPhonePlaceholder": "请输入 11 位手机号码",
      "auth.registerPasswordPlaceholder": "至少 6 位字符",
      "auth.terms": "我已阅读并同意会员条款与隐私说明",
      "auth.loginButton": "登录账户",
      "auth.registerButton": "注册会员",
      "auth.demoLogin": "使用体验账户登录",
      "checkout.title": "确认订单",
      "checkout.step1": "确认订单",
      "checkout.step2": "模拟支付",
      "checkout.step3": "支付完成",
      "checkout.recipient": "收货信息",
      "checkout.name": "收货人",
      "checkout.phone": "联系电话",
      "checkout.address": "详细地址",
      "checkout.note": "礼赠祝福（选填）",
      "checkout.namePlaceholder": "请输入姓名",
      "checkout.phonePlaceholder": "请输入手机号码",
      "checkout.addressPlaceholder": "省 / 市 / 区 / 街道门牌",
      "checkout.notePlaceholder": "例如：愿四时安好，饭香常伴。",
      "checkout.paymentMethod": "支付方式",
      "checkout.wechat": "微信支付",
      "checkout.alipay": "支付宝",
      "checkout.card": "银行卡",
      "checkout.simulation": "当前为完整模拟支付流程，不会产生真实扣款。",
      "checkout.summary": "订单明细",
      "checkout.pay": "确认并模拟支付",
      "checkout.agree": "点击即代表同意订单及配送说明",
      "checkout.processing": "正在模拟支付",
      "checkout.processingHint": "请稍候，我们正在为你封存这一季的五常米香。",
      "checkout.success": "支付成功",
      "checkout.successHint": "五常的好米已经启程，愿它温柔抵达你的餐桌。",
      "checkout.orderNo": "订单编号",
      "checkout.pointsAdded": "新增积分",
      "checkout.viewOrder": "查看订单",
      "checkout.continueShopping": "继续寻香",
      "footer.statement": "一季一作，敬畏土地。把五常黑土地的清甜米香，郑重带到每一张餐桌。",
      "footer.explore": "探索明鼎",
      "footer.service": "客户服务",
      "footer.visit": "稻香有约",
      "footer.address": "中国 · 黑龙江省五常市",
      "footer.hours": "周一至周日 09:00–18:00",
      "footer.design": "包装设计",
      "footer.rights": "保留所有权利 · 本网站为品牌演示项目",
      "footer.top": "回到顶部",
      "footer.videoCredit": "视频素材：Jnanaranjan Sahu / Wikimedia Commons，CC BY-SA 3.0",
      "alt.bagFront": "普通袋装大米包装正面",
      "alt.giftFront": "高端礼盒装大米包装正面",
      "alt.paddy": "五常稻田远景插画",
      "toast.added": "已加入购物车",
      "toast.removed": "已移出购物车",
      "toast.cleared": "购物车已清空",
      "toast.cartEmpty": "购物车里还没有商品",
      "toast.loginRequired": "请先登录会员账户",
      "toast.loginSuccess": "登录成功，欢迎回来",
      "toast.registerSuccess": "注册成功，欢迎加入米友会",
      "toast.logout": "已安全退出",
      "toast.loginFailed": "手机号或密码不正确",
      "toast.duplicate": "该手机号码已注册",
      "toast.invalidPhone": "请输入正确的 11 位手机号码",
      "toast.shortPassword": "密码至少需要 6 位字符",
      "toast.shippingMissing": "请完整填写收货信息",
      "toast.orderOutside": "当前 5 kg 规格请填写有效手机号",
      "toast.language": "语言已切换",
      "toast.refreshed": "订单记录已刷新",
      "toast.video": "宣传视频播放中"
    },

    en: {
      "meta.title": "Mingding Daohuaxiang No.2 Rice | Wuchang Qianfeng",
      "brand": "Wuchang Qianfeng Agriculture",
      "nav.home": "Home",
      "nav.products": "Rice Selection",
      "nav.about": "Our Origin",
      "nav.member": "Membership",
      "nav.cart": "Cart",
      "nav.login": "Sign in",
      "hero.film": "Rice fields of Wuchang · Field film",
      "hero.eyebrow": "45° NORTH · WUCHANG, CHINA",
      "hero.title1": "Black Soil of Wuchang",
      "hero.title2": "A Once-a-Year Aroma",
      "hero.subtitle": "From the cold-land fields to a warm bowl of rice. Mingding Daohuaxiang No.2 is milled from the new season harvest, preserving the pure aroma of the land.",
      "hero.shop": "Explore the Harvest",
      "hero.story": "Discover Wuchang",
      "hero.meta1": "Hours of Sun",
      "hero.meta2": "Growing Degree",
      "hero.meta3": "Harvest a Year",
      "hero.scroll": "Scroll to discover",
      "strip.1": "Wuchang Core Region",
      "strip.2": "One Harvest a Year",
      "strip.3": "New-Season Rice",
      "strip.4": "Shipped at Origin",
      "strip.5": "Eastern Gift Ritual",
      "strip.6": "Natural Fragrance",
      "origin.stamp": "WUCHANG<br>ORIGIN",
      "origin.vertical": "THE LAND HAS RHYTHM · SO DOES RICE",
      "origin.kicker": "A GIFT OF TERROIR",
      "origin.title1": "Good rice always honours",
      "origin.title2": "the land it comes from.",
      "origin.lead": "Rooted in Wuchang's core rice region, Wuchang Qianfeng Agriculture waits for every grain to ripen naturally, with reverence for the land.",
      "origin.body": "Cold-region black soil, wide day-night temperature swings and clear water from the Changbai mountains shape the sweet, tender, lustrous grain of Daohuaxiang No.2. We harvest once a year and mill only the new season crop, keeping the land's true aroma in every bowl.",
      "origin.feature1": "Black Soil",
      "origin.feature1sub": "Naturally nourished",
      "origin.feature2": "One Harvest",
      "origin.feature2sub": "In tune with seasons",
      "origin.feature3": "Fresh Milling",
      "origin.feature3sub": "Aroma preserved",
      "product.kicker": "SEASONAL SELECTION",
      "product.title": "A bag of rice fragrance, holding all of Wuchang's autumn",
      "product.subtitle": "The everyday bag for an honest bowl of rice; the premium gift box for a considered expression of care.",
      "product.drag": "DRAG TO ROTATE · 360° VIEW",
      "product.front": "Front",
      "product.side": "Side",
      "product.back": "Back",
      "product.tagClassic": "EVERYDAY BAG · 5KG",
      "product.tagGift": "PREMIUM GIFT · 5KG",
      "product.name": "Mingding Daohuaxiang No.2 Rice",
      "product.reviews": "Collected by 2,186 members",
      "product.spec": "Choose an edition",
      "product.specHint": "Two gifts, one rice field",
      "product.classic": "Everyday Bag",
      "product.gift": "Premium Gift Box",
      "product.daily": "For every day",
      "product.giftFor": "For gifting",
      "product.price": "Member price",
      "product.points": "Points earned",
      "product.addCart": "Add to Cart",
      "product.buyNow": "Buy Now",
      "product.assurance1": "Origin shipping",
      "product.assurance2": "Damage care",
      "product.assurance3": "Free delivery",
      "craft.kicker": "ONE HARVEST A YEAR",
      "craft.title": "Let time become part of the fragrance",
      "craft.subtitle": "We do not chase the season. We wait for ripeness. Each step follows Wuchang's natural rhythm, quietly preserving nature's gift within every grain.",
      "craft.season1": "SUMMER · SOWING",
      "craft.step1": "Cold-Land Seedlings",
      "craft.step1desc": "Selected Daohuaxiang No.2 seeds grow slowly through temperature shifts, gathering sweetness.",
      "craft.season2": "LATE SPRING · GROWTH",
      "craft.step2": "Living Water",
      "craft.step2desc": "Pure mountain-fed water meets rich black soil to nurture each ear of rice.",
      "craft.season3": "AUTUMN · RIPENING",
      "craft.step3": "Harvested in Time",
      "craft.step3desc": "We wait for each ear to bow naturally, never early or hastened, preserving its true flavour.",
      "craft.season4": "WINTER · TASTING",
      "craft.step4": "Freshly Milled",
      "craft.step4desc": "Low-temperature milling and sealed freshness bring Wuchang's autumn to your table.",
      "design.kicker": "AN EASTERN RICE GIFT",
      "design.title1": "A vessel for care,",
      "design.title2": "and for a sense of place.",
      "design.body": "From a daily meal to a meaningful gift, Mingding brings Wuchang's restraint and abundance into an Eastern package of forest green, rice white and muted gold.",
      "design.view": "View Three-View Packaging",
      "design.color1": "Rice White",
      "design.color2": "Muted Gold",
      "design.color3": "Forest Green",
      "design.modalTitle": "Mingding Packaging Three-View Design",
      "design.download": "Download vector artwork",
      "design.brandLabel": "Brand",
      "design.originLabel": "Origin",
      "member.kicker": "MINGDING RICE CLUB",
      "member.title": "Every good bowl leaves an echo",
      "member.body": "Join the club and earn 10 points for every ¥1 spent. Your points grow with every order, season after season.",
      "member.join": "Join the Club",
      "member.viewAccount": "View Membership",
      "products.kicker": "MINGDING SELECTION",
      "products.title": "Bring Wuchang's autumn home",
      "products.subtitle": "One black-soil origin, two considered ways to meet. For daily rituals or meaningful gifting.",
      "products.all": "All Gifts",
      "products.classicFilter": "Everyday Bag",
      "products.giftFilter": "Premium Gift",
      "products.count": "seasonal selections",
      "products.dailyBadge": "Everyday Choice",
      "products.giftBadge": "Gift Choice",
      "products.classicDesc": "New-season rice with full grains and a clean, sweet aroma. Made for an everyday good bowl.",
      "products.giftDesc": "Individually packed in a gold-embossed box with Eastern ceremony. A gift of Wuchang terroir.",
      "products.service1": "Origin Shipping",
      "products.service1desc": "Sent directly from Wuchang",
      "products.service2": "Fresh Seal",
      "products.service2desc": "Low-temperature milling",
      "products.service3": "Careful Delivery",
      "products.service3desc": "Damage care, free delivery",
      "products.service4": "Member Points",
      "products.service4desc": "10 points per ¥1",
      "about.kicker": "OUR ORIGIN",
      "about.title1": "One land of black soil,",
      "about.title2": "one season of good rice.",
      "about.subtitle": "At Wuchang Qianfeng Agriculture, we believe the finest flavour comes from land, season and patience.",
      "about.originKicker": "SOURCE OF TERROIR",
      "about.originTitle": "Wuchang: where rice fragrance begins",
      "about.p1": "Wuchang lies in southern Heilongjiang amid rare cold-region black soil. The Changbai mountains, Lalin and Xilang rivers, and dramatic day-night temperatures help rice gather deeper flavour through slow growth.",
      "about.p2": "Mingding Daohuaxiang No.2 grows within this core belt at 45° north. We follow a single harvest each year, reaping only when the grain is naturally ripe and milling the new crop for every order.",
      "about.num1": "Golden Latitude",
      "about.num2": "Growing Degree",
      "about.num3": "One Harvest",
      "about.num4": "Wuchang Origin",
      "about.value1": "Revere the Land",
      "about.value1desc": "We respect natural rhythms and protect the living black soil with a long-term view.",
      "about.value2": "True Fragrance",
      "about.value2desc": "Minimal processing, patient harvest, and the natural sweetness of new-season grain.",
      "about.value3": "Eastern Ceremony",
      "about.value3desc": "A restrained, elegant Eastern aesthetic gives new meaning to a bowl of rice.",
      "about.designTitle": "From rice field to a gift of meaning",
      "about.designBody": "Explore complete three-view designs for the everyday bag and premium gift box.",
      "cart.kicker": "YOUR SELECTION",
      "cart.title": "Shopping Cart",
      "cart.continue": "Continue Shopping",
      "cart.items": "Your Items",
      "cart.clear": "Clear Cart",
      "cart.empty": "Your cart is waiting for its first rice gift",
      "cart.emptyHint": "Begin with a Wuchang rice field and choose your new-season rice.",
      "cart.choose": "Explore Selections",
      "cart.benefit1": "Free over ¥199",
      "cart.benefit1sub": "SF Express from origin",
      "cart.benefit2": "Earn Member Points",
      "cart.benefit3": "Premium Gift Service",
      "cart.benefit3sub": "Add a message card",
      "cart.summary": "Order Summary",
      "cart.subtotal": "Subtotal",
      "cart.shipping": "Delivery",
      "cart.pointsEarn": "Points earned",
      "cart.total": "Total",
      "cart.checkout": "Checkout",
      "cart.secure": "Secure simulated checkout · No real payment will be taken",
      "cart.coupon": "GIFT NOTE",
      "cart.couponText": "Choose a greeting card at checkout for the premium gift box.",
      "account.kicker": "MINGDING RICE CLUB",
      "account.title": "Membership",
      "account.backHome": "Back to Home",
      "account.guestKicker": "MINGDING MEMBERSHIP",
      "account.guestTitle": "Sign in and continue your rice story",
      "account.guestBody": "View points, order history and member rice gifts. New members earn points from their first order.",
      "account.login": "Sign In",
      "account.register": "Create Account",
      "account.demoHint": "Demo account: 13800138000 / 123456",
      "account.welcome": "Welcome back",
      "account.level": "Rice Aroma Member",
      "account.points": "Member Points",
      "account.pointUnit": "points",
      "account.orders": "Total Orders",
      "account.orderUnit": "orders",
      "account.rule": "Points Rule",
      "account.ruleValue": "¥1 = 10 points",
      "account.recentOrders": "Order History",
      "account.refresh": "Refresh",
      "account.noOrders": "No orders yet",
      "account.noOrdersHint": "Begin with a good bowl from Wuchang.",
      "account.shopNow": "Shop Now",
      "account.perks": "Member Benefits",
      "account.perk1": "Purchase Points",
      "account.perk1desc": "Earn 10 points for every ¥1 spent",
      "account.perk2": "Early Rice Gifts",
      "account.perk2desc": "Priority access to new-season rice",
      "account.perk3": "Fresh Delivery",
      "account.perk3desc": "Direct from Wuchang with freshness sealed",
      "account.logout": "Sign Out",
      "account.continue": "Continue Discovering",
      "account.status": "Completed",
      "account.itemsCount": "items",
      "account.historyTitle": "Mingding Daohuaxiang No.2 Rice",
      "auth.asideTitle": "A good bowl of rice,<br>worth remembering.",
      "auth.asideBody": "Join the Mingding Rice Club, collect points with every order, and keep your own seasons of Wuchang.",
      "auth.login": "Sign In",
      "auth.register": "Register",
      "auth.loginTitle": "Welcome back",
      "auth.loginSubtitle": "Sign in to view your points and order history.",
      "auth.registerTitle": "Join the Mingding Rice Club",
      "auth.registerSubtitle": "Create an account and earn points automatically.",
      "auth.phone": "Mobile Number",
      "auth.password": "Password",
      "auth.name": "Your Name",
      "auth.phonePlaceholder": "Enter mobile number",
      "auth.passwordPlaceholder": "Enter password",
      "auth.namePlaceholder": "For example: Ms. Lin",
      "auth.registerPhonePlaceholder": "Enter an 11-digit mobile number",
      "auth.registerPasswordPlaceholder": "At least 6 characters",
      "auth.terms": "I agree to the membership and privacy terms",
      "auth.loginButton": "Sign In",
      "auth.registerButton": "Create Account",
      "auth.demoLogin": "Use demo account",
      "checkout.title": "Confirm Order",
      "checkout.step1": "Confirm",
      "checkout.step2": "Simulate Payment",
      "checkout.step3": "Complete",
      "checkout.recipient": "Delivery Information",
      "checkout.name": "Recipient",
      "checkout.phone": "Phone",
      "checkout.address": "Address",
      "checkout.note": "Gift Message (optional)",
      "checkout.namePlaceholder": "Enter recipient name",
      "checkout.phonePlaceholder": "Enter phone number",
      "checkout.addressPlaceholder": "Province / City / District / Street",
      "checkout.notePlaceholder": "For example: May every season bring warmth and good meals.",
      "checkout.paymentMethod": "Payment Method",
      "checkout.wechat": "WeChat Pay",
      "checkout.alipay": "Alipay",
      "checkout.card": "Bank Card",
      "checkout.simulation": "This is a complete demo checkout. No real charge will be made.",
      "checkout.summary": "Order Details",
      "checkout.pay": "Confirm & Simulate Payment",
      "checkout.agree": "By continuing, you agree to the delivery terms",
      "checkout.processing": "Simulating Payment",
      "checkout.processingHint": "One moment while we seal the fragrance of this season's Wuchang rice.",
      "checkout.success": "Payment Successful",
      "checkout.successHint": "Your rice is on its way. May it arrive gently at your table.",
      "checkout.orderNo": "Order Number",
      "checkout.pointsAdded": "Points Added",
      "checkout.viewOrder": "View Order",
      "checkout.continueShopping": "Continue Exploring",
      "footer.statement": "One harvest a year, with reverence for the land. We bring Wuchang's sweet rice aroma to every table.",
      "footer.explore": "Explore Mingding",
      "footer.service": "Customer Care",
      "footer.visit": "Visit the Origin",
      "footer.address": "Wuchang, Heilongjiang, China",
      "footer.hours": "Monday–Sunday 09:00–18:00",
      "footer.design": "Packaging Design",
      "footer.rights": "All rights reserved · Brand demonstration project",
      "footer.top": "Back to top",
      "footer.videoCredit": "Film: Jnanaranjan Sahu / Wikimedia Commons, CC BY-SA 3.0",
      "alt.bagFront": "Front of the everyday rice bag",
      "alt.giftFront": "Front of the premium rice gift box",
      "alt.paddy": "Illustration of Wuchang rice fields",
      "toast.added": "Added to cart",
      "toast.removed": "Removed from cart",
      "toast.cleared": "Cart cleared",
      "toast.cartEmpty": "Your cart is empty",
      "toast.loginRequired": "Please sign in to your member account",
      "toast.loginSuccess": "Signed in successfully",
      "toast.registerSuccess": "Welcome to the Rice Club",
      "toast.logout": "You have signed out",
      "toast.loginFailed": "Incorrect mobile number or password",
      "toast.duplicate": "That mobile number is already registered",
      "toast.invalidPhone": "Please enter a valid 11-digit mobile number",
      "toast.shortPassword": "Password must be at least 6 characters",
      "toast.shippingMissing": "Please complete the delivery information",
      "toast.orderOutside": "Please enter a valid phone number",
      "toast.language": "Language switched",
      "toast.refreshed": "Order history refreshed",
      "toast.video": "Film is playing"
    },

    ja: {
      "meta.title": "明鼎 稻花香二号玄米 | 五常乾豊農業",
      "brand": "五常乾豊農業",
      "nav.home": "ホーム",
      "nav.products": "お米ギフト",
      "nav.about": "五常の物語",
      "nav.member": "会員センター",
      "nav.cart": "カート",
      "nav.login": "ログイン",
      "hero.film": "五常の田園 · 実写映像",
      "hero.eyebrow": "北緯45° · 中国五常",
      "hero.title1": "五常の黒土",
      "hero.title2": "年に一度の稲香",
      "hero.subtitle": "寒地の田んぼから、温かな一杯のごはんへ。明鼎 稻花香二号は新米だけを精米し、大地本来の香りを守ります。",
      "hero.shop": "新米ギフトを見る",
      "hero.story": "五常の物語へ",
      "hero.meta1": "豊かな日照",
      "hero.meta2": "生育積算温度",
      "hero.meta3": "年一作",
      "hero.scroll": "下へスクロール",
      "strip.1": "五常核心産地",
      "strip.2": "年一作",
      "strip.3": "新米",
      "strip.4": "産地直送",
      "strip.5": "東洋の贈りもの",
      "strip.6": "自然な香り",
      "origin.stamp": "五常<br>原産",
      "origin.vertical": "大地にリズムがある · お米にも",
      "origin.kicker": "風土の贈りもの",
      "origin.title1": "よいお米は、",
      "origin.title2": "大地に応える。",
      "origin.lead": "五常乾豊農業は黒竜江省五常の核心稲作地に根ざし、大地を敬いながら稲穂が自然に実る時を待ちます。",
      "origin.body": "寒地の黒土、大きな寒暖差、長白山系の清らかな水が、稻花香二号の甘く、柔らかく、つやのある味わいを育みます。年一作、新米だけを低温精米し、黒土の本物の香りを一碗に残します。",
      "origin.feature1": "寒地の黒土",
      "origin.feature1sub": "自然が育む",
      "origin.feature2": "年一作",
      "origin.feature2sub": "季節に順う",
      "origin.feature3": "新米精米",
      "origin.feature3sub": "香りを閉じ込める",
      "product.kicker": "季節のセレクション",
      "product.title": "一袋の稲香に、五常の秋を",
      "product.subtitle": "毎日の食卓には日常袋。大切な方への贈りものには上質なギフトボックスを。",
      "product.drag": "ドラッグして回転 · 360°",
      "product.front": "正面",
      "product.side": "側面",
      "product.back": "背面",
      "product.tagClassic": "日常袋 · 5KG",
      "product.tagGift": "上質ギフト · 5KG",
      "product.name": "明鼎 稻花香二号玄米",
      "product.reviews": "2,186名の会員が愛用",
      "product.spec": "仕様を選択",
      "product.specHint": "同じ田んぼから、二つの米ギフト",
      "product.classic": "日常袋",
      "product.gift": "上質ギフト",
      "product.daily": "毎日のために",
      "product.giftFor": "贈りものに",
      "product.price": "会員価格",
      "product.points": "獲得ポイント",
      "product.addCart": "カートに追加",
      "product.buyNow": "今すぐ購入",
      "product.assurance1": "産地直送",
      "product.assurance2": "破損保証",
      "product.assurance3": "送料無料",
      "craft.kicker": "年一作",
      "craft.title": "時間を、お米の香りの一部に",
      "craft.subtitle": "季節を急がず、熟す時を待ちます。五常のリズムに沿って、自然の恵みを一粒一粒に静かに残します。",
      "craft.season1": "夏 · 播種",
      "craft.step1": "寒地の育苗",
      "craft.step1desc": "稻花香二号の原種を選び、寒暖差の中でゆっくり育て、甘みを蓄えます。",
      "craft.season2": "晩春 · 成長",
      "craft.step2": "清らかな水",
      "craft.step2desc": "長白山系の水と黒土が、稲穂を健やかに育てます。",
      "craft.season3": "秋 · 成熟",
      "craft.step3": "時を守る収穫",
      "craft.step3desc": "穂が自然に頭を垂れるまで待ち、早刈りも追熟もしません。",
      "craft.season4": "冬 · 味わい",
      "craft.step4": "新米精米",
      "craft.step4desc": "低温でゆっくり精米し、密封して五常の秋を食卓へ。",
      "design.kicker": "東洋の米ギフト",
      "design.title1": "想いを包み、",
      "design.title2": "風土も包む。",
      "design.body": "日常の食卓から大切な贈りものまで。墨緑をベースに、米白とくすみゴールドを添え、五常の静けさと豊かさを東洋の包みに込めました。",
      "design.view": "パッケージ三面図を見る",
      "design.color1": "米白",
      "design.color2": "くすみゴールド",
      "design.color3": "墨緑",
      "design.modalTitle": "明鼎パッケージ三面図",
      "design.download": "ベクター原本をダウンロード",
      "design.brandLabel": "ブランド",
      "design.originLabel": "産地",
      "member.kicker": "明鼎ライスクラブ",
      "member.title": "よい一杯には、響きがある",
      "member.body": "会員登録で、1元につき10ポイント。注文とともにポイントが貯まり、食卓の四季を記録します。",
      "member.join": "会員になる",
      "member.viewAccount": "会員センターへ",
      "products.kicker": "明鼎セレクション",
      "products.title": "五常の秋を、家へ",
      "products.subtitle": "同じ黒土から生まれた、二つの出会い。日常使いにも、心を込めた贈りものにも。",
      "products.all": "すべて",
      "products.classicFilter": "日常袋",
      "products.giftFilter": "上質ギフト",
      "products.count": "季節のセレクション",
      "products.dailyBadge": "日常の選択",
      "products.giftBadge": "贈りものの選択",
      "products.classicDesc": "新米らしいふっくらとした粒と、甘く澄んだ香り。毎日のごはんに。",
      "products.giftDesc": "個包装と金箔押しのギフトボックス。五常の風土を丁寧に贈ります。",
      "products.service1": "産地直送",
      "products.service1desc": "五常から直接発送",
      "products.service2": "鮮度を密封",
      "products.service2desc": "低温精米と密封包装",
      "products.service3": "安心配送",
      "products.service3desc": "破損保証・送料無料",
      "products.service4": "会員ポイント",
      "products.service4desc": "1元で10ポイント",
      "about.kicker": "五常の物語",
      "about.title1": "ひとつの黒土、",
      "about.title2": "ひと季のお米。",
      "about.subtitle": "最高の味は、大地、季節、そして忍耐から生まれると信じています。",
      "about.originKicker": "風土の源",
      "about.originTitle": "五常、稲香が生まれる場所",
      "about.p1": "五常は黒竜江省南部に位置し、世界でも稀な寒地の黒土に恵まれています。長白山系、拉林河と溪浪河、寒暖差がお米に深い風味を与えます。",
      "about.p2": "明鼎 稻花香二号は北緯45°の核心地で育ちます。年一作のリズムを守り、自然に熟した時だけ収穫し、その新米を精米してお届けします。",
      "about.num1": "黄金の緯度",
      "about.num2": "積算温度",
      "about.num3": "年一作",
      "about.num4": "五常原産",
      "about.value1": "大地を敬う",
      "about.value1desc": "自然のリズムを守り、長い視点で黒土を育みます。",
      "about.value2": "本物の香り",
      "about.value2desc": "過度な加工を避け、新米本来の甘みとつやを守ります。",
      "about.value3": "東洋の礼",
      "about.value3desc": "静かで上品な東洋の美で、ごはんの価値を新しく表現します。",
      "about.designTitle": "田んぼから、心の贈りものへ",
      "about.designBody": "日常袋と上質ギフトのパッケージ三面図を確認できます。",
      "cart.kicker": "選んだお米",
      "cart.title": "ショッピングカート",
      "cart.continue": "買い物を続ける",
      "cart.items": "商品リスト",
      "cart.clear": "カートを空にする",
      "cart.empty": "カートにまだお米ギフトがありません",
      "cart.emptyHint": "五常の田んぼから、あなたの季節のお米を選びましょう。",
      "cart.choose": "ギフトを選ぶ",
      "cart.benefit1": "199元以上送料無料",
      "cart.benefit1sub": "産地からSF Expressで発送",
      "cart.benefit2": "購入でポイント",
      "cart.benefit3": "上質ギフトサービス",
      "cart.benefit3sub": "メッセージカード付き",
      "cart.summary": "ご注文内容",
      "cart.subtotal": "商品金額",
      "cart.shipping": "送料",
      "cart.pointsEarn": "獲得ポイント",
      "cart.total": "合計",
      "cart.checkout": "購入手続きへ",
      "cart.secure": "安全な支払いシミュレーション · 実際の請求はありません",
      "cart.coupon": "ギフト特典",
      "cart.couponText": "上質ギフトにはメッセージカードをお付けできます。",
      "account.kicker": "明鼎ライスクラブ",
      "account.title": "会員センター",
      "account.backHome": "ホームへ戻る",
      "account.guestKicker": "MINGDING MEMBERSHIP",
      "account.guestTitle": "ログインして、お米の物語を続ける",
      "account.guestBody": "ポイント、注文履歴、会員限定ギフトを確認できます。新規登録で初回注文からポイントが貯まります。",
      "account.login": "ログイン",
      "account.register": "会員登録",
      "account.demoHint": "体験アカウント：13800138000 / 123456",
      "account.welcome": "おかえりなさい",
      "account.level": "稲香会員",
      "account.points": "会員ポイント",
      "account.pointUnit": "ポイント",
      "account.orders": "注文履歴",
      "account.orderUnit": "件",
      "account.rule": "ポイント規則",
      "account.ruleValue": "1元 = 10ポイント",
      "account.recentOrders": "注文履歴",
      "account.refresh": "更新",
      "account.noOrders": "まだ注文がありません",
      "account.noOrdersHint": "五常のおいしい一杯から始めましょう。",
      "account.shopNow": "購入する",
      "account.perks": "会員特典",
      "account.perk1": "購入ポイント",
      "account.perk1desc": "1元ごとに10ポイント",
      "account.perk2": "米ギフト優先",
      "account.perk2desc": "新米とギフトを優先案内",
      "account.perk3": "フレッシュ直送",
      "account.perk3desc": "五常から鮮度を保ってお届け",
      "account.logout": "ログアウト",
      "account.continue": "もっと知る",
      "account.status": "完了",
      "account.itemsCount": "点",
      "account.historyTitle": "明鼎 稻花香二号玄米",
      "auth.asideTitle": "よい一杯は、<br>記憶に残る。",
      "auth.asideBody": "明鼎ライスクラブに参加し、購入ごとにポイントを。あなたの五常の四季を残しましょう。",
      "auth.login": "ログイン",
      "auth.register": "会員登録",
      "auth.loginTitle": "おかえりなさい",
      "auth.loginSubtitle": "ポイントと注文履歴を確認できます。",
      "auth.registerTitle": "明鼎ライスクラブへ",
      "auth.registerSubtitle": "会員登録で購入時に自動でポイントが貯まります。",
      "auth.phone": "携帯番号",
      "auth.password": "パスワード",
      "auth.name": "お名前",
      "auth.phonePlaceholder": "携帯番号を入力",
      "auth.passwordPlaceholder": "パスワードを入力",
      "auth.namePlaceholder": "例：林",
      "auth.registerPhonePlaceholder": "11桁の携帯番号を入力",
      "auth.registerPasswordPlaceholder": "6文字以上",
      "auth.terms": "会員規約とプライバシー説明に同意します",
      "auth.loginButton": "ログイン",
      "auth.registerButton": "会員登録",
      "auth.demoLogin": "体験アカウントを使う",
      "checkout.title": "注文確認",
      "checkout.step1": "注文確認",
      "checkout.step2": "支払いシミュレーション",
      "checkout.step3": "完了",
      "checkout.recipient": "お届け先",
      "checkout.name": "お名前",
      "checkout.phone": "電話番号",
      "checkout.address": "ご住所",
      "checkout.note": "ギフトメッセージ（任意）",
      "checkout.namePlaceholder": "お名前を入力",
      "checkout.phonePlaceholder": "電話番号を入力",
      "checkout.addressPlaceholder": "省 / 市 / 区 / 番地",
      "checkout.notePlaceholder": "例：四季の安らぎと、おいしいごはんを。",
      "checkout.paymentMethod": "支払い方法",
      "checkout.wechat": "WeChat Pay",
      "checkout.alipay": "Alipay",
      "checkout.card": "クレジットカード",
      "checkout.simulation": "これはデモです。実際の請求は発生しません。",
      "checkout.summary": "注文内容",
      "checkout.pay": "確認して支払いをシミュレート",
      "checkout.agree": "続行すると配送条件に同意したものとみなされます",
      "checkout.processing": "支払いを処理しています",
      "checkout.processingHint": "五常の新米の香りを閉じ込めています。少々お待ちください。",
      "checkout.success": "お支払い完了",
      "checkout.successHint": "五常のお米が出発しました。やさしく食卓へ届きますように。",
      "checkout.orderNo": "注文番号",
      "checkout.pointsAdded": "獲得ポイント",
      "checkout.viewOrder": "注文を見る",
      "checkout.continueShopping": "買い物を続ける",
      "footer.statement": "年一作、大地を敬う。五常の黒土の甘い香りを、すべての食卓へ。",
      "footer.explore": "明鼎を知る",
      "footer.service": "カスタマーサービス",
      "footer.visit": "産地を訪ねる",
      "footer.address": "中国 · 黒竜江省五常市",
      "footer.hours": "月曜〜日曜 09:00–18:00",
      "footer.design": "パッケージデザイン",
      "footer.rights": "無断転載を禁じます · ブランドデモプロジェクト",
      "footer.top": "トップへ",
      "footer.videoCredit": "映像：Jnanaranjan Sahu / Wikimedia Commons、CC BY-SA 3.0",
      "alt.bagFront": "日常袋お米パッケージ正面",
      "alt.giftFront": "上質お米ギフトボックス正面",
      "alt.paddy": "五常の田園イラスト",
      "toast.added": "カートに追加しました",
      "toast.removed": "カートから削除しました",
      "toast.cleared": "カートを空にしました",
      "toast.cartEmpty": "カートは空です",
      "toast.loginRequired": "会員アカウントにログインしてください",
      "toast.loginSuccess": "ログインしました",
      "toast.registerSuccess": "ライスクラブへようこそ",
      "toast.logout": "ログアウトしました",
      "toast.loginFailed": "携帯番号またはパスワードが違います",
      "toast.duplicate": "この携帯番号は登録済みです",
      "toast.invalidPhone": "正しい11桁の携帯番号を入力してください",
      "toast.shortPassword": "パスワードは6文字以上必要です",
      "toast.shippingMissing": "お届け先情報をすべて入力してください",
      "toast.orderOutside": "有効な電話番号を入力してください",
      "toast.language": "言語を切り替えました",
      "toast.refreshed": "注文履歴を更新しました",
      "toast.video": "映像を再生中"
    },

    ko: {
      "meta.title": "명정 다오화샹 2호 원곡 쌀 | 우창 첸펑 농업",
      "brand": "우창 첸펑 농업",
      "nav.home": "홈",
      "nav.products": "쌀 선물",
      "nav.about": "우창 이야기",
      "nav.member": "멤버십",
      "nav.cart": "장바구니",
      "nav.login": "로그인",
      "hero.film": "우창 논 · 실제 영상",
      "hero.eyebrow": "북위 45° · 중국 우창",
      "hero.title1": "우창의 흑토",
      "hero.title2": "일 년에 한 번의 벼 향",
      "hero.subtitle": "추운 땅의 논에서 따뜻한 한 그릇 밥으로. 명정 다오화샹 2호는 새 수확 쌀만 도정해 대지 본연의 향을 담습니다.",
      "hero.shop": "시즌 쌀 선물 보기",
      "hero.story": "우창 이야기",
      "hero.meta1": "풍부한 일조",
      "hero.meta2": "생육 적산온도",
      "hero.meta3": "연 1작",
      "hero.scroll": "아래로 내려보기",
      "strip.1": "우창 핵심 산지",
      "strip.2": "연 1작",
      "strip.3": "새 수확 쌀",
      "strip.4": "산지 직송",
      "strip.5": "동양의 선물",
      "strip.6": "자연의 향",
      "origin.stamp": "우창<br>원산",
      "origin.vertical": "대지에 리듬이 있고 · 쌀에도 있습니다",
      "origin.kicker": "풍토의 선물",
      "origin.title1": "좋은 쌀은 언제나",
      "origin.title2": "대지에 보답합니다.",
      "origin.lead": "우창 첸펑 농업은 헤이룽장성 우창 핵심 벼 재배지에 뿌리내리고, 대지를 존중하며 모든 벼가 자연스럽게 익기를 기다립니다.",
      "origin.body": "추운 땅의 흑토, 큰 일교차, 장백산맥의 맑은 물이 다오화샹 2호의 달콤하고 부드러우며 윤기 있는 맛을 만듭니다. 연 1작, 새 수확 쌀만 저온 도정해 흑토 본연의 향을 한 그릇에 담습니다.",
      "origin.feature1": "추운 땅 흑토",
      "origin.feature1sub": "자연이 키운 땅",
      "origin.feature2": "연 1작",
      "origin.feature2sub": "계절을 따르는 수확",
      "origin.feature3": "새 쌀 도정",
      "origin.feature3sub": "향을 그대로",
      "product.kicker": "시즌 셀렉션",
      "product.title": "한 봉지의 벼 향에 우창의 가을을",
      "product.subtitle": "매일의 식탁에는 데일리 백, 소중한 분께는 프리미엄 선물 상자를.",
      "product.drag": "드래그하여 회전 · 360° 보기",
      "product.front": "정면",
      "product.side": "측면",
      "product.back": "후면",
      "product.tagClassic": "데일리 백 · 5KG",
      "product.tagGift": "프리미엄 선물 · 5KG",
      "product.name": "명정 다오화샹 2호 원곡 쌀",
      "product.reviews": "2,186명의 멤버가 선택",
      "product.spec": "구성 선택",
      "product.specHint": "같은 논에서 온 두 가지 쌀 선물",
      "product.classic": "데일리 백",
      "product.gift": "프리미엄 선물",
      "product.daily": "매일을 위해",
      "product.giftFor": "선물을 위해",
      "product.price": "멤버 가격",
      "product.points": "적립 포인트",
      "product.addCart": "장바구니 담기",
      "product.buyNow": "바로 구매",
      "product.assurance1": "산지 직송",
      "product.assurance2": "파손 보상",
      "product.assurance3": "무료 배송",
      "craft.kicker": "연 1작",
      "craft.title": "시간이 쌀 향의 일부가 되도록",
      "craft.subtitle": "계절을 재촉하지 않고 성숙을 기다립니다. 우창의 절기에 따라 자연의 선물을 한 알 한 알 조용히 담습니다.",
      "craft.season1": "여름 · 파종",
      "craft.step1": "한지 육묘",
      "craft.step1desc": "다오화샹 2호 원종을 골라 일교차 속에서 천천히 키우며 단맛을 쌓습니다.",
      "craft.season2": "늦봄 · 성장",
      "craft.step2": "맑은 물",
      "craft.step2desc": "장백산맥의 물과 흑토가 벼 이삭을 건강하게 키웁니다.",
      "craft.season3": "가을 · 성숙",
      "craft.step3": "때를 기다린 수확",
      "craft.step3desc": "이삭이 자연스럽게 고개 숙일 때까지 기다리며 조숙과 촉성을 하지 않습니다.",
      "craft.season4": "겨울 · 맛보기",
      "craft.step4": "새 쌀 도정",
      "craft.step4desc": "저온 완도정과 밀봉으로 우창의 가을을 식탁에 전합니다.",
      "design.kicker": "동양의 쌀 선물",
      "design.title1": "마음을 담고,",
      "design.title2": "풍토도 담습니다.",
      "design.body": "매일의 한 끼부터 특별한 선물까지. 명정은 먹빛 초록, 쌀빛 흰색, 은은한 금색으로 우창 논의 절제와 풍요를 동양의 패키지에 담았습니다.",
      "design.view": "패키지 3면 도면 보기",
      "design.color1": "쌀빛",
      "design.color2": "은은한 금색",
      "design.color3": "먹빛 초록",
      "design.modalTitle": "명정 패키지 3면 도면",
      "design.download": "벡터 원본 다운로드",
      "design.brandLabel": "브랜드",
      "design.originLabel": "원산지",
      "member.kicker": "명정 라이스 클럽",
      "member.title": "좋은 한 그릇에는 울림이 있습니다",
      "member.body": "멤버십 가입 후 1위안마다 10포인트. 주문과 함께 포인트가 쌓이며 식탁의 사계절을 기록합니다.",
      "member.join": "멤버 되기",
      "member.viewAccount": "멤버십 보기",
      "products.kicker": "명정 셀렉션",
      "products.title": "우창의 가을을 집으로",
      "products.subtitle": "같은 흑토에서 만난 두 가지 방식. 매일의 식사 또는 마음을 담은 선물.",
      "products.all": "모든 선물",
      "products.classicFilter": "데일리 백",
      "products.giftFilter": "프리미엄 선물",
      "products.count": "시즌 셀렉션",
      "products.dailyBadge": "매일의 선택",
      "products.giftBadge": "선물의 선택",
      "products.classicDesc": "새 수확 쌀의 충실한 알과 맑고 달콤한 향. 매일의 좋은 한 끼를 위해.",
      "products.giftDesc": "개별 포장과 금박 선물 상자에 동양의 예를 담아 우창의 풍토를 전합니다.",
      "products.service1": "산지 직송",
      "products.service1desc": "우창에서 직접 발송",
      "products.service2": "신선 밀봉",
      "products.service2desc": "저온 도정 후 밀봉 포장",
      "products.service3": "안심 배송",
      "products.service3desc": "파손 보상, 무료 배송",
      "products.service4": "멤버 포인트",
      "products.service4desc": "1위안당 10포인트",
      "about.kicker": "우창 이야기",
      "about.title1": "하나의 흑토,",
      "about.title2": "한 계절의 좋은 쌀.",
      "about.subtitle": "가장 좋은 맛은 땅과 계절, 그리고 인내에서 온다고 믿습니다.",
      "about.originKicker": "풍토의 시작",
      "about.originTitle": "우창, 쌀 향이 시작되는 곳",
      "about.p1": "우창은 헤이룽장성 남부에 있으며 세계적으로 드문 한지 흑토를 품고 있습니다. 장백산맥과 라린강, 시랑강, 큰 일교차가 쌀에 깊은 풍미를 더합니다.",
      "about.p2": "명정 다오화샹 2호는 북위 45° 핵심 재배지에서 자랍니다. 연 1작의 리듬을 지키며 자연스럽게 익은 후 수확하고, 새 쌀을 도정해 모든 기대에 답합니다.",
      "about.num1": "황금 재배 위도",
      "about.num2": "생육 적산온도",
      "about.num3": "연 1작",
      "about.num4": "우창 원산",
      "about.value1": "땅을 존중",
      "about.value1desc": "자연의 리듬을 지키고 긴 관점으로 흑토를 보호합니다.",
      "about.value2": "본연의 향",
      "about.value2desc": "과도한 가공과 조기 수확 없이 새 쌀의 단맛과 윤기를 지킵니다.",
      "about.value3": "동양의 예",
      "about.value3desc": "절제되고 우아한 동양 미학으로 한 그릇 밥의 가치를 새롭게 표현합니다.",
      "about.designTitle": "논에서 의미 있는 선물로",
      "about.designBody": "데일리 백과 프리미엄 선물 상자의 전체 3면 디자인을 확인하세요.",
      "cart.kicker": "선택한 쌀 선물",
      "cart.title": "장바구니",
      "cart.continue": "쇼핑 계속하기",
      "cart.items": "상품 목록",
      "cart.clear": "장바구니 비우기",
      "cart.empty": "장바구니에 아직 쌀 선물이 없습니다",
      "cart.emptyHint": "우창의 논에서 당신의 계절 쌀을 골라보세요.",
      "cart.choose": "쌀 선물 보기",
      "cart.benefit1": "199위안 이상 무료 배송",
      "cart.benefit1sub": "산지에서 SF Express 발송",
      "cart.benefit2": "구매 시 포인트 적립",
      "cart.benefit3": "프리미엄 선물 서비스",
      "cart.benefit3sub": "메시지 카드 선택 가능",
      "cart.summary": "주문 요약",
      "cart.subtotal": "상품 금액",
      "cart.shipping": "배송비",
      "cart.pointsEarn": "적립 포인트",
      "cart.total": "총액",
      "cart.checkout": "결제하기",
      "cart.secure": "안전한 모의 결제 · 실제 결제는 이루어지지 않습니다",
      "cart.coupon": "선물 혜택",
      "cart.couponText": "프리미엄 선물에는 축하 메시지 카드를 추가할 수 있습니다.",
      "account.kicker": "명정 라이스 클럽",
      "account.title": "멤버십",
      "account.backHome": "홈으로",
      "account.guestKicker": "MINGDING MEMBERSHIP",
      "account.guestTitle": "로그인하고 쌀 향의 시간을 이어가세요",
      "account.guestBody": "포인트, 주문 내역, 멤버 전용 쌀 선물을 확인하세요. 새 멤버는 첫 주문부터 포인트가 적립됩니다.",
      "account.login": "로그인",
      "account.register": "회원가입",
      "account.demoHint": "체험 계정: 13800138000 / 123456",
      "account.welcome": "다시 오신 것을 환영합니다",
      "account.level": "쌀 향 멤버",
      "account.points": "멤버 포인트",
      "account.pointUnit": "포인트",
      "account.orders": "주문 내역",
      "account.orderUnit": "건",
      "account.rule": "포인트 규칙",
      "account.ruleValue": "1위안 = 10포인트",
      "account.recentOrders": "주문 내역",
      "account.refresh": "새로고침",
      "account.noOrders": "아직 주문이 없습니다",
      "account.noOrdersHint": "우창의 좋은 한 그릇으로 시작해보세요.",
      "account.shopNow": "구매하기",
      "account.perks": "멤버 혜택",
      "account.perk1": "구매 포인트",
      "account.perk1desc": "1위안 소비마다 10포인트",
      "account.perk2": "쌀 선물 우선",
      "account.perk2desc": "새 쌀과 선물 상자 우선 안내",
      "account.perk3": "신선 직송",
      "account.perk3desc": "우창에서 신선하게 밀봉 발송",
      "account.logout": "로그아웃",
      "account.continue": "더 알아보기",
      "account.status": "완료",
      "account.itemsCount": "개",
      "account.historyTitle": "명정 다오화샹 2호 원곡 쌀",
      "auth.asideTitle": "좋은 한 그릇은,<br>기억할 가치가 있습니다.",
      "auth.asideBody": "명정 라이스 클럽에 가입하고 구매마다 포인트를 모아 당신의 우창 사계절을 간직하세요.",
      "auth.login": "로그인",
      "auth.register": "회원가입",
      "auth.loginTitle": "다시 오신 것을 환영합니다",
      "auth.loginSubtitle": "포인트와 주문 내역을 확인하세요.",
      "auth.registerTitle": "명정 라이스 클럽 가입",
      "auth.registerSubtitle": "회원가입 후 구매 시 자동으로 포인트가 적립됩니다.",
      "auth.phone": "휴대폰 번호",
      "auth.password": "비밀번호",
      "auth.name": "이름",
      "auth.phonePlaceholder": "휴대폰 번호 입력",
      "auth.passwordPlaceholder": "비밀번호 입력",
      "auth.namePlaceholder": "예: 린",
      "auth.registerPhonePlaceholder": "11자리 휴대폰 번호 입력",
      "auth.registerPasswordPlaceholder": "6자 이상",
      "auth.terms": "멤버십 약관과 개인정보 안내에 동의합니다",
      "auth.loginButton": "로그인",
      "auth.registerButton": "회원가입",
      "auth.demoLogin": "체험 계정 사용",
      "checkout.title": "주문 확인",
      "checkout.step1": "주문 확인",
      "checkout.step2": "모의 결제",
      "checkout.step3": "완료",
      "checkout.recipient": "배송 정보",
      "checkout.name": "받는 사람",
      "checkout.phone": "연락처",
      "checkout.address": "주소",
      "checkout.note": "선물 메시지 (선택)",
      "checkout.namePlaceholder": "받는 사람 이름",
      "checkout.phonePlaceholder": "전화번호 입력",
      "checkout.addressPlaceholder": "성 / 시 / 구 / 상세 주소",
      "checkout.notePlaceholder": "예: 사계절 평안과 맛있는 밥이 함께하기를.",
      "checkout.paymentMethod": "결제 수단",
      "checkout.wechat": "위챗 페이",
      "checkout.alipay": "알리페이",
      "checkout.card": "은행 카드",
      "checkout.simulation": "완전한 데모 결제입니다. 실제 청구는 없습니다.",
      "checkout.summary": "주문 상세",
      "checkout.pay": "확인 후 모의 결제",
      "checkout.agree": "계속하면 주문 및 배송 조건에 동의하게 됩니다",
      "checkout.processing": "결제를 처리하고 있습니다",
      "checkout.processingHint": "이번 시즌 우창 쌀의 향을 밀봉하는 중입니다. 잠시만 기다려주세요.",
      "checkout.success": "결제 완료",
      "checkout.successHint": "우창의 좋은 쌀이 출발했습니다. 식탁에 따뜻하게 도착하기를 바랍니다.",
      "checkout.orderNo": "주문 번호",
      "checkout.pointsAdded": "적립 포인트",
      "checkout.viewOrder": "주문 보기",
      "checkout.continueShopping": "계속 둘러보기",
      "footer.statement": "연 1작, 땅을 존중합니다. 우창 흑토의 달콤한 쌀 향을 모든 식탁에 전합니다.",
      "footer.explore": "명정 알아보기",
      "footer.service": "고객 서비스",
      "footer.visit": "산지 방문",
      "footer.address": "중국 · 헤이룽장성 우창시",
      "footer.hours": "월요일–일요일 09:00–18:00",
      "footer.design": "패키지 디자인",
      "footer.rights": "모든 권리 보유 · 브랜드 데모 프로젝트",
      "footer.top": "맨 위로",
      "footer.videoCredit": "영상: Jnanaranjan Sahu / Wikimedia Commons, CC BY-SA 3.0",
      "alt.bagFront": "데일리 쌀 봉투 패키지 정면",
      "alt.giftFront": "프리미엄 쌀 선물 상자 정면",
      "alt.paddy": "우창 논 풍경 일러스트",
      "toast.added": "장바구니에 담았습니다",
      "toast.removed": "장바구니에서 삭제했습니다",
      "toast.cleared": "장바구니를 비웠습니다",
      "toast.cartEmpty": "장바구니가 비어 있습니다",
      "toast.loginRequired": "멤버 계정에 로그인하세요",
      "toast.loginSuccess": "로그인되었습니다",
      "toast.registerSuccess": "라이스 클럽에 오신 것을 환영합니다",
      "toast.logout": "로그아웃되었습니다",
      "toast.loginFailed": "휴대폰 번호 또는 비밀번호가 올바르지 않습니다",
      "toast.duplicate": "이미 등록된 휴대폰 번호입니다",
      "toast.invalidPhone": "올바른 11자리 휴대폰 번호를 입력하세요",
      "toast.shortPassword": "비밀번호는 6자 이상이어야 합니다",
      "toast.shippingMissing": "배송 정보를 모두 입력하세요",
      "toast.orderOutside": "유효한 전화번호를 입력하세요",
      "toast.language": "언어가 변경되었습니다",
      "toast.refreshed": "주문 내역을 새로고침했습니다",
      "toast.video": "영상 재생 중"
    }
  };

  const localeMap = { zh: "zh-CN", en: "en-US", ja: "ja-JP", ko: "ko-KR" };
  let currentLanguage = localStorage.getItem(STORAGE.language) || "zh";
  if (!I18N[currentLanguage]) currentLanguage = "zh";

  const t = (key) => I18N[currentLanguage]?.[key] ?? I18N.zh[key] ?? key;

  /* ---------- Storage and account model ---------- */
  const readJSON = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const seedUsers = () => {
    const users = readJSON(STORAGE.users, null);
    if (Array.isArray(users)) return users;
    const seeded = [{
      name: "林沐禾",
      phone: "13800138000",
      password: "123456",
      points: 2860,
      createdAt: new Date("2026-09-18T10:00:00+08:00").toISOString(),
      orders: [{
        id: "QF26091808",
        items: [{ variant: "classic", qty: 2 }],
        subtotal: 178,
        shipping: 12,
        total: 190,
        points: 1900,
        status: "completed",
        createdAt: new Date("2026-09-18T10:00:00+08:00").toISOString(),
        recipient: "林沐禾",
        address: "黑龙江省哈尔滨市南岗区",
        note: ""
      }]
    }];
    writeJSON(STORAGE.users, seeded);
    return seeded;
  };

  let users = seedUsers();
  let sessionPhone = localStorage.getItem(STORAGE.session) || "";
  let currentUser = users.find((user) => user.phone === sessionPhone) || null;
  if (!currentUser) {
    sessionPhone = "";
    localStorage.removeItem(STORAGE.session);
  }

  const saveUsers = () => writeJSON(STORAGE.users, users);
  const syncCurrentUser = () => {
    currentUser = users.find((user) => user.phone === sessionPhone) || null;
  };

  /* ---------- Cart ---------- */
  const sanitizeCart = (items) => {
    if (!Array.isArray(items)) return [];
    return items
      .filter((item) => PRODUCTS[item?.variant] && Number(item.qty) > 0)
      .map((item) => ({ variant: item.variant, qty: clamp(Math.floor(Number(item.qty)), 1, 99) }));
  };
  let cart = sanitizeCart(readJSON(STORAGE.cart, []));

  const saveCart = () => writeJSON(STORAGE.cart, cart);
  const cartCount = () => cart.reduce((total, item) => total + item.qty, 0);
  const cartSubtotal = () => cart.reduce((total, item) => total + PRODUCTS[item.variant].price * item.qty, 0);
  const shippingFor = (subtotal) => subtotal === 0 || subtotal >= 199 ? 0 : 12;

  function updateCartBadges() {
    const count = cartCount();
    $("#cartCount").textContent = count;
    $("#floatingCartCount").textContent = count;
    $("#cartButton").setAttribute("aria-label", `${t("nav.cart")} (${count})`);
  }

  function itemName(variant) {
    return `明鼎稻花香二号 · ${t(variant === "gift" ? "product.gift" : "product.classic")}`;
  }

  function addToCart(variant, qty = 1) {
    if (!PRODUCTS[variant]) return;
    const existing = cart.find((item) => item.variant === variant);
    if (existing) existing.qty = clamp(existing.qty + qty, 1, 99);
    else cart.push({ variant, qty: clamp(qty, 1, 99) });
    saveCart();
    updateCartBadges();
    if ($("#page-cart").classList.contains("active")) renderCart();
    showToast(t("toast.added"));
  }

  function changeCartQty(variant, delta) {
    const item = cart.find((entry) => entry.variant === variant);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter((entry) => entry.variant !== variant);
    saveCart();
    updateCartBadges();
    renderCart();
  }

  function removeCartItem(variant) {
    cart = cart.filter((item) => item.variant !== variant);
    saveCart();
    updateCartBadges();
    renderCart();
    showToast(t("toast.removed"));
  }

  function cartItemMarkup(item) {
    const product = PRODUCTS[item.variant];
    const isGift = item.variant === "gift";
    return `
      <article class="cart-item">
        <div class="cart-item-image ${isGift ? "gift" : ""}">
          <img src="${product.images.front}" alt="${escapeHTML(itemName(item.variant))}">
        </div>
        <div class="cart-item-info">
          <span class="cart-item-tag">${escapeHTML(t(isGift ? "product.tagGift" : "product.tagClassic"))}</span>
          <h3>${escapeHTML(itemName(item.variant))}</h3>
          <small>5 kg · ${escapeHTML(t("product.name"))}</small>
          <span class="item-points">+${money(product.price * item.qty * 10)} ${escapeHTML(t("account.pointUnit"))}</span>
        </div>
        <div class="cart-item-actions">
          <strong>¥${money(product.price * item.qty)}</strong>
          <div class="qty-control">
            <button type="button" data-cart-minus="${item.variant}" aria-label="−">−</button>
            <span>${item.qty}</span>
            <button type="button" data-cart-plus="${item.variant}" aria-label="+">＋</button>
          </div>
          <button class="remove-item" type="button" data-cart-remove="${item.variant}">${currentLanguage === "zh" ? "移除" : currentLanguage === "ja" ? "削除" : currentLanguage === "ko" ? "삭제" : "Remove"}</button>
        </div>
      </article>`;
  }

  function renderCart() {
    const items = $("#cartItems");
    const empty = $("#cartEmpty");
    if (!items || !empty) return;
    items.innerHTML = cart.map(cartItemMarkup).join("");
    items.classList.toggle("hidden", cart.length === 0);
    empty.classList.toggle("hidden", cart.length > 0);

    const subtotal = cartSubtotal();
    const shipping = shippingFor(subtotal);
    $("#cartSubtotal").textContent = `¥${money(subtotal)}`;
    $("#cartShipping").textContent = shipping ? `¥${money(shipping)}` : "¥0";
    $("#cartPoints").textContent = money(subtotal * 10);
    $("#cartTotal").textContent = money(subtotal + shipping);
    $("#checkoutCartBtn").disabled = cart.length === 0;
    $("#checkoutCartBtn").style.opacity = cart.length === 0 ? ".45" : "1";
    $("#clearCartBtn").disabled = cart.length === 0;
  }

  /* ---------- Language ---------- */
  function applyLanguage(language, notify = false) {
    currentLanguage = I18N[language] ? language : "zh";
    localStorage.setItem(STORAGE.language, currentLanguage);
    document.documentElement.lang = localeMap[currentLanguage];
    document.title = t("meta.title");

    $$("[data-i18n]").forEach((element) => {
      const value = t(element.dataset.i18n);
      if (value !== element.dataset.i18n) element.innerHTML = value;
    });
    $$("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    $$("[data-i18n-alt]").forEach((element) => {
      element.alt = t(element.dataset.i18nAlt);
    });

    const shortLanguage = { zh: "简", en: "EN", ja: "日", ko: "한" };
    $("#currentLanguage").textContent = shortLanguage[currentLanguage];
    $$("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === currentLanguage));

    updateAccountUI();
    updateShowcase();
    updateCartBadges();
    renderCart();
    renderAuthMode($("#registerForm").classList.contains("hidden") ? "login" : "register");
    updatePackagingModal(packagingKind);
    updateCheckoutView();
    if (notify) showToast(t("toast.language"));
  }

  /* ---------- Auth UI ---------- */
  function maskPhone(phone) {
    return phone ? phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") : "";
  }

  function updateAccountUI() {
    const loggedIn = Boolean(currentUser);
    const label = loggedIn ? (currentUser.name.length > 5 ? `${currentUser.name.slice(0, 4)}…` : currentUser.name) : t("nav.login");
    $("#accountNavLabel").textContent = label;
    $("#accountNavLabel").removeAttribute("data-i18n");
    $("#accountGuest").classList.toggle("hidden", loggedIn);
    $("#accountDashboard").classList.toggle("active", loggedIn);
    if (!loggedIn) return;

    $("#memberName").textContent = currentUser.name;
    $("#memberAvatar").textContent = currentUser.name.slice(0, 1) || "明";
    $("#memberPhone").textContent = maskPhone(currentUser.phone);
    $("#memberPoints").textContent = money(currentUser.points);
    $("#memberOrderCount").textContent = currentUser.orders.length;
    renderOrders();

    if (!$("#shipName").value) $("#shipName").value = currentUser.name;
    if (!$("#shipPhone").value) $("#shipPhone").value = currentUser.phone;
  }

  function renderOrders() {
    const list = $("#ordersList");
    const empty = $("#ordersEmpty");
    if (!list || !empty) return;
    if (!currentUser?.orders.length) {
      list.innerHTML = "";
      list.classList.add("hidden");
      empty.classList.remove("hidden");
      return;
    }

    empty.classList.add("hidden");
    list.classList.remove("hidden");
    list.innerHTML = currentUser.orders.map((order) => {
      const count = order.items.reduce((total, item) => total + item.qty, 0);
      const names = order.items.map((item) => t(item.variant === "gift" ? "product.gift" : "product.classic")).join(" · ");
      const date = new Date(order.createdAt).toLocaleDateString(localeMap[currentLanguage], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      return `
        <article class="order-row">
          <div class="order-main">
            <span>${escapeHTML(order.id)} · ${escapeHTML(date)}</span>
            <strong>${escapeHTML(names || t("account.historyTitle"))}</strong>
            <small>${count} ${escapeHTML(t("account.itemsCount"))} · +${money(order.points)} ${escapeHTML(t("account.pointUnit"))}</small>
          </div>
          <span class="order-status">${escapeHTML(t("account.status"))}</span>
          <strong class="order-total">¥${money(order.total)}</strong>
        </article>`;
    }).join("");
  }

  function openAuth(tab = "login") {
    renderAuthMode(tab);
    openModal($("#authModal"));
    setTimeout(() => {
      const form = tab === "login" ? $("#loginForm") : $("#registerForm");
      form?.querySelector("input")?.focus();
    }, 180);
  }

  function renderAuthMode(mode) {
    const isLogin = mode !== "register";
    $$("[data-auth-tab]").forEach((button) => button.classList.toggle("active", button.dataset.authTab === (isLogin ? "login" : "register")));
    $("#loginForm").classList.toggle("hidden", !isLogin);
    $("#registerForm").classList.toggle("hidden", isLogin);
    $("#authTitle").textContent = t(isLogin ? "auth.loginTitle" : "auth.registerTitle");
    $("#authSubtitle").textContent = t(isLogin ? "auth.loginSubtitle" : "auth.registerSubtitle");
    $("#authTitle").removeAttribute("data-i18n");
    $("#authSubtitle").removeAttribute("data-i18n");
  }

  function completeLogin(user) {
    sessionPhone = user.phone;
    localStorage.setItem(STORAGE.session, sessionPhone);
    syncCurrentUser();
    updateAccountUI();
    closeModal($("#authModal"));
    showToast(t("toast.loginSuccess"));
    if (pendingCheckout) {
      const savedCheckout = { ...pendingCheckout };
      pendingCheckout = null;
      setTimeout(() => openCheckout(savedCheckout.items, savedCheckout.source), 240);
    }
  }

  function login(phone, password) {
    const normalizedPhone = digits(phone);
    const user = users.find((entry) => entry.phone === normalizedPhone && entry.password === password);
    if (!user) {
      showToast(t("toast.loginFailed"));
      return false;
    }
    completeLogin(user);
    return true;
  }

  /* ---------- Product 3D viewer ---------- */
  let currentVariant = "classic";
  let currentQty = 1;
  let viewAngle = -8;
  let viewTilt = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartAngle = 0;
  let dragStartTilt = 0;
  let activeView = "front";

  function updateShowcase() {
    const product = PRODUCTS[currentVariant];
    if (!product) return;
    $("#showcaseName").textContent = t("product.name");
    $("#showcaseDescription").textContent = t(product.descKey);
    $("#productTag").textContent = t(product.tagKey);
    $("#showcasePrice").textContent = product.price;
    $("#showcaseOldPrice").textContent = `¥${product.oldPrice}`;
    $("#showcasePoints").textContent = money(product.price * currentQty * 10);
    $("#showcaseQty").textContent = currentQty;
    $("#stageNumber").textContent = currentVariant === "gift" ? "02" : "01";
    $("#showcaseObject").classList.toggle("gift", currentVariant === "gift");

    const front = $("#showcaseFront");
    const back = $("#showcaseBack");
    const viewImage = activeView === "back" ? product.images.back : activeView === "side" ? product.images.side : product.images.front;
    front.src = viewImage;
    back.src = activeView === "side" ? product.images.side : product.images.back;
    front.alt = `${t("product.name")} ${t(activeView === "back" ? "product.back" : activeView === "side" ? "product.side" : "product.front")}`;
    back.alt = `${t("product.name")} ${t(activeView === "side" ? "product.side" : "product.back")}`;
    $$(".spec-card").forEach((button) => button.classList.toggle("active", button.dataset.variant === currentVariant));
    $$(".view-controls button").forEach((button) => button.classList.toggle("active", button.dataset.view === activeView));
    applyObjectTransform();
  }

  function applyObjectTransform() {
    const object = $("#showcaseObject");
    if (!object) return;
    object.style.transform = `rotateX(${viewTilt}deg) rotateY(${viewAngle}deg)`;
  }

  function setVariant(variant) {
    if (!PRODUCTS[variant]) return;
    currentVariant = variant;
    activeView = "front";
    viewAngle = -8;
    viewTilt = 0;
    updateShowcase();
  }

  function setView(view) {
    activeView = view;
    if (view === "front") { viewAngle = 0; viewTilt = 0; }
    if (view === "side") { viewAngle = 0; viewTilt = 0; }
    if (view === "back") { viewAngle = 180; viewTilt = 0; }
    updateShowcase();
  }

  function setupProductViewer() {
    const stage = $("#dragStage");
    if (!stage) return;

    stage.addEventListener("pointerdown", (event) => {
      dragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartAngle = viewAngle;
      dragStartTilt = viewTilt;
      stage.setPointerCapture(event.pointerId);
      $("#showcaseObject").style.transition = "none";
    });

    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;
      viewAngle = dragStartAngle + deltaX * 0.72;
      viewTilt = clamp(dragStartTilt - deltaY * 0.12, -14, 14);
      applyObjectTransform();
    });

    const stopDragging = () => {
      if (!dragging) return;
      dragging = false;
      $("#showcaseObject").style.transition = "";
      const normalized = ((viewAngle % 360) + 360) % 360;
      if (normalized > 45 && normalized < 135) {
        activeView = "side";
        viewAngle = 0;
        viewTilt = 0;
        updateShowcase();
      } else if (normalized >= 135) {
        activeView = "back";
        viewAngle = 180;
        viewTilt = 0;
        updateShowcase();
      } else {
        activeView = "front";
        viewAngle = 0;
        viewTilt = 0;
        updateShowcase();
      }
    };

    stage.addEventListener("pointerup", stopDragging);
    stage.addEventListener("pointercancel", stopDragging);
    stage.addEventListener("pointerleave", (event) => {
      if (event.buttons === 0) stopDragging();
    });
  }

  /* ---------- Checkout ---------- */
  let pendingCheckout = null;
  let currentCheckout = null;
  let selectedPayment = "wechat";
  let packagingKind = "bag";
  let lastCompletedOrder = null;

  function checkoutTotals(items) {
    const subtotal = items.reduce((total, item) => total + PRODUCTS[item.variant].price * item.qty, 0);
    const shipping = shippingFor(subtotal);
    return { subtotal, shipping, total: subtotal + shipping, points: Math.floor((subtotal + shipping) * 10) };
  }

  function openCheckout(items, source = "direct") {
    const safeItems = sanitizeCart(items);
    if (!safeItems.length) {
      showToast(t("toast.cartEmpty"));
      return;
    }
    if (!currentUser) {
      pendingCheckout = { items: safeItems, source };
      showToast(t("toast.loginRequired"));
      openAuth("login");
      return;
    }

    pendingCheckout = null;
    currentCheckout = { items: safeItems, source, totals: checkoutTotals(safeItems) };
    selectedPayment = "wechat";
    $$(".payment-method").forEach((button) => button.classList.toggle("active", button.dataset.payment === "wechat"));
    updateCheckoutView();

    if (!$("#shipName").value) $("#shipName").value = currentUser.name;
    if (!$("#shipPhone").value) $("#shipPhone").value = currentUser.phone;
    showCheckoutStep(1);
    openModal($("#checkoutModal"));
  }

  function updateCheckoutView() {
    if (!currentCheckout) return;
    const { items, totals } = currentCheckout;
    $("#checkoutItems").innerHTML = items.map((item) => `
      <div class="checkout-item-row">
        <img src="${PRODUCTS[item.variant].images.front}" alt="">
        <div>
          <strong>${escapeHTML(itemName(item.variant))}</strong>
          <small>5 kg × ${item.qty}</small>
        </div>
        <b>¥${money(PRODUCTS[item.variant].price * item.qty)}</b>
      </div>
    `).join("");
    $("#checkoutSubtotal").textContent = `¥${money(totals.subtotal)}`;
    $("#checkoutShipping").textContent = totals.shipping ? `¥${money(totals.shipping)}` : "¥0";
    $("#checkoutPoints").textContent = money(totals.points);
    $("#checkoutTotal").textContent = money(totals.total);
  }

  function showCheckoutStep(step) {
    $$(".checkout-view").forEach((view) => view.classList.remove("active"));
    if (step === 1) $("#checkoutViewOrder").classList.add("active");
    if (step === 2) $("#checkoutViewProcessing").classList.add("active");
    if (step === 3) $("#checkoutViewSuccess").classList.add("active");
    $$(".checkout-steps > span").forEach((span) => {
      const number = Number(span.dataset.step);
      span.classList.toggle("active", number === step);
      span.classList.toggle("complete", number < step);
    });
  }

  function validateShipping() {
    const fields = [$("#shipName"), $("#shipPhone"), $("#shipAddress")];
    if (fields.some((field) => !field.value.trim())) {
      showToast(t("toast.shippingMissing"));
      fields.find((field) => !field.value.trim())?.focus();
      return false;
    }
    if (!/^1\d{10}$/.test(digits($("#shipPhone").value))) {
      showToast(t("toast.orderOutside"));
      $("#shipPhone").focus();
      return false;
    }
    return true;
  }

  function completeOrder() {
    if (!currentCheckout || !currentUser) return;
    const order = {
      id: `QF${Date.now().toString().slice(-8)}`,
      items: currentCheckout.items.map((item) => ({ ...item })),
      subtotal: currentCheckout.totals.subtotal,
      shipping: currentCheckout.totals.shipping,
      total: currentCheckout.totals.total,
      points: currentCheckout.totals.points,
      status: "completed",
      createdAt: new Date().toISOString(),
      payment: selectedPayment,
      recipient: $("#shipName").value.trim(),
      phone: digits($("#shipPhone").value),
      address: $("#shipAddress").value.trim(),
      note: $("#shipNote").value.trim()
    };

    const user = users.find((entry) => entry.phone === sessionPhone);
    if (!user) return;
    user.points = Number(user.points || 0) + order.points;
    user.orders.unshift(order);
    saveUsers();
    syncCurrentUser();

    if (currentCheckout.source === "cart") {
      cart = [];
      saveCart();
      updateCartBadges();
      renderCart();
    }

    lastCompletedOrder = order;
    $("#successOrderNo").textContent = order.id;
    $("#successPoints").textContent = `+${money(order.points)}`;
    showCheckoutStep(3);
    updateAccountUI();
  }

  /* ---------- Modal helpers ---------- */
  function openModal(modal) {
    if (!modal) return;
    $$(".modal-backdrop.open").forEach((open) => {
      if (open !== modal) closeModal(open);
    });
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    const focusTarget = modal.querySelector("input, button");
    setTimeout(() => focusTarget?.focus({ preventScroll: true }), 80);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    if (!$(".modal-backdrop.open")) document.body.classList.remove("modal-open");
  }

  function showToast(message) {
    const region = $("#toastRegion");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    region.appendChild(toast);
    setTimeout(() => toast.classList.add("out"), 2600);
    setTimeout(() => toast.remove(), 2950);
  }

  function updatePackagingModal(kind) {
    packagingKind = kind === "gift" ? "gift" : "bag";
    const isGift = packagingKind === "gift";
    const source = isGift ? "assets/packaging/gift-tri-view.svg" : "assets/packaging/bag-tri-view.svg";
    $("#packagingModalImage").src = source;
    $("#packagingModalImage").alt = t("design.modalTitle");
    $("#packagingDownload").href = source;
    $("#packagingDownload").download = isGift ? "mingding-gift-tri-view.svg" : "mingding-bag-tri-view.svg";
    $$("[data-pack-tab]").forEach((button) => button.classList.toggle("active", button.dataset.packTab === packagingKind));
  }

  /* ---------- Routing ---------- */
  const validPages = new Set(["home", "products", "cart", "account", "about"]);

  function navigate(page, updateHash = true) {
    const target = validPages.has(page) ? page : "home";
    $$(".site-page").forEach((section) => section.classList.toggle("active", section.dataset.page === target));
    document.body.dataset.page = target;
    $$(".nav-link, .mobile-nav button[data-route]").forEach((button) => {
      button.classList.toggle("active", button.dataset.route === target);
    });
    $("#mobileNav").classList.remove("open");
    $("#mobileMenuButton").classList.remove("expanded");
    $("#mobileMenuButton").setAttribute("aria-expanded", "false");

    if (target === "cart") renderCart();
    if (target === "account") updateAccountUI();
    if (target === "products") applyProductFilter("all");
    if (updateHash) history.replaceState(null, "", target === "home" ? "#home" : `#${target}`);
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(revealVisibleElements, 80);
  }

  function revealVisibleElements() {
    $$(".site-page.active [data-reveal]").forEach((element, index) => {
      setTimeout(() => element.classList.add("revealed"), Math.min(index * 40, 260));
    });
  }

  function applyProductFilter(filter) {
    $$(".filter-btn").forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
    $$(".product-card").forEach((card) => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    document.addEventListener("click", (event) => {
      const routeButton = event.target.closest("[data-route]");
      if (routeButton) {
        event.preventDefault();
        navigate(routeButton.dataset.route);
        return;
      }

      const scrollButton = event.target.closest("[data-scroll-to]");
      if (scrollButton) {
        const target = document.getElementById(scrollButton.dataset.scrollTo);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const authButton = event.target.closest("[data-open-auth]");
      if (authButton) {
        openAuth(authButton.dataset.openAuth);
        return;
      }

      const authTab = event.target.closest("[data-auth-tab]");
      if (authTab) {
        renderAuthMode(authTab.dataset.authTab);
        return;
      }

      const closeButton = event.target.closest("[data-close-modal]");
      if (closeButton) {
        closeModal(closeButton.closest(".modal-backdrop"));
        return;
      }

      if (event.target.classList.contains("modal-backdrop")) {
        closeModal(event.target);
        return;
      }

      const variantButton = event.target.closest("[data-variant]");
      if (variantButton) {
        setVariant(variantButton.dataset.variant);
        return;
      }

      const viewButton = event.target.closest("[data-view]");
      if (viewButton) {
        setView(viewButton.dataset.view);
        return;
      }

      const quantityButton = event.target.closest("[data-qty]");
      if (quantityButton) {
        currentQty = clamp(currentQty + Number(quantityButton.dataset.qty), 1, 99);
        updateShowcase();
        return;
      }

      const buyVariantButton = event.target.closest("[data-buy-variant]");
      if (buyVariantButton) {
        openCheckout([{ variant: buyVariantButton.dataset.buyVariant, qty: 1 }], "direct");
        return;
      }

      const cartPlus = event.target.closest("[data-cart-plus]");
      if (cartPlus) {
        changeCartQty(cartPlus.dataset.cartPlus, 1);
        return;
      }

      const cartMinus = event.target.closest("[data-cart-minus]");
      if (cartMinus) {
        changeCartQty(cartMinus.dataset.cartMinus, -1);
        return;
      }

      const cartRemove = event.target.closest("[data-cart-remove]");
      if (cartRemove) {
        removeCartItem(cartRemove.dataset.cartRemove);
        return;
      }

      const filterButton = event.target.closest("[data-filter]");
      if (filterButton) {
        applyProductFilter(filterButton.dataset.filter);
        return;
      }

      const languageButton = event.target.closest("[data-lang]");
      if (languageButton) {
        applyLanguage(languageButton.dataset.lang, true);
        $(".language-wrap").classList.remove("open");
        return;
      }

      const paymentButton = event.target.closest("[data-payment]");
      if (paymentButton) {
        selectedPayment = paymentButton.dataset.payment;
        $$(".payment-method").forEach((button) => button.classList.toggle("active", button === paymentButton));
        return;
      }

      const packagingTab = event.target.closest("[data-pack-tab]");
      if (packagingTab) {
        updatePackagingModal(packagingTab.dataset.packTab);
      }
    });

    $("#languageButton").addEventListener("click", (event) => {
      event.stopPropagation();
      const wrapper = $(".language-wrap");
      const open = wrapper.classList.toggle("open");
      $("#languageButton").setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".language-wrap")) {
        $(".language-wrap").classList.remove("open");
        $("#languageButton").setAttribute("aria-expanded", "false");
      }
    });

    $("#accountButton").addEventListener("click", () => navigate("account"));
    $("#cartButton").addEventListener("click", () => navigate("cart"));
    $("#floatingCart").addEventListener("click", () => navigate("cart"));
    $("#addToCartBtn").addEventListener("click", () => addToCart(currentVariant, currentQty));
    $("#buyNowBtn").addEventListener("click", () => openCheckout([{ variant: currentVariant, qty: currentQty }], "direct"));
    $("#joinMemberBtn").addEventListener("click", () => currentUser ? navigate("account") : openAuth("register"));
    $("#continueShopping").addEventListener("click", () => navigate("products"));
    $("#accountBackHome").addEventListener("click", () => navigate("home"));
    $("#clearCartBtn").addEventListener("click", () => {
      if (!cart.length) return;
      cart = [];
      saveCart();
      updateCartBadges();
      renderCart();
      showToast(t("toast.cleared"));
    });
    $("#checkoutCartBtn").addEventListener("click", () => openCheckout(cart, "cart"));

    $("#mobileMenuButton").addEventListener("click", () => {
      const open = $("#mobileNav").classList.toggle("open");
      $("#mobileMenuButton").classList.toggle("expanded", open);
      $("#mobileMenuButton").setAttribute("aria-expanded", String(open));
    });

    $("#videoToggle").addEventListener("click", () => {
      const video = $("#heroVideo");
      if (video.paused) {
        video.play().catch(() => {});
        $("#hero").classList.remove("paused");
        showToast(t("toast.video"));
      } else {
        video.pause();
        $("#hero").classList.add("paused");
      }
    });

    $("#demoLoginBtn").addEventListener("click", () => {
      $("#loginForm [name=phone]").value = "13800138000";
      $("#loginForm [name=password]").value = "123456";
      login("13800138000", "123456");
    });

    $("#loginForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      login(formData.get("phone"), formData.get("password"));
    });

    $("#registerForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = String(formData.get("name") || "").trim();
      const phone = digits(formData.get("phone"));
      const password = String(formData.get("password") || "");
      if (!/^1\d{10}$/.test(phone)) {
        showToast(t("toast.invalidPhone"));
        return;
      }
      if (password.length < 6) {
        showToast(t("toast.shortPassword"));
        return;
      }
      if (users.some((user) => user.phone === phone)) {
        showToast(t("toast.duplicate"));
        return;
      }
      const user = {
        name: name || "明鼎米友",
        phone,
        password,
        points: 0,
        orders: [],
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveUsers();
      event.currentTarget.reset();
      showToast(t("toast.registerSuccess"));
      completeLogin(user);
    });

    $("#logoutBtn").addEventListener("click", () => {
      sessionPhone = "";
      currentUser = null;
      localStorage.removeItem(STORAGE.session);
      updateAccountUI();
      showToast(t("toast.logout"));
      navigate("account");
    });

    $("#refreshOrders").addEventListener("click", () => {
      syncCurrentUser();
      updateAccountUI();
      showToast(t("toast.refreshed"));
    });

    $("#payNowBtn").addEventListener("click", () => {
      if (!validateShipping()) return;
      showCheckoutStep(2);
      $("#payNowBtn").disabled = true;
      setTimeout(() => {
        completeOrder();
        $("#payNowBtn").disabled = false;
      }, 1450);
    });

    $("#viewOrderBtn").addEventListener("click", () => {
      closeModal($("#checkoutModal"));
      navigate("account");
    });

    const openPackaging = () => {
      updatePackagingModal(packagingKind);
      openModal($("#packagingModal"));
    };
    $("#openPackagingModal").addEventListener("click", () => {
      packagingKind = "bag";
      openPackaging();
    });
    $("#aboutPackagingButton").addEventListener("click", () => {
      packagingKind = "bag";
      openPackaging();
    });
    $("#footerPackagingBtn").addEventListener("click", () => {
      packagingKind = "bag";
      openPackaging();
    });

    $("#backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const open = $(".modal-backdrop.open");
        if (open) closeModal(open);
        else {
          $(".language-wrap").classList.remove("open");
          $("#mobileNav").classList.remove("open");
        }
      }
    });

    window.addEventListener("scroll", () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      $("#pageProgress").style.width = `${progress}%`;
      $("#siteHeader").classList.toggle("scrolled", window.scrollY > 28);
    }, { passive: true });

    window.addEventListener("hashchange", () => {
      navigate(location.hash.replace("#", "") || "home", false);
    });
  }

  /* ---------- Boot ---------- */
  function setupRevealObserver() {
    document.body.classList.add("reveal-ready");
    if (!("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach((element) => element.classList.add("revealed"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    $$("[data-reveal]").forEach((element) => observer.observe(element));
  }

  function init() {
    bindEvents();
    setupProductViewer();
    setupRevealObserver();
    applyLanguage(currentLanguage);
    updateCartBadges();
    renderCart();
    updateAccountUI();
    updatePackagingModal("bag");
    const initialPage = location.hash.replace("#", "");
    navigate(validPages.has(initialPage) ? initialPage : "home", false);

    const video = $("#heroVideo");
    video.play().catch(() => {
      $("#hero").classList.add("paused");
    });
    video.addEventListener("error", () => {
      video.style.display = "none";
    });
  }

  init();
})();
