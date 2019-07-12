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
          node-key="id"
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
      roleId: "",
      arrs: [],
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
            // this.$refs.menuListTree.setCheckedKeys([]);
            // console.log(this.$refs.menuListTree.setCheckedKeys([]))
            console.log(this.$refs.menuListTree.getCheckedKeys());
          });
        });
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
              this.roleId = data.data.roleId;
              this.arrs = this.uniqueArr(
                this.$refs.menuListTree.getCheckedKeys(),
                this.$refs.menuListTree.getHalfCheckedKeys()
              ); //角色权限id
            })
            .then(() => {
              // 为角色授权
              if (this.roleId) {
                console.log(this.arrs);
                this.$http_
                  .post(
                    this.GLOBAL.baseUrl + "/role.grant.resource",
                    {
                      sid: window.sessionStorage.getItem("sid"),
                      roleId: this.roleId,
                      resourceIdList: this.arrs
                    },
                    {
                      headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                      }
                    }
                  )
                  .then(({ data }) => {
                    console.log(data.isSuccess);
                    if (data.isSuccess == "true") {
                      this.$message({
                        message: "操作成功",
                        type: "success",
                        duration: 1500,
                        onClose: () => {
                          this.visible = false;
                          this.$emit("refreshDataList");
                        }
                      });
                    }else{
                      this.$message({
                        message: data.errorMsg,
                        type: "success",
                        duration: 1500,
                        onClose: () => {
                          this.visible = false;
                          this.$emit("refreshDataList");
                        }
                      });
                    }
                  });
              }
            });
        }
      });
    },
    uniqueArr(arr1, arr2) {
      arr1.push(...arr2); //或者arr1 = [...arr1,...arr2]
      //去重
      let arr3 = Array.from(new Set(arr1)); //let arr3 = [...new Set(arr1)]
      console.log(arr3);
      return arr3;
    }
  }
};
</script>
