<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="userName" placeholder="输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="realName" placeholder="输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="phone" placeholder="输入电话号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="role" placeholder="选择角色" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button icon="el-icon-document" @click="reset()">重置</el-button>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
      <br />
      <el-form-item>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
      <el-table-column prop="password" header-align="center" align="center" width="180" label="密码"></el-table-column>
      <el-table-column
        prop="roleList"
        header-align="center"
        align="center"
        width="180"
        label="用户角色"
      ></el-table-column>
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
          <el-button
            v-if="isAuth('sys:log:list')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
          >登陆日志</el-button>
          <el-button
            v-if="isAuth('sys:user:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
          >修改</el-button>
          <el-button
            v-if="isAuth('sys:user:delete')"
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
      userName:'',
      realName:'',
      phone:'',
      role:''
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
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
            pageSize: this.pageSize
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
            this.totalPage = this.dataList.length;
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
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
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
          this.$http({
            url: this.$http.adornUrl("/sys/user/delete"),
            method: "post",
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
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
                id: id
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
