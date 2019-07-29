<template>
  <div class="mod-home">
    <!-- 批次详情 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header" style="font-weight:bold;">
        <span>生产批号:</span>
        <span>{{dataList.batchNumber}}</span>
        <el-button size="mini"  round type="" @click="batchupdate(dataList.id,dataList)">修改批次</el-button>
      </div>
      <div style="float:left">
        <div class="layui-card-body">
          <div class="layui-form-item">
            <label class="layui-form-label">
              <span>生产厂商:</span>
              <span style="font-weight:bold;">{{dataList.manufacturer}}</span>
            </label>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">
              <span>生产监督:</span>
              <span>{{ dataList.supervisioner}} </span>
              <!-- <div style="margin-left:13%;color:#E6A23C">多个监督人员请用,号隔开</div> -->
            </label>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">
              <span>生产时间:</span>
              {{dataList.startTime}} -- {{dataList.endTime}}
            </label>
          </div>
        </div>
      </div>
      <div style="float:left;width:25%;">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>产品:</span>
            <ul style='margin-left:13%;'>
              <li v-for="item in dataList.batchInfoList" > <span style='display:inline-block;width:70px'>{{item.productName}}</span> <span style='display:inline-block;width:100px'>{{item.productModel}}</span> <span style='display:inline-block'>{{item.number}}</span>个</li>
            </ul>
          </label>
        </div>
      </div>
    </div>
    <el-button
      v-if="isAuth('sys:user:save')"
      type="primary"
      @click="addOrUpdateHandle()"
      style="margin-bottom:15px;"
    >新增产品</el-button>
    <!-- <el-button
      type="primary"
      icon="el-icon-edit-outline"
      size="mini"
      @click="addOrUpdateHandle(id,datas)"
      class="marbot_15"
      style="float:left;margin-bottom:15px"
    >修改</el-button>-->
    <!-- <h4>工单 {{datas.number}}</h4> -->
    <!-- 基本信息 -->
    <el-table
      :data="batchList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column
        prop="batchNumber"
        header-align="center"
        align="center"
        width="80"
        label="生产批号"
      ></el-table-column>
      <el-table-column prop="productName" header-align="center" align="center" label="产品"></el-table-column>
      <el-table-column prop="productModel" header-align="center" align="center" label="产品型号"></el-table-column>
      <el-table-column prop="mac" header-align="center" align="center" label="Mac码"></el-table-column>
      <el-table-column prop="productTime" header-align="center" align="center" label="生产时间"></el-table-column>
      <el-table-column
        prop="manufacturer"
        header-align="center"
        align="center"
        width="180"
        label="生产厂家"
      ></el-table-column>
      <el-table-column
        prop="supervisioner"
        header-align="center"
        align="center"
        width="180"
        label="生产监督"
      ></el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="190" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:user:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id,scope.row)"
          >修改</el-button>
          <el-button
            v-if="isAuth('sys:user:delete')"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
          >删除</el-button>
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

    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getlistByBatchNumber(batchNum)"></add-or-update>
    <batch-update v-if="batchaddOrUpdateVisible" ref="batchaddOrUpdate" @refreshDataList="getDataList"></batch-update>
  </div>
</template>

<script>
import AddOrUpdate from "../sales/product-add-update";
import batchUpdate from "../sales/parductbatch-update-add";
export default {
  name: "workDetail",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      addOrUpdateVisible: false,
      batchaddOrUpdateVisible:false,
      //  datas:this.$route.params.detailDatas,
      id: "",
      datas: "",
      dataList: [],
      batchid: window.sessionStorage.getItem("batchid"),
      batchNum:window.sessionStorage.getItem('batchnumber'),
      batchList:'',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
    };
  },
  activated() {
    (this.datas = this.$route.params.detailDatas),
      (this.id = this.$route.params.id),
      console.log(this.id);
    console.log(this.datas);
    this.getDataList(this.batchid);
    this.getlistByBatchNumber(this.batchNum)
  },
  components: {
    AddOrUpdate,
    batchUpdate
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle(id, detailDatas) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, detailDatas);
      });
    },
    // 修改批次
    batchupdate(id,datas){
      this. batchaddOrUpdateVisible = true;
      this.$nextTick(()=>{
        this.$refs.batchaddOrUpdate.init(id,datas);
      })
    },
    // 查询批次详情
    getDataList(id) {
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/productbatch/info",
          {
            id: id,
            // createUserRealName:this.GLOBAL.createUserRealName,
            sid: window.sessionStorage.getItem("sid")
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data);
          this.dataList = data.data;
        });
    },
    getlistByBatchNumber(batchNumber){
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/productinfo/listByBatchNumber",
          {
            batchNumber: batchNumber,
            // createUserRealName:this.GLOBAL.createUserRealName,
            sid: window.sessionStorage.getItem("sid"),
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data);
          this.batchList = data.data.records;
           this.totalPage = data.data.total;
        });
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
     // 删除
    deleteHandle(id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.userId;
          });
      this.$confirm(
        `确定对[id=${userIds.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // 删除用户
          this.$http_
            .post(
              this.GLOBAL.baseUrlxg + "/productinfo/delete",
              {
                id: id,
                sid: window.sessionStorage.getItem("sid")
              },
              {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              }
            )
            .then(res => {
              console.log(res);

              this.$message({
                message:res.data.msg,
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getlistByBatchNumber(this.batchNum);
                  // this.getDataList()
                }
              });
              this.dataListLoading = false;
            })
            .catch(res => {
              console.log("err");
            });
        })
        .catch(() => {});
    },
  }
};
</script>

<style>
.mod-home {
  line-height: 1.5;
}
.layui-card {
  margin-bottom: 15px;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  padding-bottom: 15px;
  clear: both;
  overflow: hidden;
}
.detail .layui-card-header {
  background: #efeef0 !important;
}
.layui-card-header {
  height: 42px;
  line-height: 42px;
  padding: 0 15px;
  border-bottom: 1px solid #f6f6f6;
  color: #333;
  border-radius: 2px 2px 0 0;
  font-size: 14px;
}
.layui-card-body {
  padding: 10px 15px;
  line-height: 24px;
}
.layui-form-item {
  margin-bottom: 15px;
  clear: both;
  *zoom: 1;
}
.detail label {
  width: 100% !important;
  text-align: left !important;
}
.layui-form-label {
  float: left;
  display: block;
  padding: 9px 15px;
  width: 80px;
  font-weight: 400;
  line-height: 20px;
  text-align: right;
}
/* .el-upload-list--picture .el-upload-list__item-status-label {
  width: 46px !important;
}
.el-upload-list--picture .el-upload-list__item {
  width: 14%;
  float: left;
}
.el-upload-list--picture .el-upload-list__item-status-label i {
  margin-top: 12px;
  margin-left: 16px;
} */
.el-upload-list--picture-card .el-upload-list__item-status-label {
  width: 0px !important;
}
</style>

