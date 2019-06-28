<template>
<!-- 回访单 -->
  <div class="mod-user">
     <el-row :gutter="12" class="marbot_15">
      <el-col :span="2">
        <el-card shadow="always">
          全部回访单
          <br>
          <span style="color:#409EFF;font-size:24px;">128</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          满意
          <br>
          <span style="color:#F56C6C;font-size:24px;">128</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          不满意
          <br>
          <span style="color:#E6A23C;font-size:24px;">128</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="hover">
          满意度
          <br>
          <span style="color:#606266;font-size:24px;">128</span>
        </el-card>
      </el-col>
    </el-row>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="输入客户姓名 " clearable></el-input>
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
        <el-input v-model="dataForm.userName" placeholder="输入回访人员 " clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
         <el-button icon="el-icon-document" @click="getDataList()">重置</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        width="80"
        label="工单编号">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="客户姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="联系电话">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="产品">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="投诉内容">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="回访时间">
      </el-table-column>
       <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="回访人员">
      </el-table-column>
       <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="回访信息">
      </el-table-column>
       <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="满意度">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
           <el-button  type="text" size="small" index="slip-detail" @click="$router.push({ name: 'slip-detail' })">详情</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          userName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.userName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
