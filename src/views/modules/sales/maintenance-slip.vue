<template>
<!-- 回访单 -->
  <div class="mod-user">
    
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="serviceUserRealName" placeholder="输入维修人员姓名 " clearable></el-input>
      </el-form-item>
       <el-form-item>
          <el-select v-model="productType"  placeholder="请选择产品类型">
          <el-option v-for="item in options" :key="item.value" :label="item.productName" :value="item.productName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="revisitUserName" placeholder="输入回访人员 " clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
         <el-button icon="el-icon-document" @click="reset()">重置</el-button>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item> <br>
       <el-button v-if="isAuth('/api/postsale/repair.add')" type="primary" @click="addOrUpdateHandle()" style='margin-bottom:15px;'>新增</el-button>
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
        prop="serviceUserRealName"
        header-align="center"
        align="center"
        width="110"
        label="上门人员姓名">
      </el-table-column>
      <el-table-column
        prop="serviceUserName"
        header-align="center"
        align="center"
        label="上门人员用户名">
      </el-table-column>
      <el-table-column
        prop="serviceAppointmentTimeType"
        header-align="center"
        align="center"
        label="服务预约时间类型">
          <template
          slot-scope="scope"
        >{{scope.row.serviceAppointmentTimeType==1?"随时上门":scope.row.serviceAppointmentTimeType==2?"具体时间":''}}</template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="服务情况">
        <template
          slot-scope="scope"
        >{{scope.row.serviceStatusType==5?"修好了":scope.row.serviceStatusType==6?"修不了":''}}</template>
      </el-table-column>
      <el-table-column
        prop="serviceStatusDetail"
        header-align="center"
        align="center"
         :show-overflow-tooltip="true"
        label="服务备注">
        <!-- <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="serviceFinishTime"
        header-align="center"
        align="center"
        width="180"
        label="服务结束时间">
      </el-table-column>
      <el-table-column
        prop="serviceAppointmentTimeType"
        header-align="center"
        align="center"
        label="工单状态">
          <template
          slot-scope="scope"
        >{{scope.row.worksheetStatus==6?"创建完成":scope.row.worksheetStatus==7?"已经分派":scope.row.worksheetStatus==8?"工人接单（处理中)":scope.row.worksheetStatus==9?"9-	工人完成（处理成功）":scope.row.worksheetStatus==10?"工单关闭":''}}</template>
      </el-table-column>
     
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button> -->
           <!-- <el-button  type="text" v-if="isAuth('sys:menu:detail')"  size="small" index="slip-detail"  @click="listenCall(scope.row.id,scope.row)" >详情</el-button> -->
           <el-button type="text" v-if="isAuth('/api/postsale/repair.update')"  size="mini" @click="addOrUpdateHandle(scope.row.id,scope.row)" >修改</el-button>
          <!-- <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button> -->
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
   <!-- 回访单弹窗，修改 -->
    <add-or-update v-if="visible" ref="revisitaddOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './maintenace-update-add'
 
  export default {
    data () {
      return {
          options:'',
        dataForm: {
          userName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        visible:false,
        // 查询
        productType:'',
        customerRealName:'',
        revisitUserName:''
      }
    },
    components: {
      AddOrUpdate,
     
    },
    activated () {
      this.getDataList();
      this.producttype()

    },
    methods: {
      // 详情跳转
      listenCall(id,datas){
        this.$router.push({
        name: "slip-detail",
        params: { id: id, detailDatas: datas }
      });
      },
 // 产品类型
   producttype(){
       this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/product/name.list",
          
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res.data.data);
          this.options=res.data.data
         
        })
        .catch(res => {
          console.log("err");
        });
   },
      // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      const _this = this;
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/repair.query",
          {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            serviceUserRealName: this.serviceUserRealName,         
            sid:window.sessionStorage.getItem('sid'),
           
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res);
          
            console.log(res.data.data);
            _this.dataList = res.data.data.list;
            console.log(_this.dataList);
            this.totalPage = res.data.data.total;
          
          this.dataListLoading = false;
        })
        .catch(res => {
          console.log("err");
        });
    },
    reset(){
      this.revisitUserName='',
      this.customerRealName='',
      this.productType='',
      this.getDataList()
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
      },
        // 新增 / 修改
    addOrUpdateHandle(id,detailDatas) {
        this.visible = true;
    
        this.$nextTick(() => {
        this.$refs.revisitaddOrUpdate.init(id, detailDatas);
      });
    },
    }
  }
</script>
