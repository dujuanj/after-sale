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
      <el-button @click="closeDailog()">取消</el-button>
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
      // menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "childList"
      },
      roleId: "",
      arrs: [],
      dataForm: {},
      dataRule: {
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]
      },
      newForm: true,
      checkedkeys: "",
      tree: "",

      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    };
  },

  props: {
    menuList: {
      type: Array,
      required: true
    }
  },
  methods: {
    init(id, datas) {
      // this.dataForm.id = id || 0;
      this.visible = true;
      console.log(datas);

      this.dataForm = datas;

      if (datas != undefined) {
        // 修改
        this.newForm = false;
        // this.searchAll(id);
        // this.checkedkeys=datas.resourceList;
        console.log(this.dataForm);
        // console.log(JSON.stringify(this.dataForm.resourceList) );
        //  console.log(typeof(JSON.stringify(this.dataForm.resourceList)) )
        //  this.$refs.menuListTree.setCheckedKeys(JSON.parse(JSON.stringify(this.dataForm.resourceList)));
        // //  this.checkedkeys=(JSON.stringify(this.dataForm.resourceList)).split(',')
        // // this.checkedkeys=JSON.parse(JSON.stringify(this.dataForm.resourceList));
        // console.log(this.checkedkeys);
        // console.log(this.checkedkeys.length);
         this.$nextTick(() => {
           console.log(this.$refs.menuListTree);
            this.$refs.menuListTree.setCheckedKeys(this.dataForm.resourceList); 
      });
        this.searchAll()
        // this.checkedkeys=this.dataForm.resourceList
      } else {
        this.dataForm = {};
        this.newForm = true;
      }
      // 查询系统中所有资源,用于授权
    },
    closeDailog() {
      this.visible = false;
      this.checkedkeys = [];
    },
    //  查询某个用户，所拥有的全部权限（菜单、命令等）
    searchAll() {
      console.log(this.$refs.menuListTree);
      this.$refs.menuListTree.setCheckedKeys(this.dataForm.resourceList);
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (this.newForm == true) {
          // 新建角色并授权
          this.dataForm.sid=window.sessionStorage.getItem('sid');
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
                this.arrs=this.$refs.menuListTree.getCheckedKeys(true);
                // this.arrs = this.uniqueArr(
                //   this.$refs.menuListTree.getCheckedKeys(true),
                //   this.$refs.menuListTree.getHalfCheckedKeys()
                // ); //角色权限id
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
                      } else {
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
        } else {
          // 修改角色
          this.dataForm.sid = window.sessionStorage.getItem("sid");
          this.$http_
            .post(this.GLOBAL.baseUrl + "/role.update", this.dataForm, {
              headers: {
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(({ data }) => {
              console.log(data);
              this.arrs=this.$refs.menuListTree.getCheckedKeys(true);
              // this.roleId = data.data.id;
              // this.arrs = this.uniqueArr(
              //   this.$refs.menuListTree.getCheckedKeys(true),
              //   this.$refs.menuListTree.getCurrentKey()
              // ); //角色权限id
            })
            .then(() => {
              // 为角色授权
              // if (this.roleId) {
              console.log(this.arrs);
              this.$http_
                .post(
                  this.GLOBAL.baseUrl + "/role.grant.resource",
                  {
                    sid: window.sessionStorage.getItem("sid"),
                    roleId: this.dataForm.id,
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
                  } else {
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
