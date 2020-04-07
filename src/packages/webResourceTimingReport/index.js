import { WebResourceTiming } from '../webResourceTiming'
import { request } from 'express'
console.log(WebResourceTiming)

export default class WebResourceTimingReport {
  /**
   * 
   * @param {*} param0 
   * @param {object} param0.networkQuality 网络质量
   */
  constructor({ webNetworkQuality, rankRatio = null, serverInfo = null } = {}) {
    this.rankRatio = {
      ...rankRatio
    }
    this.serverInfo = {
      bandwidth: 1, // 带宽
      ...serverInfo
    }
    this.webNetworkQuality = webNetworkQuality
  }

  /**
   * 渲染时段报表
   */
  renderReport({ period = 'all' } = {}) {

  }

  /**
   * 获取时段报表数据
   * @param {*} param0 
   */
  getReportData({ }) {

  }
}

/**
 * 性能划分
 */
export class PerformanceSort {
  /**
   * 
   * @param {*} param0 
   */
  constructor({ rules, } = {}) {
    let initData = {
      DNS: [30, 60, 120],
      SSL: [100, 150, 200],
      TCP: [100, 150, 200]
      request: [100, 200, 300],
      response: [100, 200, 300]
    }
    this.rules = {
      "xmlhttprequest": {

      },
      "link": () => {

      },
      "script": () => {

      },
      "img": () => {

      },
      "css": () => {

      },
    }
  }

  /**
   * 计算属性
   */
  computePerformance({ }) {
  }
}

