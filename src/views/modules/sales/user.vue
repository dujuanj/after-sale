<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
       <el-form-item label="角色"  prop="roleIdList">
        <el-select v-model="roleId"  placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="fullQuery" placeholder="输入用户名/用户姓名" clearable></el-input>
      </el-form-item>
     
     
     
      <el-form-item>
        <el-button icon="el-icon-search" type="primary"  size="mini"  @click="getDataList(pageIndex=1)">查询</el-button>
        <el-button icon="el-icon-document" size="mini" @click="reset()">重置</el-button>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
      <br />
      <el-form-item>
        <el-button v-if="isAuth('/api/postsale/user.add')" type="primary" size="mini"  icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
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
      <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
      <el-table-column fixed label="序号" width="50" align="center">
        <template scope="scope">
          <span>{{(pageIndex-1)*10+(scope.$index + 1)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" header-align="center" align="center" width="80" label="用户名"></el-table-column>
      <el-table-column prop="realName" header-align="center" align="center" label="姓名"></el-table-column>
      <el-table-column prop="employeeNumber" header-align="center" align="center" label="工号"></el-table-column>
      <el-table-column prop="position" header-align="center" align="center" label="职位"></el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" label="联系方式">
        <!-- <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>-->
      </el-table-column>
      <!-- <el-table-column prop="password" header-align="center" align="center" width="180" label="密码"></el-table-column> -->
      <el-table-column
        prop="roleList.name"
        header-align="center"
        align="center"
        width="180"
        :show-overflow-tooltip="true"
        label="用户角色"
      >
        <template slot-scope="scope">
          <span v-for="item in scope.row.roleList">{{item.name}} --</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" width="180" label="登录许可">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status==1"
            active-color="#13ce66"
            @change="allowLogin(scope.row.id,scope.row.status)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="190" label="操作">
        <template slot-scope="scope">
          <!-- <el-button
            v-if="isAuth('sys:log:list')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
          >登陆日志</el-button> -->
          <el-button
            v-if="isAuth('/api/postsale/user.update')"
            type="text"
            size="small"
            :disabled="isAble(scope.row.userName)"
            @click="addOrUpdateHandle(scope.row.id,scope.row)"
          >修改</el-button>
          <el-button
            v-if="isAuth('/api/postsale/user.delete')"
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
import AddOrUpdate from "./user-add-or-update";
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
      // 查询
      userName: "",
      realName: "",
      phone: "",
      role: "",
      options: "",
      roleList: [],
      fullQuery:'',
      roleId:'',
      username:window.sessionStorage.getItem('userName')
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
    this.getRole();
    console.log(this.username);
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/user.queryUserAndRoles",
          {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            sid: window.sessionStorage.getItem("sid"),
            fullQuery:this.fullQuery,
            roleId: this.roleId
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
    isAble(name){
        console.log(name);
        return  !(this.username ==name)
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
      this.fullQuery='';
      this.roleId='';
      this.getDataList()
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
          this.GLOBAL.baseUrl + "/user.delete",
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
