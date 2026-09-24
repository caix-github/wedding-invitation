const {
    genLocation
} = require('../../common/utils')

// 管理员openid列表，可以在云开发管理页找到，是管理员的话可以看到公告栏页面入口，也可以通过云函数greetings的返回值openid来查看，还可以在本文件getGreetings方法里通过打印openid变量来查看
const MANAGER = ['']

const APP = getApp()
const isRemoved = APP.globalData.isRemoved

Page({
    data: {
        ...APP.globalData,
        isManager: false, // 当前用户是否为管理员
        musicIsPaused: false, // 是否暂停背景音乐
        activeIdx: isRemoved ? 0 : -1, // 祝福语轮播用，当前显示的祝福语索引值
        form: { // 表单信息
            name: '',
            num: '',
            greeting: ''
        },
        weddingTimeStr: [], // 格式化的婚礼日期列表
        currentTemplate: APP.globalData.currentTemplate, // 当前模板

        // 五迷模板素材
        maydayImgs: {
            mascot: '../../images/mayday/mascot.png',
            announcement: '../../images/mayday/announcement.png',
            scene: '../../images/mayday/scene.png',
            calendarArt: '../../images/mayday/calendar-art.png',
            characters: '../../images/mayday/characters.png',
            couple: '../../images/mayday/couple.png',
            cats: '../../images/mayday/cats.png',
            network: '../../images/mayday/network.png',
            peachBride: '../../images/mayday/peach-bride.png',
            petLogo: '../../images/mayday/pet-logo.png'
        },

        // 以上变量都不用动，以下变量是需要手动修改的

        // 祝福语列表
        greetings: isRemoved ? [
            // 云开发下架后显示的祝福语数据，可以在云开发环境销毁前把数据库的数据导出来并贴到这里
            {
                name: '新郎 & 新娘',
                num: 2,
                greeting: '欢迎大家来见证我们的幸福时刻，我们婚礼上见哦~'
            }, {
                name: '伴郎 & 伴娘',
                num: 2,
                greeting: '祝帅气的新郎和美丽的新娘新婚快乐~白头偕老💐'
            }
        ] : [],

        // 背景音乐（默认用陈奕迅的《I DO》，想换的话自己去找音频资源，我是在「婚贝」上找的）
        music: {
            src: 'https://amp3.hunbei.com/mp3/IDo_ChenYiXun.mp3', // 音频资源链接
            name: 'I DO', // 歌名
            singer: '陈奕迅' // 歌手名
        },

        // 酒店信息（可以去高德地图或腾讯地图网页版上把经纬度爬下来）
        location: genLocation([{
            name: '婚宴酒店名XXXXXXXX',
            address: '详细地址XXXXXXXXXXXXXXX',
            latitude: 23.03387641906739,
            longitude: 113.7241439819336
        }])[0],

        // 图片信息（其实就是婚纱照了）
        imgs: {
            // 封面图
            // cover: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/cover.jpg',
            cover: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/cover.jpg',

            // 音乐封面
            poster: 'https://res.wx.qq.com/t/fed_upload/d811d254-e5d6-4c19-9ff8-77c4b6128137/poster.jpg',

            // 新郎独照
            husband: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/husband.jpg',

            // 新娘独照
            wife: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/wife.jpg',

            // 轮播图1
            swiper1: [
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper1-1.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper1-2.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper1-3.jpg'
            ],

            // 连续图
            series: [
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/series1.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/series2.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/series3.jpg'
            ],

            // 左上图
            leftUp: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/left-up.jpg',

            // 左下图
            leftDown: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/left-down.jpg',

            // 四宫图
            map: [
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/map1.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/map2.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/map3.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/map4.jpg'
            ],

            // 轮播图2
            swiper2: [
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper2-1.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper2-2.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper2-3.jpg'
            ],

            // 轮播图2下方常驻图
            swiper2Static: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper2-static.jpg',

            // 轮播图3
            swiper3: [
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper3-1.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper3-2.jpg',
                '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/swiper3-3.jpg'
            ],

            // 结尾图1
            end1: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/end1.jpg',

            // 结尾图2
            end2: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/end2.jpg'
        }
    },

    // 小程序加载时，拉取表单信息并填充，以及格式化各种婚礼时间
    onLoad() {
        this.timer = null
        this.music = null
        this.isSubmit = false

        // 同步导航栏标题
        if (this.data.currentTemplate === 'mayday') {
            wx.setNavigationBarTitle({ title: 'May I LOVE U' })
        }

        if (!isRemoved) {
            const db = wx.cloud.database()
            db.collection('surveys').get({
                success: res => {
                    if (res.data.length) {
                        const {
                            name,
                            num,
                            greeting
                        } = res.data[0]
                        this.setData({
                            form: {
                                name,
                                num,
                                greeting
                            }
                        })
                    }
                }
            })
        }

        this.lunisolarDate = this.selectComponent('#calendar') ? this.selectComponent('#calendar').lunisolarDate : null
        if (this.lunisolarDate) {
            this.setData({
                weddingTimeStr: [
                    this.lunisolarDate.format('YYYY-MM-DD HH:mm'),
                    this.lunisolarDate.getSeason(),
                    this.lunisolarDate.format('YYYY年MM月DD号  HH:mm'),
                    this.lunisolarDate.format('农历lMlD  dddd'),
                    this.lunisolarDate.format('YYYY年MM月DD号')
                ]
            })
        }
    },

    // 小程序卸载时，取消自动拉取祝福语定时器，销毁背景音乐
    onUnload() {
        if (this.timer !== null) {
            clearInterval(this.timer)
            this.timer = null
        }

        if (this.music !== null) {
            this.music.destroy()
            this.music = null
        }
    },

    // 小程序可见时，拉取祝福语，并设置定时器每20s重新拉取一次祝福语
    onShow() {
        if (!isRemoved) {
            this.getGreetings()

            this.timer === null && (this.timer = setInterval(() => this.getGreetings(), 20000));
        }
    },

    // 小程序不可见时，取消自动拉取祝福语定时器
    onHide() {
        if (this.timer !== null) {
            clearInterval(this.timer)
            this.timer = null
        }
    },

    // 小程序可用时，初始化背景音乐并自动播放
    onReady() {
        if (this.music === null) {
            this.music = wx.createInnerAudioContext({
                useWebAudioImplement: false
            })
            this.music.src = this.data.music.src
            this.music.loop = true
            this.music.autoplay = this.data.magic
        }
    },

    // 分享到会话
    onShareAppMessage() {
        return {
            title: '好久不见，婚礼见٩(๑^o^๑)۶',
            imageUrl: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/shareAppMsg.jpg'
        }
    },

    // 分享到朋友圈
    onShareTimeline() {
        return {
            title: '好久不见，婚礼见٩(๑^o^๑)۶',
            imageUrl: '//cdn.jsdmirror.com/gh/caix-github/wedding-pics/shareTimeline.jpg'
        }
    },

    // 点击右上角音乐按钮控制音频播放和暂停
    toggleMusic() {
        if (this.music.paused) {
            this.music.play()
            this.setData({
                musicIsPaused: false
            })
        } else {
            this.music.pause()
            this.setData({
                musicIsPaused: true
            })
        }
    },

    // 打开酒店定位
    openLocation() {
        const {
            latitude,
            longitude,
            name,
            address
        } = this.data.location
        wx.openLocation({
            latitude,
            longitude,
            name,
            address
        })
    },

    // 呼叫
    call(e) {
        wx.makePhoneCall({
            phoneNumber: e.target.dataset.phone
        })
    },

    // 提交表单
    submit(e) {
        if (!this.isSubmit) {
            const {
                name,
                num
            } = e.detail.value
            if (name === '') {
                wx.showToast({
                    title: '要写上名字哦~',
                    icon: 'error'
                })
            } else if (num === '') {
                wx.showToast({
                    title: '要写上人数哦~',
                    icon: 'error'
                })
            } else if (!/^[1-9]\d*$/.test(num)) {
                wx.showToast({
                    title: '人数不对哦~',
                    icon: 'error'
                })
            } else {
                if (isRemoved) {
                    wx.showToast({
                        title: '婚礼结束了哦~'
                    })
                } else {
                    this.isSubmit = true
                    const wording = this.data.form.name ? '更新' : '提交';
                    wx.showLoading({
                        title: `${wording}中`
                    })
                    wx.cloud.callFunction({
                        name: 'surveys',
                        data: e.detail.value
                    }).then(({
                        result: {
                            name,
                            num,
                            greeting,
                            _id
                        }
                    }) => {
                        const greetings = this.data.greetings
                        !greetings.some(item => {
                            if (item._id === _id) { // 如果找到了该祝福语，更新之
                                item.greeting = greeting
                                return true
                            }
                            return false
                        }) && greetings.push({ // 如果没有找到，追加之
                            name,
                            greeting,
                            _id
                        })
                        this.setData({
                            form: {
                                name,
                                num,
                                greeting
                            },
                            greetings
                        })
                        this.isSubmit = false
                        wx.showToast({
                            title: `${wording}成功`,
                            icon: 'success'
                        })
                    })
                }
            }
        }
    },

    // 获取祝福语
    getGreetings() {
        wx.cloud.callFunction({
            name: 'greetings'
        }).then(({
            result: {
                greetings,
                openid
            }
        }) => {
            const isManager = MANAGER.indexOf(openid) > -1
            greetings.length && this.setData(this.data.activeIdx === -1 ? {
                isManager,
                greetings,
                activeIdx: 0
            } : {
                isManager,
                greetings
            })
        })
    },

    // 轮播动画结束时切换到下一个
    onAnimationend() {
        this.setData({
            activeIdx: (this.data.activeIdx === this.data.greetings.length - 1) ? 0 : (this.data.activeIdx + 1)
        })
    },

    // 跳转到联系新郎新娘板块
    goPhone() {
        wx.pageScrollTo({
            selector: '.phone',
            offsetTop: -200
        })
    },

    // 跳转到写表单板块
    goWrite() {
        wx.pageScrollTo({
            selector: '.form',
            offsetTop: -200
        })
    },

    // 跳转到公告栏页面
    goInfo() {
        wx.navigateTo({
            url: '../info/index'
        })
    },

    // 切换模板
    switchTemplate() {
        const next = this.data.currentTemplate === 'classic' ? 'mayday' : 'classic'
        APP.setTemplate(next)
        this.setData({ currentTemplate: next })

        // 更新导航栏标题
        wx.setNavigationBarTitle({
            title: next === 'mayday' ? 'May I LOVE U' : '许久未见·甚是想念'
        })

        wx.showToast({
            title: next === 'mayday' ? '五迷模式' : '经典模式',
            icon: 'none'
        })
    }
})