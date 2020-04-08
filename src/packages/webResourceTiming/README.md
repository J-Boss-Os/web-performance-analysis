# web-resource-timing【实验版】

## 简介

`web-resource-timing`可以帮助你快速获取到用户在进入页面到浏览器获取的所有资源耗时和各种详细的数据信息，

并且支持订阅模式，实时获取资源加载的数据信息。



**特色**

- 非阻塞试

    不会阻塞你的代码执行

- 随时可以拿取数据

    只要使用获取函数，随时可以获取到开始到调用时之间的所有资源加载数据

- 支持订阅模式

    浏览器请求一次资源就会触发一次监听事件，实现实时监听，无需批量处理信息

- 配合报表`web-resource-timing-report`插件可以生成分析报表（**开发中**）

    可以实现生成本地报表，或者是获取报表信息上传到自己的服务器，进行分析



## 使用方法



**npm 安装**

```hell
npm i @web-performance/web-resource-timing

// or 

npm i @web-performance/web-resource-timing  --registry=https://registry.npm.taobao.org
```



**使用**



```js
import WebResourceTimingReport from '@web-performance/web-resource-timing'

// globalFixed 时间结果保留2位小数 ，globalGetType 返回数据结构是格式化后的数据结构

const  webResourceTimingReport = new WebResourceTimingReport({globalFixed : 2, globalGetType : 'FormatData'})
```



## 获取所有的资源下载数据(.getAllData)



该方法获取到的数据是未处理过的原始数据，返回类型是[`Array<PerformanceEntry>`](https://juejin.im/post/5e871853f265da47f25605fa#PerformanceResourceTimingInitiatorType),

文章里有一个`PerformanceResourceTiming`的属性对照表



```js
const data = webResourceTimingReport.getAllData();
```



## 实时监听资源获取数据



`.on('resource',callback)`通过订阅者，你可以实时监听浏览器的数据获取，及相关的信息，也是我们最常使用的API之一



***参数***

- eventName

  类型：`String`

  描述：监听的事件名称



- eventListener

  类型：`Function`

  描述：回调事件

  返回：

​    err

​      类型：`Error`

​      描述：错误提示

​    entry

​      类型：`EntryType | FormatData | OriginData`

​      描述：`EntryType` 对象(**ResourceTimingEntryType**)可以通过对象内置的方法获取到对应的数据，无需自己计算 ,

​      `FormatData` 格式化后的数据对象，无需处理即可使用,

​      `OriginData` 未经处理的原始数据对象。

​      注意：这个数据类型的返回源于：创建对象是传入的配置项内的`globalGetType`值决定的。



- opt

  类型：`Object`

  描述：配置参数，也可以用来传输给`eventListener`的附加参数



```js
// 添加事件监听

webResourceTimingReport.on('resource',(err,data)=>{

  if(err){
   	console.log(err)
  }else{
  	console.log(data)
  }

},{extraData:'额外数据'});



// 配合 immediateGetData 可以立刻获取到剩余的数据

webResourceTimingReport.immediateGetData();



// 移除事件监听
webResourceTimingReport.remove('resource');
```

## ResourceTimingEntryType

`Web-Resource-Timing`的核心对，也就是创建`new Web-Resource-Timing() `时传入的`globalGetType`参数的`EntryType`的值返回的对象。

支持独立使用：

```js
import {ResourceTimingEntryType} from '@web-performance/web-resource-timing'

window.onload=()=>{
	let resourceList = performance.getEntriesByType('resource');
  resourceList.map(entryType=>{
    const resourceTimingEntryType =  new ResourceTimingEntryType(entryType,{globalFixed:2});
    const data = resourceTimingEntryType.getFormatData();
  })
}

```



### 事件 Event

#### getDurationTime

描述：获取资源总耗时 = responseEnd - startTime

参数：

​		{ Number }	fixed	返回多少位小数的时间	 默认：2 

返回：Number

#### getName

描述：获取请求的名称会过滤返回，如果是`xmlhttprequest`类型的请求，那么会返回`path`路径，如果不是则返回文件名称（含类型）

参数：无

返回：String

#### getPath

描述：返回请求路径`?`前的路径

参数：无

返回：String

#### getType

描述：获取文件类型

参数：无

返回：String

#### getFetchTime

描述：资源的提取时间 = domainLookupStart - fetchStart

参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

返回：Number

#### getRedirectTime

描述：获取重定向时间 = redirectEnd - redirectStart
参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

返回：Number

#### getDomainLookupTime

描述：获取DNS解析时间 = domainLookupEnd - domainLookupStart

参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

返回：Number

#### getSecureConnectionTime

描述：获取SSL安全连接时间 = requestStart - secureConnectionStart

参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

返回：Number

#### getConnectionTime

描述：获取TCP连接时间（包含SSL连接时间）= connectEnd - connectStart

参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

返回：Number

#### getRequestTime

描述：获取请求时间（服务器处理时间/内部调用链时间）= responseStart - requestStart

参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

返回：Number

#### getResponseTime

描述：获取响应时间（下载时间）= responseEnd - responseStart

参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

返回：Number

#### getTransferSize

描述：获取传输的文件大小

参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

​		{ Boolean } 	isSplice	是否返回拼接好的数据

返回：

​		isSplice = true	retrun  { String }  10.01KB
​		isSplice = false   retrun  { Object }	{ size: 10.01, unit: "KB" }

#### getTransferSize

描述：获取解码前（压缩前）的文件大小

参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

​		{ Boolean } 	isSplice	是否返回拼接好的数据

返回：

​		isSplice = true	retrun  { String }  10.01KB
​		isSplice = false   retrun  { Object }	{ size: 10.01, unit: "KB" }

#### getCompressionSize

描述：获取解码后（解压后）的文件大小

参数：

​		{ Number } 	fixed	返回多少位小数的时间	 默认：2 

​		{ Boolean } 	isSplice	是否返回拼接好的数据

返回：

​		isSplice = true	retrun  { String }  10.01KB
​		isSplice = false   retrun  { Object }	{ size: 10.01, unit: "KB" }

#### getFormatData

描述：获取格式化后的数据，无需自己去计算各阶段的时间

参数：无

返回：Object\<FormatData\>

**FormatData**

| 属性             | 描述                                              |
| ---------------- | ------------------------------------------------- |
| redirect         | 重定向时间                                        |
| fetch            | 提取时间                                          |
| domainLookup     | CDN解析时间                                       |
| secureConnection | SSL安全连接时间                                   |
| connection       | TCP连接时间（包含SSL）                            |
| request          | 请求响应时间（服务器内部处理时间）                |
| response         | 响应时间（下载时间）                              |
| transferSize     | 传输文件大小，返回：{ size: 10.01, unit: "KB" }   |
| name             | 资源/接口名称                                     |
| url              | 完整的资源请求地址                                |
| path             | 接口请求的路径                                    |
| type             | file资源的类型（不包含：xmlhttprequest）          |
| initiatorType    | 发起请求的类型( **initiatorType** 后面有详细说明) |
| duration         | 持续时间（整个资源耗时）                          |
| nextHopProtocol  | 请求的协议                                        |
| query            | 请求参数                                          |

#### getOriginData

描述：获取没有处理过的源数据

参数：无

返回：Object\<PerformanceResourceTiming\>

**PerformanceResourceTiming**

| 属性                                                     | 描述                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| entryType                                                | EntryType的类型`resource`                                    |
| name                                                     | resources URL                                                |
| startTime                                                | 在资源提取开始的时间                                         |
| duration                                                 | 整个流程消耗的时间=`responseEnd`-`startTime`                 |
| [initiatorType](#PerformanceResourceTimingInitiatorType) | 发起资源请求的类型( **initiatorType** 后面有详细说明)        |
| nextHopProtocol                                          | 获取资源的网络协议的字符串                                   |
| workerStart                                              | 如果Service Worker线程已在运行,则在调用[`FetchEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/FetchEvent)之前立即返回[`DOMHighResTimeStamp`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)，如果尚未运行，则在启动Service Worker线程之前立即返回[`DOMHighResTimeStamp`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)。 如果资源未被Service Worker拦截，则该属性将始终返回0 |
| redirectStart                                            | 初始重定向的开始获取时间                                     |
| redirectEnd                                              | 紧接在收到最后一次重定向响应的最后一个字节后                 |
| fetchStart                                               | 拉取资源开始时间，紧接在浏览器开始获取资源之前               |
| domainLookupStart                                        | 紧接在浏览器启动资源的域名查找之前                           |
| domainLookupEnd                                          | 表示浏览器完成资源的域名查找后的时间                         |
| connectStart                                             | 开始TCP连接：紧接在浏览器检索资源，开始建立与服务器的连接之前 |
| connectEnd                                               | 结束TCP连接：紧接在浏览器完成与服务器的连接以检索资源之后    |
| secureConnectStart                                       | 开始SSL连接：紧接在浏览器启动握手过程之前，以保护当前连接    |
| requestStart                                             | 紧接在浏览器开始从服务器请求资源之前                         |
| responseStart                                            | 紧接在浏览器收到服务器响应的第一个字节后                     |
| responseEnd                                              | 紧接在浏览器收到资源的最后一个字节之后或紧接在传输连接关闭之前，以先到者为准 |
| secureConnectionStart                                    | SSL / 初始连接时间                                           |
| transferSize                                             | 表示获取资源的大小（以八位字节为单位）的`数字`。 包括响应头字段和响应payload body的大小。 |
| encodedBodySize                                          | 在删除任何应用的内容编码之前，从payload body的提取（HTTP或高速缓存）接收的大小（以八位字节为单位）的`number` |
| decodedBodySize                                          | 在删除任何应用的内容编码之后，从消息正文( message body )的提取（HTTP或缓存）接收的大小（以八位字节为单位）的`number` |
| serverTiming                                             | 包含服务器时序度量( timing metrics )的[`PerformanceServerTiming`](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceServerTiming) 条目数组，可用于服务器传数据到前端 |
|                                                          |                                                              |

**initiatorType**

已知可获取类型如下：

| 类型           | 描述                 |
| :------------- | -------------------- |
| css            | `css`资源类型        |
| img            | 图片请求类型         |
| scrpit         | `scrpit`脚本请求类型 |
| xmlhttprequest | 接口请求类型         |
| link           | `link`请求类型       |

> **PerformanceResourceTiming** ：中说的所有属性都可以直接通过`.属性名`的方式直接获取到对应的数据
>
> 除了上面说的原生的属性，还扩展了以下属性：
>
> - { String }	path	请求路径
> - { String }	url	完整的请求连接
> - { String }	query	请求的参数



更新时间：2020年4月8日

版本：**目前版本处于试验阶段，可能有不稳定的地方，请谨慎使用**



## 未来计划

### 事件Event

- 支持定时获取数据（减少性能消耗）
- 结合 `web-resource-timing-report` 插件生成资源分析报表（**开发中**）