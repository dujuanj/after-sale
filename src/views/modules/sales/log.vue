<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%">
      <el-table-column fixed label="序号" width="50" align="center">
        <template scope="scope">
          <span>{{(pageIndex-1)*10+(scope.$index + 1)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        width="80"
        label="账号名">
      </el-table-column>
      <!-- <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column> -->
      <!-- <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        label="角色">
      </el-table-column> -->
      <el-table-column
        prop="clientIp"
        header-align="center"
        align="center"
        width="350"
        :show-overflow-tooltip="true"
        label="登录IP">
      </el-table-column>
      <!-- <el-table-column
        prop="params"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="登录位置">
      </el-table-column> -->
      <el-table-column
        prop="clientType"
        header-align="center"
        align="center"
        label="登录方式">
        <template slot-scope="scope">
          <span>{{scope.row.clientType==1?"pc端登陆":scope.row.clientType==2?"小程序登陆":''}}</span>
          </template>  
      </el-table-column>
      <el-table-column
        prop="loginTime"
        header-align="center"
        align="center"
        width="200"
        label="上线时间">
      </el-table-column>
      <el-table-column
        prop="logoutTime"
        header-align="center"
        align="center"
        width="200"
        label="下线时间">
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: []
      }
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        // this.$http({
        //   url: this.$http.adornUrl('/sys/log/list'),
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     'page': this.pageIndex,
        //     'limit': this.pageSize,
        //     'key': this.dataForm.key
        //   })
        // }).then(({data}) => {
        //   if (data && data.code === 0) {
        //     this.dataList = data.page.list
        //     this.totalPage = data.page.totalCount
        //   } else {
        //     this.dataList = []
        //     this.totalPage = 0
        //   }
        //   this.dataListLoading = false
        // })
         this.$http_
        .post(
          this.GLOBAL.baseUrl + "/log.login.query",
          {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            userName: this.userName,
           
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
          if (res.status == "200") {
            console.log(res.data.data);
            this.dataList = res.data.data.list;
            console.log(this.dataList);
            this.totalPage = res.data.data.total;
          }
          this.dataListLoading = false;
        })
        .catch(res => {
          console.log("err");
        });
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
      }
    }
  }
</script>
