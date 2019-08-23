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
          <br />
          <span style="color:#409EFF;font-size:24px;">{{counts.total}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          待处理
          <br />
          <span style="color:#F56C6C;font-size:24px;">{{counts.total}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          处理中
          <br />
          <span style="color:#E6A23C;font-size:24px;">{{counts.handled}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="hover">
          已处理
          <br />
          <span style="color:#606266;font-size:24px;">{{counts.dispatched}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          已关闭
          <br />
          <span style="color:#909399;font-size:24px;">{{counts.closed}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          已回访
          <br />
          <span style="color:#67C23A;font-size:24px;">{{counts.revisited}}</span>
        </el-card>
      </el-col>
    </el-row>
    <!-- 查询 -->
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="productType" placeholder="请选择产品类型" @change="getDataList()">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.productType==1?'初柜':item.productType==2?'2层屉柜':item.productType==3?'3层屉柜':item.productType==4?'门禁':item.productType==5?'门锁':''"
            :value="item.productType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <select v-model="worksheetStatus" @change="getDataList()">
          <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>-->
          <option value>请选择执行状态</option>
          <option value="1">新建完成</option>
          <option value="2">已分派</option>
          <option value="3">执行中</option>
          <option value="4">工单关闭</option>
          <option value="5">已回访</option>
        </select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="fullQuery"
          placeholder=" 输入客户姓名／Mac地址／服务人员姓名查询"
          clearable
          style="width:333px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="block">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            start-placeholder="创建日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </div>
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
    <el-button icon="el-icon-upload" @click="addOrUpdateHandle()">导出</el-button>-->
    <el-button
      type="primary"
      v-if="isAuth('/api/postsale/worksheet.add')"
      icon="el-icon-plus"
      @click="addOrUpdateHandle()"
      class="marbot_15"
    >新增</el-button>
    <!-- 表格 -->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column fixed label="序号" width="50" align="center">
        <template scope="scope">
          <span>{{(pageIndex-1)*10+(scope.$index + 1)}}</span>
        </template>
      </el-table-column>
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
      <el-table-column
        prop="mac"
        header-align="center"
        align="center"
        label="Mac码"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="contentDetail"
        header-align="center"
        align="center"
        label="投诉内容"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="serviceUserRealName" header-align="center" align="center" label="服务人员"></el-table-column>
      <el-table-column
        prop="revisitTime"
        header-align="center"
        align="center"
        label="回访时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="revisitUserRealName" header-align="center" align="center" label="回访人员"></el-table-column>
      <el-table-column
        prop="revisitContent"
        header-align="center"
        align="center"
        label="回访记录"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="revisitScore" header-align="center" align="center" label="满意度"></el-table-column>
      <el-table-column header-align="center" align="center" label="执行状态">
        <template slot-scope="scope">
          <span
            :class="{'red':scope.row.worksheetStatus==4,'green':scope.row.worksheetStatus==1}"
          >{{ scope.row.worksheetStatus==1?"创建":scope.row.worksheetStatus==2?"已分派":scope.row.worksheetStatus==3?"执行中":scope.row.worksheetStatus==4?"处理完成":scope.row.worksheetStatus==5?"结束":'' }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="220" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detail(scope.row.id,scope.row)">详情</el-button>
          <el-button
            type="text"
            size="small"
            v-if="isAuth('/api/postsale/revisit.add')"
            @click="revisitHandle(scope.row.id,scope.row)"
          >回访</el-button>
          <el-button
            type="text"
            size="small"
            v-if="isAuth('/api/postsale/worksheet.update')"
            @click="addOrUpdateHandle(scope.row.id,scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            size="small"
            v-if="isAuth('/api/postsale/worksheet.update')"
            @click="closeBtn(scope.row)"
          >关闭</el-button>
          <el-button
            type="text"
            size="small"
            v-if="isAuth('/api/postsale/worksheet.delete')"
            @click="deleteHandle(scope.row.id)"
          >删除</el-button>
          <!-- <el-button
            :id="scope.row.id"
            v-for="item in opoperation"
            type="text"
            size="small"
            @click="listenCall(item.methods,scope.row.id,scope.row)"
          >{{item.name}}</el-button>-->
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
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      :productype="options"
    ></add-or-update>

    <!-- 回访单弹窗，新增 -->
    <revisit-add-or-update
      v-if="revisitVisible"
      ref="revisitaddOrUpdate"
      @refreshDataList="getDataList"
    ></revisit-add-or-update>
  </div>
</template>

<script>
import echarts from "echarts";
import AddOrUpdate from "./config-add-or-update";
import RevisitAddOrUpdate from "./revisit-add-or-update";

export default {
  data() {
    return {
      options: "",
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
      revisitVisible: false,

      menuList: JSON.parse(sessionStorage.getItem("menuList") || "[]"),
      counts: "",
      // 查询
      customerRealName: "",
      productType: "",
      mac: "",
      serviceUserRealName: "",
      worksheetStatus: "",
      value1: "", //查询日期
      createTimeStart: "",
      createTimeEnd: "",
      fullQuery: ""
    };
  },
  mounted() {
    this.initChartLine();
    this.initChartPie();
  },

  components: {
    AddOrUpdate,
    RevisitAddOrUpdate
  },
  activated() {
    this.getDataList();
    this.producttype();
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartLine) {
      this.chartLine.resize();
    }
    if (this.chartPie) {
      this.chartPie.resize();
    }
    this.worksheetcount();
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
    // 产品类型
    producttype() {
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/product/list",
          {
            currentPage: 1,
            pageSize: 10000,
            sid: window.sessionStorage.getItem("sid")
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res.data.data);
          this.options = res.data.data.records;
        })
        .catch(res => {
          console.log("err");
        });
    },
    // 获取数据列表
    getDataList() {
      console.log(window.sessionStorage.getItem("sid"));
      if (this.value1) {
        console.log(this.value1);
        this.createTimeStart = this.value1[0];
        this.createTimeEnd = this.value1[1];
      }
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
            fullQuery: this.fullQuery,
            createTimeStart: this.createTimeStart,
            createTimeEnd: this.createTimeEnd,
            sid: window.sessionStorage.getItem("sid"),
            worksheetStatus: this.worksheetStatus
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
          } else if (res.data.isSuccess == "false") {
            this.$message.error(res.data.errorMsg);
            this.$router.replace({ name: "login" });
          }
        })
        .catch(res => {
          console.log("err");
        });
    },
    reset() {
      (this.productType = ""),
        (this.mac = ""),
        (this.createTimeStart = ""),
        (this.createTimeEnd = ""),
        (this.value1 = ""),
        (this.fullQuery = ""),
        (this.worksheetStatus = ""),
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
    revisitHandle(id, detailDatas) {
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
              { id: id, sid: window.sessionStorage.getItem("sid") },
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
    // 关闭
    closeBtn(datas) {
      this.$prompt("请输入关闭备注", "关闭工单", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea"
       
      })
        .then(({ value }) => {
          datas.worksheetStatus = 4;
          datas.sid = window.sessionStorage.getItem("sid");
          datas.closeRemark = value;
          this.$http_
            .post(this.GLOBAL.baseUrl + "/worksheet.update", datas, {
              headers: {
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(({ data }) => {
             
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.getDataList();
                }
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle(menu) {
      var route = this.dynamicMenuRoutes.filter(
        item => item.meta.menuId === menu.menuId
      );
      if (route.length >= 1) {
        this.$router.push({ name: route[0].name });
      }
    },
    worksheetcount() {
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/worksheet.count",
          {
            sid: window.sessionStorage.getItem("sid")
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data);
          this.counts = data.data;
        });
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
.red {
  color: red;
}
.green {
  color: green;
}
</style>
