define(["jquery","windows/windows","websockets/binary_websockets","portfolio/portfolio","charts/chartingRequestMap","common/rivetsExtra","moment","lodash","jquery-growl","common/util"],function(a,b,c,d,e,f,g,h){"use strict";function i(a,b){var c=[],d="";if(b.history){d="line";for(var e=b.history,f=e.times,g=e.prices,i=0;i<f.length;++i)c.push([1e3*f[i],1*g[i]])}b.candles&&(d="candlestick",c=b.candles.map(function(a){return[1e3*a.epoch,1*a.open,1*a.high,1*a.low,1*a.close]}));var j=b.title,k=a.find(".transaction-chart")[0],b={credits:{href:"https://www.binary.com",text:"Binary.com"},chart:{type:"line",renderTo:k,backgroundColor:null,width:0,height:0,marginLeft:20,marginRight:20,events:{load:function(){this.credits.element.onclick=function(){window.open("https://www.binary.com","_blank")}}}},title:{text:j,style:{fontSize:"16px"}},tooltip:{xDateFormat:"%A, %b %e, %H:%M:%S GMT"},xAxis:{type:"datetime",categories:null,startOnTick:!1,endOnTick:!1,min:c.length?h.first(c)[0]:null,max:c.length?h.last(c)[0]:null,labels:{overflow:"justify",format:"{value:%H:%M:%S}"}},yAxis:{labels:{align:"left",x:0,y:-2},title:""},series:[{name:j,data:c,type:d}],exporting:{enabled:!1,enableImages:!1},legend:{enabled:!1},navigator:{enabled:!0},plotOptions:{line:{marker:{radius:2}},candlestick:{lineColor:"black",color:"red",upColor:"green",upLineColor:"black",shadow:!0}},rangeSelector:{enabled:!1}},l=new Highcharts.Chart(b);return l.addPlotLineX=function(a){l.xAxis[0].addPlotLine({value:a.value,id:a.id||a.value,label:{text:a.label||"label",x:a.text_left?-15:5},color:a.color||"#e98024",zIndex:4,width:a.width||2})},l.addPlotLineY=function(a){l.yAxis[0].addPlotLine({id:a.id||a.label,value:a.value,label:{text:a.label,align:"center"},color:a.color||"green",zIndex:4,width:2})},k.chart=l}function j(a,b){return c.send({ticks_history:a,granularity:0,style:"ticks",start:b,end:b+2,count:1})["catch"](function(a){})}function k(b,d){return new Promise(function(e,f){return r[d]?(r[d].moveToTop(),void e()):void c.send({proposal_open_contract:1,contract_id:b}).then(function(a){var b=a.proposal_open_contract;b.transaction_id=d,b.symbol=b.underlying,m(b),e()})["catch"](function(b){a.growl.error({message:b.message}),f()})})}function l(a,b){{var c=a.proposal_open_contract,d=c.contract_id;c.bid_price}d===b.contract_id&&(c.validation_error?b.validation=c.validation_error:c.is_expired?b.validation="This contract has expired":c.is_valid_to_sell&&(b.validation="Note: Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price."),1*b.table.date_expiry>=1*c.current_spot_time?(b.table.current_spot=c.current_spot,b.table.current_spot_time=c.current_spot_time,b.table.bid_price=c.bid_price,b.sell.bid_prices.length>40&&b.sell.bid_prices.shift(),b.sell.bid_prices.push(c.bid_price),b.sell.bid_price.value=c.bid_price,b.sell.bid_price.unit=c.bid_price.split(/[\.,]+/)[0],b.sell.bid_price.cent=c.bid_price.split(/[\.,]+/)[1],b.sell.is_valid_to_sell=!1,b.sell.is_valid_to_sell=c.is_valid_to_sell,b.chart.manual_reflow()):b.table.current_spot_time=b.table.date_expiry,c.sell_price&&(b.table.sell_spot=c.sell_spot,b.table.sell_time=c.sell_time,b.table.sell_price=c.sell_price,b.table.final_price=formatPrice(c.sell_price)))}function m(e){require(["text!viewtransaction/viewTransaction.html"],function(g){var h=a(g),i=o(e,h),j=function(a){l(a,i)},k=b.createBlankWindow(h,{title:e.display_name+" ("+e.transaction_id+")",width:700,minWidth:490,minHeight:370,destroy:function(){},close:function(){m&&m.unbind(),d.proposal_open_contract.forget(),c.events.off("proposal_open_contract",j);for(var b=0;b<i.onclose.length;++b)i.onclose[b]();a(this).dialog("destroy").remove(),r[e.transaction_id]=void 0},open:function(){d.proposal_open_contract.subscribe(),c.events.on("proposal_open_contract",j)},resize:function(){i.chart.manual_reflow()},"data-authorized":"true"});k.dialog("open");var m=f.bind(h[0],i);r[e.transaction_id]=k})}function n(b,d){b.sell.sell_at_market_enabled=!1,require(["text!viewtransaction/viewTransactionConfirm.html","css!viewtransaction/viewTransactionConfirm.css"]),c.send({sell:b.contract_id,price:0}).then(function(c){var e=c.sell;require(["text!viewtransaction/viewTransactionConfirm.html","css!viewtransaction/viewTransactionConfirm.css"],function(c){var g=b.table.buy_price,h={longcode:b.longcode,buy_price:g,sell_price:e.sold_for,return_percent:(100*(e.sold_for-g)/g).toFixed(2)+"%",transaction_id:e.transaction_id,balance:e.balance_after,currency:b.table.currency},i=a(c);d.after(i);var j=f.bind(i[0],h);b.onclose.push(function(){j&&j.unbind()})})})["catch"](function(b){a.growl.error({message:b.message})})}function o(a,b){var d={route:{value:"table",update:function(a){d.route.value=a}},contract_id:a.contract_id,longcode:a.longcode,validation:a.validation_error||!a.is_valid_to_sell&&"Resale of this contract is not offered"||a.is_expired&&"This contract has expired"||"-",table:{is_expired:a.is_expired,currency:(a.currency||"USD")+" ",current_spot_time:void 0,current_spot:void 0,date_start:a.date_start,date_expiry:a.date_expiry,entry_tick:a.entry_tick||a.entry_spot,entry_tick_time:a.entry_tick_time,exit_tick:a.exit_tick,exit_tick_time:a.exit_tick_time,buy_price:a.buy_price&&formatPrice(a.buy_price),bid_price:void 0,final_price:a.is_sold?a.sell_price&&formatPrice(a.sell_price):void 0,tick_count:a.tick_count,prediction:a.prediction,sell_time:1*a.sell_spot_time||void 0,sell_spot:a.sell_spot,sell_price:a.is_sold?a.sell_price:void 0,purchase_time:a.purchase_time,is_sold_at_market:!1},chart:{chart:null,symbol:a.symbol,display_name:a.display_name,barrier:a.barrier,high_barrier:a.high_barrier,low_barrier:a.low_barrier,loading:"Loading "+a.display_name+" ...",type:"ticks"},sell:{bid_prices:[],bid_price:{unit:void 0,cent:void 0,value:void 0},sell_at_market_enabled:!0,is_valid_to_sell:!1},onclose:[]};return d.sell.sell=function(){n(d,b)},d.chart.manual_reflow=function(){var a=-1*(b.find(".longcode").height()+b.find(".tabs").height()+b.find(".footer").height())-16;if(d.chart.chart){var c=b,e=(c.find(".transaction-chart"),c.width()-10),f=c.height();d.chart.chart.setSize(e,f+a,!1),d.chart.chart.hasUserSize=null,d.chart.chart.series[0]&&0===d.chart.chart.series[0].data.length?d.chart.chart.showLoading():d.chart.chart.hideLoading()}},q(d,b).then(function(){d.table.sell_time&&d.chart.chart.addPlotLineX({value:1e3*d.table.sell_time,label:"Sell Time"})}),c.events.on_till("transaction",function(a){var b=a.transaction;return"sell"===b.action&&b.contract_id==d.contract_id?(c.send({proposal_open_contract:1,contract_id:d.contract_id}).then(function(a){l(a,d)})["catch"](function(a){}),!0):void 0}),d}function p(b,d){var f=e.keyFor(b.chart.symbol,d);if(e[f])e.subscribe(f);else{var g={symbol:b.chart.symbol,subscribe:1,granularity:d,style:0===d?"ticks":"candles"};e.register(g)["catch"](function(b){a.growl.error({message:b.message})})}var h=void 0,i=void 0;if(0===d){var j=null;h=c.events.on("tick",function(a){if(a.tick&&a.tick.symbol===b.chart.symbol){var c=b.chart.chart,d=a.tick;c&&c.series[0].addPoint([1e3*d.epoch,1*d.quote]),1*d.epoch>1*b.table.date_expiry&&(j&&(b.table.exit_tick=j.quote,b.table.exit_tick_time=1*j.epoch,b.validation="This contract has expired"),l()),j=d}})}else i=c.events.on("ohlc",function(a){var c=e.keyFor(a.ohlc.symbol,a.ohlc.granularity);if(f==c){var d=b.chart.chart;if(d){var g=d.series[0],h=g.data[g.data.length-1],i=a.ohlc,j=[1e3*i.open_time,1*i.open,1*i.high,1*i.low,1*i.close];h.x!=j[0]?g.addPoint(j,!0,!0):h.update(j,!0),1*i.epoch>1*b.table.date_expiry&&l()}}});var k=!1,l=function(){k||(k=!0,e.unregister(f),h&&c.events.off("tick",h),i&&c.events.off("candles",i))};b.onclose.push(l)}function q(a,b){var d=(a.table,Math.min(1*a.table.date_expiry,g.utc().unix())-(a.table.purchase_time||a.table.date_start)),e=0,f=0;e=3600>=d?0:7200>=d?60:21600>=d?120:86400>=d?300:3600,f=0===e?Math.max(3,30*d/3600|0):3*e;var k={ticks_history:a.chart.symbol,start:1*(a.table.purchase_time||a.table.date_start)-f,end:a.table.date_expiry?1*a.table.date_expiry+f:"latest",style:"ticks",count:4999};return 0!==e&&(k.granularity=e,k.style="candles",a.chart.type="candles"),a.table.is_expired||p(a,e),c.send(k).then(function(c){a.chart.loading="";var d={title:a.chart.display_name};c.history&&(d.history=c.history),c.candles&&(d.candles=c.candles);var e=i(b,d);c.history&&!a.table.entry_tick_time&&(a.table.entry_tick_time=c.history.times.filter(function(b){return 1*b>1*a.table.date_start})[0],a.table.entry_tick||(a.table.entry_tick=c.history.prices.filter(function(b,d){return 1*c.history.times[d]>1*a.table.date_start})[0])),c.candles&&!a.table.entry_tick_time&&j(a.chart.symbol,a.table.date_start).then(function(b){var c=b.history;1===c.times.length&&(a.table.entry_tick_time=c.times[0],e.addPlotLineX({value:1e3*a.table.entry_tick_time,label:"Entry Spot"}))}),c.history&&!a.table.exit_tick_time&&a.table.is_expired&&(a.table.exit_tick_time=h.last(c.history.times.filter(function(b){return 1*b<=1*a.table.date_expiry})),a.table.exit_tick=h.last(c.history.prices.filter(function(b,d){return 1*c.history.times[d]<=1*a.table.date_expiry}))),c.candles&&!a.table.exit_tick_time&&a.table.is_expired&&j(a.chart.symbol,a.table.date_expiry-2).then(function(b){var c=b.history;1===c.times.length&&(a.table.exit_tick_time=c.times[0],a.table.exit_tick=c.prices[0],e.addPlotLineX({value:1e3*a.table.exit_tick_time,label:"Exit Spot",text_left:!0}))}),a.table.purchase_time&&e.addPlotLineX({value:1e3*a.table.purchase_time,label:"Purchase Time"}),a.table.entry_tick_time&&e.addPlotLineX({value:1e3*a.table.entry_tick_time,label:"Entry Spot"}),a.table.exit_tick_time&&e.addPlotLineX({value:1e3*a.table.exit_tick_time,label:"Exit Spot",text_left:!0}),a.table.date_expiry&&e.addPlotLineX({value:1e3*a.table.date_expiry,label:"End Time"}),a.table.date_start&&e.addPlotLineX({value:1e3*a.table.date_start,label:"Start Time",text_left:!0}),a.chart.barrier&&e.addPlotLineY({value:1*a.chart.barrier,label:"Barrier ("+a.chart.barrier+")"}),a.chart.high_barrier&&e.addPlotLineY({value:1*a.chart.high_barrier,label:"High Barrier ("+a.chart.high_barrier+")"}),a.chart.low_barrier&&e.addPlotLineY({value:1*a.chart.low_barrier,label:"Low Barrier ("+a.chart.low_barrier+")",color:"red"}),a.chart.chart=e,a.chart.manual_reflow()})["catch"](function(b){a.chart.loading=b.message})}var r={};return require(["css!viewtransaction/viewTransaction.css"]),require(["text!viewtransaction/viewTransaction.html"]),{init:k}});