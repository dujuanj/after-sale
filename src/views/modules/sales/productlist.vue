<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="mac" placeholder="Mac码" clearable></el-input>
      </el-form-item>
     <el-form-item>
        <el-input v-model="manufacturer" placeholder="生产厂家" clearable></el-input>
      </el-form-item>
     <el-form-item>
        <el-input v-model="supervisioner" placeholder="生产监督" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="productName"  placeholder="请选择产品类型">
          <el-option v-for="item in options" :key="item.value" :label="item.productName" :value="item.productName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button icon="el-icon-document" @click="reset()">重置</el-button>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
      <br />
      <el-form-item>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="productName" header-align="center" align="center" width="80" label="产品"></el-table-column>
      <el-table-column prop="productModel" header-align="center" align="center" label="产品型号"></el-table-column>
      <el-table-column prop="mac" header-align="center" align="center" label="Mac码"></el-table-column>
      <el-table-column prop="productTime" header-align="center" align="center" label="生产时间"></el-table-column>
      <el-table-column prop="batchNumber" header-align="center" align="center" label="生产批号">
      </el-table-column>
      <el-table-column prop="manufacturer" header-align="center" align="center" width="180" label="生产厂家"></el-table-column>
       <el-table-column prop="supervisioner" header-align="center" align="center" width="180" label="生产监督"></el-table-column>
      <el-table-column prop="saleTime" header-align="center" align="center" width="180" label="售出时间"></el-table-column>
      
      <el-table-column fixed="right" header-align="center" align="center" width="190" label="操作">
        <template slot-scope="scope">
          
          <!-- <el-button
            v-if="isAuth('sys:user:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id,scope.row)"
          >修改</el-button> -->
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
  </div>
</template>

<script>
import AddOrUpdate from "./product-add-update";
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
      // 查询
      mac: "",
      manufacturer: "",
      supervisioner: "",
      productName:''
    };
  },
  components: {
    AddOrUpdate
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
            mac: this.mac,
            manufacturer: this.manufacturer,
            supervisioner: this.supervisioner,
            productName:this.productName
            
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
    reset() {
      this.mac = "",
      this.manufacturer = "",
      this.supervisioner = "",
      this.productName = "";
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
