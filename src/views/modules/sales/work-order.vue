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
        <el-input v-model="dataForm.paramKey" placeholder="输入客户姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="values" placeholder="选择产品类型">
          <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>-->
          <el-option value="初柜">初柜</el-option>
          <!-- <el-option>门锁</el-option>
          <el-option>门禁</el-option>
          <el-option>2层屉柜</el-option>
          <el-option>3层屉柜</el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.paramKey" placeholder="输入Mac地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.paramKey" placeholder="输入服务人员" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.paramKey" placeholder="输入问题关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="values" placeholder="选择产品类型">
          <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>-->
          <el-option value="新建">新建</el-option>
          <el-option value="已分派">已分派</el-option>
          <el-option value="执行中">执行中</el-option>
          <el-option value="处理完成">处理完成</el-option>
          <el-option value="结束">结束</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button icon="el-icon-document" @click="getDataList()">重置</el-button>

        <!-- <el-button
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-button icon="el-icon-download" @click="addOrUpdateHandle()">导入</el-button>
    <el-button icon="el-icon-upload" @click="addOrUpdateHandle()">导出</el-button>
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
      <el-table-column prop="id" header-align="center" align="center" width="80" label="工单编号"></el-table-column>
      <el-table-column prop="paramKey" header-align="center" align="center" label="客户姓名"></el-table-column>
      <el-table-column prop="paramValue" header-align="center" align="center" label="联系电话"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="地址"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="产品"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="Mac码"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="投诉内容"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="时间"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="服务人员"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="执行状态"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="always">
          <span>工单统计</span>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <span>产品投诉占比</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AddOrUpdate from "./config-add-or-update";
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
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/config/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          paramKey: this.dataForm.paramKey
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
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
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
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
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/config/delete"),
            method: "post",
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.marbot_15 {
  margin-bottom: 15px;
}
</style>
