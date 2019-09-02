<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <!-- <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input> -->
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="getDataList()">查询</el-button> -->
        <el-button v-if="isAuth('/api/postsale/role.add')" type="primary" size="mini"  icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
        <!-- <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
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
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="角色名称"></el-table-column>
      <el-table-column prop="detail" header-align="center" align="center" label="角色描述"></el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="210"
        label="创建时间"
      ></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('/api/postsale/role.update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id,scope.row)"
          >配置</el-button>
          <el-button
            v-if="isAuth('/api/postsale/role.delete')"
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"  v-bind:menuList='menuList'></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./role-add-or-update";
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      dataForm: {
        roleName: ""
      },
      dataList: [],
       menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "childList"
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
       tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
    this.searchAll();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/role.query",
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
          console.log(res);
          if (res.status == "200") {
            console.log(res.data.data);
            this.dataList = res.data.data;
            console.log(this.dataList);
            // this.totalPage = res.data.data.total;
          }
          this.dataListLoading = false;
        })
        .catch(res => {
          console.log("err");
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
    addOrUpdateHandle(id,datas) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        
        this.$refs.addOrUpdate.init(id, datas);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.roleId;
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
          this.$http_
            .post(
              this.GLOBAL.baseUrl + "/role.delete",
              {
                sid: window.sessionStorage.getItem("sid"),
                id:id
              },
              {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              }
            )
            .then(({ data }) => {
              console.log(data.isSuccess);
              if(data.isSuccess=='true'){
                this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                  this.visible = false;
                }
              });
              }else{
                this.$message({
                message: data.errorMsg,
                type: "success",
                duration: 1500,
                onClose: () => {
                   this.getDataList();
                  this.visible = false;
                }
              });
              }
              
            });
        })
        .catch(() => {});
    },
    // 查询所有资源，用于授权
    searchAll(){
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/resource.queryAll",
          {
            sid: window.sessionStorage.getItem("sid")
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data.menuList);
          var data = data.data.menuList;
          this.menuList = data;
          // this.menuList = treeDataTranslate(data, 'id')
          console.log(this.menuList);
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
            // this.$refs.menuListTree.setCheckedKeys([]);
            // console.log(this.$refs.menuListTree.setCheckedKeys([]))
            // console.log(this.$refs.menuListTree.getCheckedKeys());
          });
        });
    },
  }
};
</script>
