<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="detail">
        <el-input v-model="dataForm.detail" placeholder="角色描述"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="true"
          show-checkbox
        ></el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "childList"
      },
      dataForm: {
        sid: window.sessionStorage.getItem("sid"),
        name: "",
        detail: ""
      },
      dataRule: {
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      // 查询系统中所有资源,用于授权
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
            this.$refs.menuListTree.setCheckedKeys([]);
          });
        });
      // this.$http({
      //   url: this.$http.adornUrl('/sys/menu/list'),
      //   method: 'get',
      //   params: this.$http.adornParams()
      // }).then(({data}) => {
      //   this.menuList = treeDataTranslate(data, 'menuId')
      // }).then(() => {
      //   this.visible = true
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].resetFields()
      //     this.$refs.menuListTree.setCheckedKeys([])
      //   })
      // }).then(() => {
      //   if (this.dataForm.id) {
      //     this.$http({
      //       url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
      //       method: 'get',
      //       params: this.$http.adornParams()
      //     }).then(({data}) => {
      //       if (data && data.code === 0) {
      //         this.dataForm.roleName = data.role.roleName
      //         this.dataForm.remark = data.role.remark
      //         var idx = data.role.menuIdList.indexOf(this.tempKey)
      //         if (idx !== -1) {
      //           data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
      //         }
      //         this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
      //       }
      //     })
      //   }
      // })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        // 新建角色并授权
        if (valid) {
          this.$http_
            .post(this.GLOBAL.baseUrl + "/role.add", this.dataForm, {
              headers: {
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(({ data }) => {
              console.log(data);
              console.log(data.data);
              var roleId = data.data.roleId;
            })
            .then(() => {
              // 为角色授权
              if (roleId) {
                this.$http_
                  .post(this.GLOBAL.baseUrl + "/role.grant.resource", this.dataForm, {
                    headers: {
                      "Content-Type": "application/json;charset=UTF-8"
                    }
                  })
                  .then(({ data }) => {
                    console.log(data.isSuccess);
                    this.$message({
                      message: "操作成功",
                      type: "success",
                      duration: 1500,
                      onClose: () => {
                        this.visible = false;
                        this.$emit("refreshDataList");
                      }
                    });
                  });
              }
            });
        }
      });
    }
  }
};
</script>
