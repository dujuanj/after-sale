<template>
  <div class="mod-home">
    <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()" style='margin-bottom:15px;'>新增产品</el-button>
    <!-- <el-button
      type="primary"
      icon="el-icon-edit-outline"
      size="mini"
      @click="addOrUpdateHandle(id,datas)"
      class="marbot_15"
      style="float:left;margin-bottom:15px"
    >修改</el-button> -->
    <!-- <h4>工单 {{datas.number}}</h4> -->
    <!-- 基本信息 -->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column
        prop="batchNumer"
        header-align="center"
        align="center"
        width="80"
        label="生产批号"
      ></el-table-column>
      <el-table-column prop="productName" header-align="center" align="center" label="产品"></el-table-column>
      <el-table-column prop="productModel" header-align="center" align="center" label="产品型号"></el-table-column>
      <el-table-column prop="productModel" header-align="center" align="center" label="Mac码"></el-table-column>
      <el-table-column prop="startTime" header-align="center" align="center" label="生产时间"></el-table-column>
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

    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "../sales/product-add-update";
export default {
  name: "workDetail",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      addOrUpdateVisible: false,
      //  datas:this.$route.params.detailDatas,
      id: "",
      datas: "",
      dataList: [],
      batchid: window.sessionStorage.getItem("batchid")
    };
  },
  activated() {
    (this.datas = this.$route.params.detailDatas),
      (this.id = this.$route.params.id),
      console.log(this.id);
    console.log(this.datas);
    this.getDataList(this.batchid);
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle(id, detailDatas) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, detailDatas);
      });
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
          this.dataList = data.data.batchInfoList;
        });
    }
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

