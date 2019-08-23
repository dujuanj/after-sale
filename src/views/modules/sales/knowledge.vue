<template>
  <div class="mod-knowledge">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
       <el-row :gutter="12" class="marbot_15">
      <el-col :span="2">
        <el-card shadow="always">
          初柜
          <br />
          <span style="color:#409EFF;font-size:24px;">{{countDatas.firstCabinet}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
       2层屉柜<br />
          <span style="color:#F56C6C;font-size:24px;">{{countDatas.drawerCabinet2}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          3层屉柜
          <br />
          <span style="color:#E6A23C;font-size:24px;">{{countDatas.drawerCabinet3}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="hover">
          智能门禁
          <br />
          <span style="color:#606266;font-size:24px;">{{countDatas.accessControl}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          抽屉锁
          <br />
          <span style="color:#909399;font-size:24px;">{{countDatas.cabinetLcock}}</span>
        </el-card>
      </el-col>
      <el-col :span="2">
        <el-card shadow="always">
          蓝牙锁
          <br />
          <span style="color:#67C23A;font-size:24px;">{{countDatas.bluetoothLcock}}</span>
        </el-card>
      </el-col>
    </el-row> <br>
      <el-form-item>
        <el-form-item>
           <el-select
          v-model="productType"
          placeholder="请选择产品"
          @change="getDataList()"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.productType==1?'初柜':item.productType==2?'2层屉柜':item.productType==3?'3层屉柜':item.productType==4?'门禁':item.productType==5?'门锁':''"
            :value="item.productType"
          ></el-option>
        </el-select>
        </el-form-item> 
        <el-form-item>
          <el-input v-model="fullQuery" placeholder="输入问题描述／解决办法查询" clearable  style="width:333px;"></el-input>
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
        <el-button @click="getDataList()">查询</el-button>
        <el-button icon="el-icon-document" @click="reset()">重置</el-button>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
        
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item> <br>
       <el-button v-if="isAuth('/api/postsale/knowledge/add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
    </el-form>
    <br />
   
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
      <el-table-column
        
        header-align="center"
        align="center"
        width="80"
        label="产品名称"
      >
       <template slot-scope="scope">
         {{scope.row.productType==1?'初柜':scope.row.productType==2?'2层屉柜':scope.row.productType==3?'3层屉柜':scope.row.productType==4?'门禁':scope.row.productType==5?'门锁':''}}
       </template>
      </el-table-column>
      <el-table-column prop="productModel" header-align="center" align="center" label="产品型号"></el-table-column>

      <el-table-column prop="question" header-align="center" align="center" label="问题描述"></el-table-column>
      <el-table-column prop="answer" header-align="center" align="center" label="解决方法"></el-table-column>
      <el-table-column prop="createUserName" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="220" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
           
            @click="detail(scope.row.id,scope.row)"
          >详情</el-button>
          <el-button
            v-if="isAuth('/api/postsale/knowledge/update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id,scope.row)"
          >修改</el-button>
          <el-button
            v-if="isAuth('/api/postsale/knowledge/delete')"
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./knowledge-update-add";
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
      dataListSelections: [],
      addOrUpdateVisible: false,
      options:'',
      productName:'',
      createUserName:'',
      fullQuery:'',
      value1:[],
      countDatas:''
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
    this.producttype();
    this.getCount()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/knowledge/list",
          {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            sid: window.sessionStorage.getItem("sid"),
            productType:this.productType,
            startTime:this.value1[0],
            endTime:this.value1[1],
            fullQuery:this.fullQuery
           
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
   
    reset() {
      this.productType='';
      this.value1=[];
      this.fullQuery='';
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
          // 删除
          this.$http_
            .post(
              this.GLOBAL.baseUrlxg + "/knowledge/delete",
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
                message: "操作成功",
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
    detail(id, detailDatas) {
      console.log(id);
      this.$router.push({
        name: "knowledge-detail",
        params: { id: id, detailDatas: detailDatas }
      });
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
    getCount(){
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/knowledge/count",
          {
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
          this.countDatas = res.data.data;
        })
        .catch(res => {
          console.log("err");
        });
    }
  }
};
</script>
