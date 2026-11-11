const {
    genLocation
} = require('../../common/utils')

const {
    couple,
    publisher,
    isRemoved
} = getApp().globalData

Page({
    data: {
        // 新郎新娘联系方式
        couple,

        // 以上变量都不用动，以下变量是需要手动修改的

        arrangementImage: 'https://cdn.jsdmirror.com/gh/caix-github/wedding-pics/jqap.png',

        // 公告栏描述
        desc: `这里是酒店，接亲、婚宴等相关事宜，还有注意事项请大家仔细阅读，祝大家玩的开心！`,

        // 定位信息（可以去高德地图或腾讯地图网页版上把经纬度爬下来）
        location: genLocation([{
            name: '婚宴酒店：丽枫酒店（揭阳潮汕机场店）',
            address: '详细地址：广东省揭阳市榕城区大青溪石材市场西侧180米',
            latitude: 23.492850,
            longitude: 116.497312
        }]),

        // PDF资料（在云开发的「存储」里上传文件，就可以得到fileID了）
        files: [{
            name: '接亲时间表',
            fileID: 'cloud://cloudbase-d3gdptj5haed10ab8.636c-cloudbase-d3gdptj5haed10ab8-1490539777/接亲安排.png'
        }, {
            name: '宴席时间表',
            fileID: 'cloud://cloudbase-d3gdptj5haed10ab8.636c-cloudbase-d3gdptj5haed10ab8-1490539777/宴席时间表.txt'
        }],

        // 其它事项
        info: [
            `各位需要过夜的兄弟姐妹酒店已安排好，入住时报名字（${couple[1].name}）即可，酒店有停车场，可免费停车`,
            '新郎方的亲友团们尽量9点半前到，实在有事的话最晚10点到，兄弟们把控好时间哈，辛苦大家',
            '新娘方的亲友团们晚饭吃完后可以开始准备妆扮，尽量九点前准备好，摄影师会在酒店入场拍照',
            '最后的最后，文明接亲，欢乐接亲，希望大家多多配合，有什么需要，请联系帅气的新郎哥和美丽的新娘子，如有疏漏，请多多包涵'
        ]
    },

    // 呼叫
    call(e) {
        wx.makePhoneCall({
            phoneNumber: e.target.dataset.phone
        })
    },

    // 打开定位
    openLocation(e) {
        const location = this.data.location[e.target.dataset.index]
        wx.openLocation({
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.name,
            address: location.address
        })
    },

    // 预览接亲安排图片
    previewArrangement() {
        const image = this.data.arrangementImage
        wx.previewImage({
            current: image,
            urls: [image]
        })
    },

    // 下载并打开文件
    openFile(e) {
        if (isRemoved) {
            wx.showToast({
                title: '云开发下架咯~'
            })
        } else {
            wx.showLoading({
                title: '加载中'
            })
            const {
                fileID
            } = this.data.files[e.currentTarget.dataset.index]
            wx.cloud.downloadFile({
                fileID,
                success: res => {
                    wx.openDocument({
                        filePath: res.tempFilePath,
                        showMenu: true,
                        success: () => {
                            wx.hideLoading()
                        }
                    })
                }
            })
        }
    },

    // 分享到会话
    onShareAppMessage() {
        return {
            title: '婚礼公告栏',
            imageUrl: '../../images/infoPoster.jpg'
        }
    }
})