<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
     
        <el-button v-if="isAuth('/api/postsale/product/add')" type="primary" @click="addOrUpdateHandle()">新增</el-button> 
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form> <br>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="productName" header-align="center" align="center" width="80" label="产品名称"></el-table-column>
      <el-table-column prop="productModel" header-align="center" align="center" label="产品型号"></el-table-column>
     
      <el-table-column prop="provider" header-align="center" align="center" label="供应商"></el-table-column>
     
     
     
      <el-table-column fixed="right" header-align="center" align="center" width="220" label="操作">
        <template slot-scope="scope">
         
          <el-button
            v-if="isAuth('/api/postsale/product/delete')"
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
import AddOrUpdate from "./producttype-update-add";
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
     
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
    this.getRole();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/product/list",
          {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            sid: window.sessionStorage.getItem("sid"),
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
    getRole() {
      // 查询角色
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/role.query",
          { sid: window.sessionStorage.getItem("sid") },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res);
          if (res.status == "200") {
            console.log(res);
            console.log(res.data);
            console.log(res.data.data);
            this.options = res.data.data;
          }
        })
        .catch(res => {
          console.log("err");
        });
    },
    reset() {
      (this.userName = ""),
        (this.realName = ""),
        (this.phone = ""),
        (this.roleList = "");
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
          this.GLOBAL.baseUrlxg + "/product/delete",
          {
            id:id,
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
                message: res.data.isSuccess=="true" ? "操作成功" : res.data.errorMsg,
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
