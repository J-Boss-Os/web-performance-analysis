export default class WebResourceTiming {
  /**
   * 构建
   * @param {*} param0 
   * @param {String} param0.globalGetType 获取条目的类型  EntryType => ResourceTimingEntryTyped对象类型 ; FormatData => 格式化后的类型 ; OriginData => 没有处理过的源数据
   */
  constructor({ globalFixed = 2, globalGetType = 'EntryType' } = {}) {
    this.onEventListener = {
      error: null,
      resource: null
    }
    this.globalFixed = globalFixed
    this.globalGetType = globalGetType
  }

  /**
   * 获取所有的数据
   */
  getAllData() {
    return performance.getEntriesByType('resource');
  }

  /**
   * 创建监听者
   */
  createObserver() {
    const observer = new PerformanceObserver((list, obj) => {
      const entries = list.getEntries();
      this.waitPublish.push.apply(this.waitPublish, entries);
      if (!this.continuedPublish) this.immediateGetData()
    });
    observer.observe({ entryTypes: ["resource"] });
  }

  /**
   * 立刻获取数据
   */
  immediateGetData({ getType = null } = {}) {
    this.continuedPublish = true
    const { globalFixed, globalGetType } = this
    while (this.waitPublish.length) {
      this.trigger('resource', (err, { cb, opt }) => {
        let origin = this.waitPublish.shift()
        let type = (opt && opt.getType) || getType || globalGetType || 'EntryType'
        if (type === 'OriginData') {
          return cb(err, origin, opt)
        }
        const entry = new ResourceTimingEntryType(origin, { globalFixed })
        if (type === 'FormatData') {
          cb(err, entry.getFormatData(), opt)
        }
        else cb(err, entry, opt)
      })
    }
    this.continuedPublish = false
  }

  /**
   * 开始循环获取数据
   */
  startIntervalGetData({ time = 10000 } = {}) {
    this.stopIntervalGetData()
    this.intervalGetDataWorker = setInterval(() => {
      this.immediateGetData();
    }, time)
  }

  /**
   * 停止循环获取数据
   */
  stopIntervalGetData() {
    let intervalGetDataWorker = this.intervalGetDataWorker
    if (intervalGetDataWorker) clearInterval(intervalGetDataWorker)
  }

  /**
   * 触发事件
   */
  trigger(eventName, eventListener, opt) {
    const eventList = this.onEventListener[eventName] || []
    if (!eventList || !eventList.length) return eventListener(new Error(`没有找到【${eventName}】的事件监者`), null)
    eventList.map((event) => {
      eventListener(null, event, opt)
    })
  }
  /**
   * 添加事件监听
   */
  on(eventName, eventListener, opt) {
    if (!this.onEventListener[eventName]) {
      this.onEventListener[eventName] = [{ cb: eventListener, opt }]
      this.waitPublish = this.getAllData() || [];
      this.immediateGetData();
      this.createObserver();
    }
    else this.onEventListener[eventName].push({ cb: eventListener, opt })
    return this;
  }
  /**
   * 移除事件监听
   */
  remove(eventName, eventListener, opt) {
    return this;
  }
  /**
   * 处理忽略
   */
  ignore() {
    return this;
  }
}
/**
 * 资源处理
 */
export class ResourceTimingEntryType {
  constructor(entryType, { globalFixed = 2 } = {}) {
    for (let key in entryType) {
      this[key] = entryType[key]
    }
    this.url = this.name
    const urlSplit = this.url.split('?');
    this.path = urlSplit[0]
    this.query = urlSplit[1]
    this.globalFixed = globalFixed
  }
  /**
   * 计算数字的小数位数
   * @param {*} number 
   */
  countDecimal(number) {
    const decimalString = `${number}`.split('.')[0] || ''
    return decimalString.length
  }
  /**
   * 数字精确计算
   * @param {*} a // 第一个数
   * @param {*} b // 第二个数
   * @param {*} type // 1 加 2 减 3 除 4 乘
   */
  count(a, b, { type = 1, fixed = null } = {}) {
    a = a || 0
    b = b || 0
    let result = 0
    let maxDecimal = Math.max(this.countDecimal(a), this.countDecimal(b))
    maxDecimal = !maxDecimal ? 1 : maxDecimal * 10
    switch (type) {
      case 1:
        result = ((a * maxDecimal) - (b * maxDecimal)) / maxDecimal
        break;
      case 2:
        result = ((a * maxDecimal) + (b * maxDecimal)) / maxDecimal
        break;
      case 3:
        result = ((a * maxDecimal) * (b * maxDecimal)) / maxDecimal
        break;
      case 4:
        result = ((a * maxDecimal) / (b * maxDecimal)) / maxDecimal
        break;
    }
    return this.formatNumberDecimal(result, { fixed })
  }

  /**
   * 格式化数字的小数
   */
  formatNumberDecimal(number = 0, { fixed = null } = {}) {
    if (Math.round(number) === number) return number
    return Number(number.toFixed(fixed || this.globalFixed))
  }
  /**
   * 格式化大小
   * @param {*} unit 单位：B KB MB GB  不传自动选择合适的显示
   */
  formatFileSize(size, { unit = null, isSplice = null, fixed = null } = {}) {
    if (size >= 1073741824 || unit === 'GB') {
      size = this.count(size, 1073741824, { type: 4, fixed })
      unit = 'GB'
    } else if (size >= 1048576 || unit === 'MB') {
      size = this.count(size, 1048576, { type: 4, fixed })
      unit = 'MB'
    } else if (size >= 1024 || unit === 'KB') {
      size = this.count(size, 1024, { type: 4, fixed })
      unit = 'KB'
    } else {
      unit = 'B'
    }
    if (isSplice) return `${size} ${unit}`
    return {
      size,
      unit
    }
  }
  /**
   * 获取总耗时
   */
  getDurationTime({ fixed = null } = {}) {
    return this.formatNumberDecimal(this.duration, { fixed })
  }
  /**
   * 获取名称
   * @param {*} param0
   */
  getName() {
    if (this.initiatorType === 'xmlhttprequest') {
      return this.path
    } else {
      return this.path.replace(/(^.*\/)(.*$)/, '$2')
    }
  }
  /**
   * 获取类型
   */
  getType() {
    if (this.initiatorType !== 'xmlhttprequest') {
      return this.path.replace(/(^.*)(\..*$)/, '$2')
    } else {
      return 'xmlhttprequest'
    }
  }
  /**
   * 获取提取时间
   */
  getFetchTime({ fixed = null } = {}) {
    return this.count(this.domainLookupStart, this.fetchStart, { fixed })
  }
  /**
   * 获取重定向时间
   */
  getRedirectTime({ fixed = null } = {}) {
    return this.count(this.redirectEnd, this.redirectStart, { fixed })
  }
  /**
   * 获取DNS解析时间
   */
  getDomainLookupTime({ fixed = null } = {}) {
    return this.count(this.domainLookupEnd, this.domainLookupStart, { fixed })
  }
  /**
   * 获取SSL连接时间
   */
  getSecureConnectionTime({ fixed = null } = {}) {
    return this.count(this.connectEnd, this.secureConnectionStart, { fixed })
  }
  /**
   * 获取TCP连接时间
   */
  getConnectionTime({ fixed = null } = {}) {
    return this.count(this.connectEnd, this.connectStart, { fixed })
  }
  /**
   * 请求时间
   */
  getRequestTime({ fixed = null } = {}) {
    return this.count(this.responseStart, this.requestStart, { fixed })
  }
  /**
   * 响应时间
   * @param {*} param0 
   */
  getResponseTime({ fixed = null, fixed = null } = {}) {
    return this.count(this.responseEnd, this.responseStart, { fixed })
  }
  /**
   * 获取传输的文件大小
   */
  getTransferSize({ isSplice = null, fixed = null } = {}) {
    return this.formatFileSize(this.transferSize, { isSplice, fixed })
  }
  /**
   * 获取压缩大小
   * @param {*} param0 
   */
  getCompressionSize({ isSplice = null, fixed = null } = {}) {
    return this.formatFileSize(this.count(this.decodedBodySize, encodedBodySize), { isSplice, fixed })
  }
  /**
   * 获取源数据
   */
  getOriginData() {
    return this
  }
  /**
   * 获取格式化后的数据
   */
  getFormatData() {
    return {
      redirect: this.getRedirectTime(),
      fetch: this.getFetchTime(),
      domainLookup: this.getDomainLookupTime(),
      secureConnection: this.getSecureConnectionTime(),
      connection: this.getConnectionTime(),
      request: this.getRequestTime(),
      response: this.getResponseTime(),
      transferSize: this.getTransferSize(),
      name: this.getName(),
      url: this.url,
      query: this.query,
      path: this.path,
      type: this.getType(),
      initiatorType: this.initiatorType,
      duration: this.getDurationTime(),
      nextHopProtocol: this.nextHopProtocol
    }
  }
}