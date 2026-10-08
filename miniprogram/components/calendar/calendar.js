const lunisolar = require('../../common/lunisolar')
const {
    addZero,
    getMonthDayCount
} = require('../../common/utils')

Component({
	properties: {
        date: {
            type: String,
            value: ''
        }
    },

    data: {
        list: [],
        year: '',
        month: '',
        day: '',
        dayNumber: '',
        weddingClock: '',
        countdownUnits: [],
        countdownFlip: false
    },
    
    lifetimes: {
        created() {
            this.lunisolarDate = null
            this.countdownTimer = null
            this.countdownSettleTimer = null
        },

        attached() {
            if (this.data.date !== '') {
                this.lunisolarDate = lunisolar(this.data.date)
                const {
                    year,
                    month,
                    day,
                    dayOfWeek
                } = this.lunisolarDate

                // 生成日历表
                // 先计算出当月1号是星期几
                let beginDayOfWeek = day === 1 ? dayOfWeek : ((dayOfWeek - day + 1) % 7)
                beginDayOfWeek < 0 && (beginDayOfWeek += 7)

                // 生成首周
                const list = []
                let curDay = 1
                const firstWeek = (new Array(beginDayOfWeek)).fill('')
                for (let i = beginDayOfWeek; i < 7; i++) firstWeek.push(curDay++)
                list.push(firstWeek)

                // 继续生成后面的日历数据
                let otherWeek = []
                for (let end = getMonthDayCount(year, month); curDay <= end; curDay++) {
                    if (otherWeek.length === 7) {
                        list.push(otherWeek)
                        otherWeek = []
                    }
                    otherWeek.push(curDay)
                }
                list.push(otherWeek)

                this.setData({
                    list,
                    year,
                    month: addZero(month),
                    day: addZero(day),
                    dayNumber: day,
                    weddingClock: (/[ T](\d{1,2}:\d{2})/.exec(this.data.date) || [])[1] || ''
                })

                const weddingTime = new Date(this.data.date.replace(/-/g, '/')).getTime()
                if (Number.isNaN(weddingTime)) {
                    console.error('Invalid wedding date; countdown is unavailable.')
                    return
                }

                this.updateCountdown(weddingTime)
                if (weddingTime > Date.now()) {
                    this.countdownTimer = setInterval(() => this.updateCountdown(weddingTime), 1000)
                }
            }
        },

        detached() {
            if (this.countdownTimer !== null) {
                clearInterval(this.countdownTimer)
                this.countdownTimer = null
            }
            if (this.countdownSettleTimer !== null) {
                clearTimeout(this.countdownSettleTimer)
                this.countdownSettleTimer = null
            }
        }
    },

    methods: {
        updateCountdown(weddingTime) {
            const remaining = Math.max(weddingTime - Date.now(), 0)
            const days = Math.floor(remaining / 86400000)
            const hours = Math.floor(remaining % 86400000 / 3600000)
            const minutes = Math.floor(remaining % 3600000 / 60000)
            const seconds = Math.floor(remaining % 60000 / 1000)
            const pad = value => value < 10 ? `0${value}` : `${value}`
            const previousUnits = this.data.countdownUnits
            const values = [pad(days), pad(hours), pad(minutes), pad(seconds)]
            const labels = ['days', 'hours', 'minutes', 'seconds']
            const countdownUnits = values.map((value, unitIndex) => {
                const previousUnit = previousUnits[unitIndex]
                let previousValue = previousUnit
                    ? previousUnit.digits.map(digit => digit.value).join('')
                    : value
                const width = Math.max(value.length, previousValue.length)

                while (value.length < width) value = `0${value}`
                while (previousValue.length < width) previousValue = `0${previousValue}`

                return {
                    label: labels[unitIndex],
                    digits: value.split('').map((digit, digitIndex) => ({
                        key: `${labels[unitIndex]}-${digitIndex}`,
                        value: digit,
                        previous: previousValue[digitIndex],
                        changed: Boolean(previousUnit) && digit !== previousValue[digitIndex]
                    }))
                }
            })

            this.setData({
                countdownUnits
            })

            if (this.countdownSettleTimer !== null) {
                clearTimeout(this.countdownSettleTimer)
            }
            this.countdownSettleTimer = setTimeout(() => {
                const settledUnits = this.data.countdownUnits.map(unit => ({
                    ...unit,
                    digits: unit.digits.map(digit => ({
                        ...digit,
                        previous: digit.value,
                        changed: false
                    }))
                }))
                this.setData({ countdownUnits: settledUnits })
                this.countdownSettleTimer = null
            }, 650)

            if (remaining === 0 && this.countdownTimer !== null) {
                clearInterval(this.countdownTimer)
                this.countdownTimer = null
            }
        }
    }
})
