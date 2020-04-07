import WebResourceTiming from './ResourceTiming';

console.log(WebResourceTiming)

class WebPerformance {
  constructor({ }) {
    this.onEventListener = {
      error: [],
      resource: []
    }
  }
  /**
   * window 加载完成触发
   */
  windowLoad() {
    window.addEventListener('load', () => {

    })
  }
  /**
   * 添加时间监听
   * @param {*} eventName 
   * @param {*} eventListener 
   * @param {*} opt 
   */
  on(eventName, eventListener, opt) {

  }
  /**
   * 移除时间监听
   * @param {*} eventName 
   * @param {*} eventListener 
   */
  remove(eventName, eventListener) {

  }
}