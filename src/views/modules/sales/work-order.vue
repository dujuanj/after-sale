<template>
  <!-- 工单管理 -->
  <div class="mod-config">
    <!-- 导航 -->
    <!-- <el-breadcrumb separator="/" class="marbot_15">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>售后管理</el-breadcrumb-item>
      <el-breadcrumb-item>工单</el-breadcrumb-item>
    </el-breadcrumb>-->
    <!-- 工单数据 -->
    <el-row :gutter="12" class="marbot_15">
      <el-col :span="2">
        <el-card shadow="always">
          全部工单
          <br>
          <span style="color:#409EFF;font-size:24px;">128</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          待处理
          <br>
          <span style="color:#F56C6C;font-size:24px;">128</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          处理中
          <br>
          <span style="color:#E6A23C;font-size:24px;">128</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="hover">
          已处理
          <br>
          <span style="color:#606266;font-size:24px;">128</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          已关闭
          <br>
          <span style="color:#909399;font-size:24px;">128</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          已回访
          <br>
          <span style="color:#67C23A;font-size:24px;">128</span>
        </el-card>
      </el-col>
    </el-row>
    <!-- 查询 -->
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="customerRealName" placeholder="输入客户姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <select v-model="productType">
          <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>-->
          <option value>请选择产品类型</option>
          <option value="1">初柜</option>
          <option value="5">门锁</option>
          <option value="4">门禁</option>
          <option value="2">2层屉柜</option>
          <option value="3">3层屉柜</option>
        </select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="mac" placeholder="输入Mac地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="serviceUserRealName" placeholder="输入服务人员" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.paramKey" placeholder="输入问题关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <select>
          <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>-->
          <option value>请选择执行状态</option>
          <option value="1">新建</option>
          <option value="2">已分派</option>
          <option value="3">执行中</option>
          <option value="4">处理完成</option>
          <option value="5">结束</option>
        </select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button icon="el-icon-document" @click="reset()">重置</el-button>

        <!-- <el-button
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <!-- <el-button icon="el-icon-download" @click="addOrUpdateHandle()">导入</el-button>
    <el-button icon="el-icon-upload" @click="addOrUpdateHandle()">导出</el-button> -->
    <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()" class="marbot_15">新增</el-button>
    <!-- 表格 -->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="number" header-align="center" align="center" width="110" label="工单编号"></el-table-column>
      <el-table-column prop="customerRealName" header-align="center" align="center" label="客户姓名"></el-table-column>
      <el-table-column prop="customerPhone" header-align="center" align="center" label="联系电话"></el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="地址"
        :show-overflow-tooltip="true"
      >
        <!-- <span>{{customerCity}}</span> -->
        <template slot-scope="scope">
          <span>{{ scope.row.customerCity }} {{ scope.row.customerCounty }} {{ scope.row.customerDetailAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="产品">
        <template
          slot-scope="scope"
        >{{scope.row.productType==1?"初柜":scope.row.productType==2?"2层屉柜":scope.row.productType==3?"3层屉柜":scope.row.productType==4?"门禁":scope.row.productType==5?"门锁":''}}</template>
      </el-table-column>
      <el-table-column prop="mac" header-align="center" align="center" label="Mac码"></el-table-column>
      <el-table-column
        prop="contentDetail"
        header-align="center"
        align="center"
        label="投诉内容"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="revisitTime"
        header-align="center"
        align="center"
        label="时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="serviceUserRealName" header-align="center" align="center" label="服务人员"></el-table-column>
      <el-table-column header-align="center" align="center" label="执行状态">
        <template slot-scope="scope">
          <span>{{ scope.row.worksheetStatus==1?"创建":scope.row.worksheetStatus==2?"已分派":scope.row.worksheetStatus==3?"执行中":scope.row.worksheetStatus==4?"处理完成":scope.row.worksheetStatus==5?"结束":'' }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
           <el-button type="text" size="small" v-if="isAuth('sys:menu:detail')"  @click="detail(scope.row.id,scope.row)">详情</el-button>
            <el-button type="text" size="small" v-if="isAuth('sys:menu:revist')" @click="revisitHandle(scope.row.id,scope.row)">回访</el-button>
           <el-button type="text" size="small" v-if="isAuth('sys:menu:update')" @click="addOrUpdateHandle(scope.row.id,scope.row)">修改</el-button>
          <el-button type="text" size="small" v-if="isAuth('sys:menu:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
          <!-- <el-button
            :id="scope.row.id"
            v-for="item in opoperation"
            type="text"
            size="small"
            @click="listenCall(item.methods,scope.row.id,scope.row)"
          >{{item.name}}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 工单弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <!-- 回访单弹窗，新增 -->
    <revisit-add-or-update v-if="revisitVisible" ref="revisitaddOrUpdate" @refreshDataList="getDataList"></revisit-add-or-update>
    <!-- 图表 -->

    <div class="mod-demo-echarts">
      <el-alert title="统计" type="warning" :closable="false"></el-alert>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <div id="J_chartLineBox" class="chart-box"></div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <div id="J_chartPieBox" class="chart-box"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import AddOrUpdate from "./config-add-or-update";
import RevisitAddOrUpdate from './revisit-add-or-update'

export default {
 
  data() {
    return {
      values: "",
      dataForm: {
        paramKey: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      revisitVisible:false,
      // 图表
      chartLine: null,
      chartPie: null,
      menuList: JSON.parse(sessionStorage.getItem("menuList") || "[]"),
    
      // 查询
      customerRealName: "",
      productType: "",
      mac: "",
      serviceUserRealName: ""
    };
  },
  mounted() {
    this.initChartLine();
    this.initChartPie();
  
  },
  activated() {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartLine) {
      this.chartLine.resize();
    }
    if (this.chartPie) {
      this.chartPie.resize();
    }
  },
  components: {
    AddOrUpdate,
    RevisitAddOrUpdate

  },
  activated() {
    this.getDataList();
  },
  methods: {
    listenCall(methodsWords, id, detailDatas) {
      //监听子组件点击哪个按钮(促发哪个函数)
      this[methodsWords](id, detailDatas); //调取操作方法
    },
    // 详情
    detail(id, detailDatas) {
      console.log(id);
      this.$router.push({
        name: "work-detail",
        params: { id: id, detailDatas: detailDatas }
      });
      // window.sessionStorage.setItem('detaiId',id);
      // window.sessionStorage.setItem('detailDatas',JSON.stringify(detailDatas));
    },
    // 折线图
    initChartLine() {
      var option = {
        title: {
          text: "工单统计"
        },
        tooltip: {
          trigger: "axis"
        },
        // 'legend': {
        //   'data': [ '邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎' ]
        // },
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
            name: "邮件营销",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
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
    // 饼状图
    initChartPie() {
      var option = {
        title: {
          text: "投诉占比",
          subtext: "纯属虚构",
          x: "left"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "right",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
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
    // 获取数据列表
    getDataList() {
      console.log(window.sessionStorage.getItem('sid'));
      // this.dataListLoading = true;
      const _this = this;
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/worksheet.query",
          {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            customerRealName: this.customerRealName,
            productType: this.productType,
            mac: this.mac,
            serviceUserRealName: this.serviceUserRealName,
            sid:window.sessionStorage.getItem('sid')
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res);
          if (res.data.isSuccess == "true") {
            console.log(res.data.data);
            _this.dataList = res.data.data.list;
            console.log(_this.dataList);
            this.totalPage = res.data.data.total;
          }else if(res.data.isSuccess == "false"){
             this.$message.error(res.data.errorMsg);
              this.$router.replace({ name: 'login' })
          }
          
         
        })
        .catch(res => {
          console.log("err");
        });
    },
    reset() {
      (this.customerRealName = ""),
        (this.productType = ""),
        (this.mac = ""),
        (this.serviceUserRealName = "")
        this.getDataList();
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改工单
    addOrUpdateHandle(id, detailDatas) {
      this.addOrUpdateVisible = true;

      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, detailDatas);
      });
    },
    // 新增回访单
    revisitHandle(id,detailDatas){
      this.revisitVisible = true;
      console.log(this.revisitVisible);
        this.$nextTick(() => {
        this.$refs.revisitaddOrUpdate.init(id, detailDatas);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      this.$confirm(
        `确定对 工单${ids.join(",")} 进行${id ? "删除" : "批量删除"}操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http_
            .post(
              this.GLOBAL.baseUrl + "/worksheet.delete",
              { id: id,
                sid:window.sessionStorage.getItem('sid')
              },
              {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              }
            )
            .then(({ data }) => {
              console.log(data.isSuccess);
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            });
        })
        .catch(() => {});
    },
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle(menu) {
      var route = this.dynamicMenuRoutes.filter(
        item => item.meta.menuId === menu.menuId
      );
      if (route.length >= 1) {
        this.$router.push({ name: route[0].name });
      }
    }
  }
};
</script>

<style lang="scss">
.marbot_15 {
  margin-bottom: 15px;
}
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
select {
  border: 1px solid #dcdfe6;
  color: #606266;
  border-radius: 3px;
  height: 37px;
}
</style>
