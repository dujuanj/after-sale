<template>
  <div class="mod-user">
     <el-row :gutter="12" class="marbot_15">
      <el-col :span="2">
        <el-card shadow="always">
          今天发出
          <br />
          <span style="color:#409EFF;font-size:24px;">{{countDatas.todayCount}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          本周发出
          <br />
          <span style="color:#F56C6C;font-size:24px;">{{countDatas.weekCount}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          本月发出
          <br />
          <span style="color:#E6A23C;font-size:24px;">{{countDatas.monthCount}}</span>
        </el-card>
      </el-col>
     
    </el-row> <br>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-form-item>
          <el-input v-model="fullQuery" placeholder="输入Mac地址／发货人姓名" clearable  style="width:333px;"></el-input>
        </el-form-item>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>  -->
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
         <el-form-item>
        <div class="block">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </div>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search"  size="mini"  @click="getDataList()">查询</el-button>
          <el-button icon="el-icon-document" @click="reset()">重置</el-button>
          <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
          <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
        </el-form-item>
      </el-form-item>
    </el-form>
     <el-button
      type="primary"
      v-if="isAuth('/api/postsale/worksheet.add')"
      icon="el-icon-upload2"
      size="mini"
       @click="importandexportHandle('发货记录导出')"
      class="marbot_15"
    >导出</el-button>
    <br />
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" header-align="center" align="center" width="80"></el-table-column> -->
       <el-table-column fixed label="序号" width="50" align="center">
        <template scope="scope">
          <span>{{(pageIndex-1)*10+(scope.$index + 1)}}</span>
        </template>
      </el-table-column>
      <el-table-column  header-align="center" align="center" width="80" label="产品类型">
           <template slot-scope="scope">
         {{scope.row.productType==1?'初柜':scope.row.productType==2?'2层屉柜':scope.row.productType==3?'3层屉柜':scope.row.productType==4?'门禁':scope.row.productType==5?'门锁':''}}
       </template>
       </el-table-column>
      <el-table-column prop="productModel" header-align="center" align="center" label="产品型号"></el-table-column>
      <el-table-column prop="mac" header-align="center" align="center" label="Mac码"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="发货时间"></el-table-column>
      <el-table-column prop="shipper" header-align="center" align="center" label="发货人"></el-table-column>

      <!-- <el-table-column fixed="right" header-align="center" align="center" width="220" label="操作">
        <template slot-scope="scope">
         
          <el-button
            v-if="isAuth('sys:user:delete')"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>-->
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
     <!-- 导入导出 -->
     <import-and-export
      v-if="exportVisible"
      ref="exportandimport"
      @refreshDataList="getDataList"
    ></import-and-export>
  </div>
</template>

<script>
import AddOrUpdate from "./producttype-update-add";
import ImportAndExport from './import-and-export'
export default {
  data() {
    return {
      dataForm: {
        userName: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
       exportVisible:false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      // search
      fullQuery:'',
      value1:'',
      countDatas:''
    };
  },
  components: {
    AddOrUpdate,
    ImportAndExport

  },
  activated() {
    this.getDataList();
    this.getCount();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/shipping/list",
          {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            sid: window.sessionStorage.getItem("sid"),
            fullQuery:this.fullQuery,
            startTime:this.value1[0],
            endTime:this.value1[1]
            // userName: this.userName,
            // realName: this.realName,
            // phone: this.phone,
            // roleList: this.roleList
            // current:this.pageIndex,
            // size:this.pageSize
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
            this.dataList = res.data.data.records;
            console.log(this.dataList);
            this.totalPage = res.data.data.total;
          }
          this.dataListLoading = false;
        })
        .catch(res => {
          console.log("err");
        });
    },
     // 导入导出弹框
    importandexportHandle(flag){
      
      this.exportVisible = true;
      this.$nextTick(() => {
         this.$refs.exportandimport.init(flag);
      })
    },
    getCount() {
      // 数量统计
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/shipping/count",
          { sid: window.sessionStorage.getItem("sid") },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res.data.data);
          this.countDatas=res.data.data;
        })
        .catch(res => {
          console.log("err");
        });
    },
    reset() {
      this.fullQuery='';
      this.value1='';
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
    // 新增 / 修改
    addOrUpdateHandle(id, datas) {
      this.addOrUpdateVisible = true;
      // alert(id);
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, datas);
      });
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
              this.GLOBAL.baseUrl + "/product/delete",
              {
                id: id
                // sid:window.sessionStorage.getItem('sid')
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
                message:
                  res.data.isSuccess == "true" ? "操作成功" : res.data.errorMsg,
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
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
    // 登陆许可
    allowLogin(id, value) {
      console.log(value);

      var html1 = "是否开启用户登陆权限";
      var html2 = "是否关闭用户登陆权限";
      this.$confirm(value == 1 ? html2 : html1, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 修改用户
          this.$http_
            .post(
              this.GLOBAL.baseUrl + "/user.update",
              {
                status: value == 1 ? 2 : 1,
                id: id,
                sid: window.sessionStorage.getItem("sid")
                // createUserRealName:this.GLOBAL.createUserRealName,
                // createUserName:this.GLOBAL.createUserName,
                // sid:this.GLOBAL.sid
              },
              {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              }
            )
            .then(({ data }) => {
              console.log(data);
              this.$message({
                type: "success",
                message: "设置成功!"
              });
              this.getDataList();
            });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    }
  }
};
</script>
