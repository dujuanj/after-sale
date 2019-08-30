<template>
  <div class="mod-demo-echarts">
    <!-- <el-alert
      title="提示："
      type="warning"
      :closable="false">
      <div slot-scope="description">
        <p class="el-alert__description">1. 此Demo只提供ECharts官方使用文档，入门部署和体验功能。具体使用请参考：http://echarts.baidu.com/index.html</p>
      </div>
    </el-alert>-->

    <el-row :gutter="20">
      <!-- 产品数量 -->
      <el-col :span="8">
        <el-card>
          <div id="productCounts" class="chart-box"></div>
        </el-card>
      </el-col>
       <!-- 销量占比 -->
      <el-col :span="8">
        <el-card>
          <div id="J_chartLineBox1" class="chart-box"></div>
        </el-card>
      </el-col>
        <!-- 产品投诉占比 -->
      <el-col :span="8">
        <el-card>
          <div id="J_chartPieBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <!-- 产品销量 -->
      <el-col :span="12">
        <el-card>
          <div id="J_chartLineBox" class="chart-box"></div>
        </el-card>
      </el-col>
     
     
      <!-- 工单统计 -->
      <el-col :span="12">
        <el-card>
          <div id="J_chartBarBox" class="chart-box"></div>
        </el-card>
      </el-col>
     
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      chartLine: null,
      chartPie1: null,
      chartBar: null,
      chartPie: null,
      chartScatter: null,
      productData:null,//产品数量数据
    };
  },
  mounted() {
    this.initChartLine(); //产品销量统计
    
    this.initChartPie(); //投述占比
    this.initChartScatter(); //工单统计
    this.initProductCount(); //产品数量统计
    this.salesShare(); //销量占比
   
  },
  activated() {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartLine) {
      this.chartLine.resize();
    }
    if (this.chartBar) {
      this.chartBar.resize();
    }
    if (this.chartPie) {
      this.chartPie.resize();
    }
     if (this.chartPie1) {
      this.chartPie1.resize();
    }
    if (this.chartScatter) {
      this.chartScatter.resize();
    }
    //  this.getProductDatas();
  },
  methods: {
    // 产品数量统计
    initProductCount() {
    //  var productDatas;
       this.$http_
              .post(this.GLOBAL.baseUrlxg + "/productinfo/echarts.count", {
                sid:window.sessionStorage.getItem('sid')
              }, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
               console.log(data.data)
               var productDatas = data.data;
                      var option = {
          title: {
          text: "产品数量统计"
        },
            tooltip: {
          trigger: "axis"
        },
    legend: {
        data: ['库存', '售出']
    },
    grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
    },
    xAxis:  {
       type: 'category',
        // type: 'value'
        data:productDatas.productTypeName
    },
    yAxis: {
      type: 'value'
        // type: 'category',
        // data:productDatas.name
        // data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    series: [
        {
            name: '库存',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    // position: 'insideRight'
                }
            },
            data: productDatas.stock
        },
        {
            name: '售出',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    // position: 'insideRight'
                }
            },
            data:productDatas.sell
        }
       
       
      
    ]
};
  this.chartBar = echarts.init(document.getElementById("productCounts"));
      this.chartBar.setOption(option);
      window.addEventListener("resize", () => {
        this.chartBar.resize();
      });
              });
      //   var productDatas={
      //   name:["初柜", "2层屉柜", "3层屉柜", "门禁", "蓝牙锁"],
      //   stock: [100, 150, 200, 334, 390],  //库存
      //   sellout:[120,100,30,222,44]  //售出
      // }
      // console.log(productDatas);
      // var productDatas=this.productData;
      // console.log(productDatas);
      // console.log(productDatas.productTypeName)


     
    },
   
    // 销量统计
    initChartLine() {
      var option = {
        title: {
          text: "产品销量统计"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
        //  orient: 'vertical',
        //  left: 'center',
        //  bottom:'bottom',
        //  margin: '50',
        
          data: ["初柜", "2层屉柜", "3层屉柜", "门禁", "蓝牙锁"]
          
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "初柜",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "2层屉柜",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "3层屉柜",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "门禁",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "蓝牙锁",
            type: "line",
            stack: "总量",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      this.chartLine = echarts.init(document.getElementById("J_chartLineBox"));
      this.chartLine.setOption(option);
      window.addEventListener("resize", () => {
        this.chartLine.resize();
      });
    },
    // 销量占比
    salesShare(){
      var datas={
        total:1250,
        name:['初柜','2层屉柜','3层屉柜','门禁','蓝牙锁'],
        datas:[ {value:335, name:'初柜'},
                {value:310, name:'2层屉柜'},
                {value:234, name:'3层屉柜'},
                {value:135, name:'门禁'},
                {value:1548, name:'蓝牙锁'}]
      }
    var  option = {
       title: {
          text: "产品销量占比"
        },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'right',
        data:datas.name
        // data:['初柜','2层屉柜','3层屉柜','门禁','蓝牙锁']
    },
    emphasis:{
      show:true
    },
     graphic:{       //图形中间文字
            type:"text",
            left:"center",
            top:"center",
            style:{
                text:"销售总量-"+datas.total,
                textAlign:"center",
                fill:"#000",
                fontSize:16
            }
        },
    series: [
        {
            name:'销量占比',
            type:'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:datas.datas
            // data:[
            //     {value:335, name:'初柜'},
            //     {value:310, name:'2层屉柜'},
            //     {value:234, name:'3层屉柜'},
            //     {value:135, name:'门禁'},
            //     {value:1548, name:'蓝牙锁'}
            // ]
        }
    ]
};
  this.chartLine = echarts.init(document.getElementById("J_chartLineBox1"));
      this.chartLine.setOption(option);
      window.addEventListener("resize", () => {
        this.chartLine.resize();
      });
    },
   
    // 投述占比
    initChartPie() {
       var datas={
        total:1250,
        name:['初柜','2层屉柜','3层屉柜','门禁','蓝牙锁'],
        datas:[ {value:335, name:'初柜'},
                {value:310, name:'2层屉柜'},
                {value:234, name:'3层屉柜'},
                {value:135, name:'门禁'},
                {value:1548, name:'蓝牙锁'}]
      }
      var option = {
        backgroundColor: "#2c343c",
        title: {
          text: "产品投诉占比 - 投诉总量"+datas.total,
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: "投述占比",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            // data:[
            //     {value:335, name:'初柜'},
            //     {value:310, name:'2层屉柜'},
            //     {value:234, name:'3层屉柜'},
            //     {value:135, name:'门禁'},
            //     {value:154, name:'蓝牙锁'}
            // ]
            data:datas.datas
            .sort(function(a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              normal: {
                textStyle: {
                  color: "rgba(255, 255, 255, 0.3)"
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "rgba(255, 255, 255, 0.3)"
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: "#c23531",
                shadowBlur: 200,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
      this.chartPie = echarts.init(document.getElementById("J_chartPieBox"));
      this.chartPie.setOption(option);
      window.addEventListener("resize", () => {
        this.chartPie.resize();
      });
    },
    // 工单统计
    initChartScatter() {
      var option = {
        title: {
          text: "工单统计"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
        //  orient: 'vertical',
        //  left: 'center',
        //  bottom:'bottom',
        //  margin: '50',
        
          data: ["初柜", "2层屉柜", "3层屉柜", "门禁", "蓝牙锁"]
          
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "初柜",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "2层屉柜",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "3层屉柜",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "门禁",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "蓝牙锁",
            type: "line",
            stack: "总量",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      this.chartScatter = echarts.init(document.getElementById("J_chartBarBox"));
      this.chartScatter.setOption(option);
      window.addEventListener("resize", () => {
        this.chartScatter.resize();
      });
    }
  }
};
</script>

<style lang="scss">
.mod-demo-echarts {
  > .el-alert {
    margin-bottom: 10px;
  }
  > .el-row {
    margin-top: -10px;
    margin-bottom: -10px;
    .el-col {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .chart-box {
    min-height: 400px;
  }
}
</style>
