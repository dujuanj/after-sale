<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
     
       <el-form-item>
        <el-select v-model="productType" placeholder="请选择产品类型" @change="getDataList()">
          <el-option
            v-for="item in options"
            :key="item.id"
             :label="item.productType==1?'初柜':item.productType==2?'二层屉柜':item.productType==3?'三层屉柜':item.productType==4?'门禁':item.productType==5?'门锁':item.productType==6?'保管柜':''"
            :value="item.productType"
          ></el-option>
        </el-select>
      </el-form-item>
       <el-form-item>
        <el-select v-model="provider" placeholder="请选择生产厂商" @change="getDataList()">
          <el-option
            v-for="item in manufacturerdatas"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
       <el-form-item>
        <el-input v-model="fullQuery" placeholder="输入Mac地址 ／生产批号查询" clearable  style="width:333px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  size="mini"  @click="getDataList(pageIndex=1)">查询</el-button>
        <el-button size="mini" icon="el-icon-document" @click="reset()">重置</el-button>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
      <br />
      <el-form-item>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <el-button
      v-if="isAuth('/api/postsale/productinfo/add')"
      type="primary"
      @click="addOrUpdateHandle()"
      style="margin-bottom:15px;"
      size="mini"
      icon="el-icon-plus" 
    >新增产品</el-button>
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      <!-- 导入 -->
     <el-button
      type="primary"
      v-if="isAuth('/api/postsale/worksheet.add')"
      icon="el-icon-download"
      size="mini"
        @click="importandexportHandle('产品列表导入','https://sale.zeepson.com/api/product/productinfo/import')"
      class="marbot_15"
    >导入</el-button>
    <!-- 导出 -->
     <el-button
      type="primary"
      v-if="isAuth('/api/postsale/worksheet.add')"
      icon="el-icon-upload2"
      size="mini"
       @click="importandexportHandle('产品列表导出')"
      class="marbot_15"
    >导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
       <el-table-column fixed label="序号" width="50" align="center">
        <template scope="scope">
          <span>{{(pageIndex-1)*10+(scope.$index + 1)}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="mac" header-align="center" align="center" label="Mac码"></el-table-column>
      <el-table-column  header-align="center" align="center" width="80" label="产品类型">
           <template slot-scope="scope">
         {{scope.row.productType==1?'初柜':scope.row.productType==2?'2层屉柜':scope.row.productType==3?'3层屉柜':scope.row.productType==4?'门禁':scope.row.productType==5?'门锁':''}}
       </template>
      </el-table-column>
      <el-table-column prop="productModel" header-align="center" align="center" label="产品型号"></el-table-column>
      <el-table-column prop="provider" header-align="center" align="center" width="180" label="生产厂商"></el-table-column>
       <el-table-column prop="batchNumber" header-align="center" align="center" label="生产批号">
      </el-table-column>
      <el-table-column prop="createUserRealName" header-align="center" align="center" label="创建人"></el-table-column>
     <!-- <el-table-column prop="createTime" header-align="center" align="center" width="180" label="创建人"></el-table-column> -->
     
      
      <el-table-column prop="createTime" header-align="center" align="center" width="180" label="创建日期"></el-table-column>
      
      <el-table-column fixed="right" header-align="center" align="center" width="190" label="操作">
        <template slot-scope="scope">
          
           <el-button
            v-if="isAuth('/api/postsale/productinfo/update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id,scope.row)"
          >修改</el-button>
          <el-button
            v-if="isAuth('/api/postsale/productinfo/delete')"
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
    <!-- 导入导出 -->
     <import-and-export
      v-if="exportVisible"
      ref="exportandimport"
      @refreshDataList="getDataList"
    ></import-and-export>
  </div>
</template>

<script>

import AddOrUpdate from "../sales/product-add-update";
import ImportAndExport from './import-and-export'
export default {
  data() {
    return {
      options:'',
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
       exportVisible:false,
      // 查询
      mac: "",
      provider: "",
      supervisioner: "",
      productType:'',
      manufacturerdatas:[
        {
          value: "宁波亚太",
          label: "宁波亚太"
        },
        {
          value: "宁波金泰阁",
          label: "宁波金泰阁"
        }
      ]
    };
  },
  components: {
    AddOrUpdate,
    ImportAndExport
  },
  activated() {
    this.getDataList();
    this.producttype();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/productinfo/list",
          {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            sid: window.sessionStorage.getItem("sid"),
            fullQuery: this.fullQuery,
            provider: this.provider,
           
            productType:this.productType
            
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
    importandexportHandle(flag,importurl){
      
      this.exportVisible = true;
      this.$nextTick(() => {
         this.$refs.exportandimport.init(flag,importurl);
      })
    },
    // 产品类型
   producttype(){
       this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/product/list",
           {
            currentPage: 1,
            pageSize: 10000,
            sid: window.sessionStorage.getItem("sid"),
          
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res.data.data);
          this.options=res.data.data.records;
         
        })
        .catch(res => {
          console.log("err");
        });
   },
    reset() {
     
      this.provider = "",
      this.fullQuery = "",
      this.productType = "";
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
          this.GLOBAL.baseUrlxg + "/productinfo/delete",
          {
            id:id,
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
           
           this.$message({
                message: res.code == "0" ? "操作成功" : '操作失败',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
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
