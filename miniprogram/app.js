App({
    globalData: {
        isSinglePage: null, // 是否单页模式

        // 以上变量都不用动，以下变量是需要修改的

        // 云开发服务是否已下架
        // isRemoved: new Date() * 1 >= 1699401600000, // 自动党，用指定时间戳来控制自动下架
        isRemoved: true, // 手动党（为防止加载初始项目时因为没有云开发环境而报错，我先设为true，等搞好云开发环境后再把它改回false）

        // 魔法开关，开启后可使用完整功能，包括填写表单、祝福语轮播和视频号播放器等等
        // magic: new Date() * 1 >= 1699401600000, // 自动党，用指定时间戳来控制自动开启
        // magic: true, // 手动党（方便预览完整功能，我先设为true）
        // const target = new Date('2023-11-08 08:00:00');
        // const isOver = Date.now() >= target.getTime();
        // console.log(isOver);
        magic: Date.now() >= new Date('2026-09-22 19:00:00').getTime(),

        // 婚礼日期时间
        weddingTime: '2026-11-18 17:00:00',

        // 新郎新娘信息
        couple: [{
            image: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/husband-info.jpg', // 新郎单人照
            name: '蔡鑫', // 姓名
            alias: '新郎', // 称谓
            number: '13670401092', // 手机号码
            birthday: '1995.08.21' // 出生日期
        }, {
            image: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/wife-info.jpg', // 新娘单人照
            name: '何洁琼', // 姓名
            alias: '新娘', // 称谓
            number: '13169642658', // 手机号码
            birthday: '1994.07.08' // 出生日期
        }],

        // 发布者（自己想个你俩人的噱头组合名呗）
        publisher: '蔡鑫洁琼',

        // 纪念日（如果是一见钟情的话，建议用第一次见面那天）
        anniversary: '2024.01.07'
    },

    // 小程序启动时，初始化云开发环境
    onLaunch() {
        !this.globalData.isRemoved && wx.cloud.init({
            env: 'xxxxxxx', // 云开发环境ID，在云开发控制台里可以查看
            traceUser: true
        })
    },

    // 小程序可见时，判断是否为单页模式
    onShow() {
        if (typeof this.globalData.isSinglePage !== 'boolean') { // 没有判断过是否单页模式，则判断一下
            const {
                scene
            } = wx.getEnterOptionsSync()
            this.globalData.isSinglePage = scene === 1154
        }
    }
})