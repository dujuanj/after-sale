<template>
  <el-dialog
    :title="!dataForm.id ? '新增批次' : '修改用户'"
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
      <el-form-item label="生产批号" prop="batchNumber">
        <el-input v-model="dataForm.batchNumber" placeholder="生产批号" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="产品" prop="password">
        <el-input v-model="dataForm.password" type="text" placeholder="密码" style="width:50%;"></el-input>
      </el-form-item>

      <el-form-item label="生产厂商" prop="email">
        <el-input v-model="dataForm.manufacturer" placeholder="生产厂商" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="生产监督" prop="realName">
        <el-input v-model="dataForm.supervisioner" placeholder="多个监督人以逗号 , 隔开" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="phone">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from "@/utils/validate";
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("确认密码不能为空"));
      } else if (this.dataForm.password !== value) {
        callback(new Error("确认密码与密码输入不一致"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      options: "",
    
      dataForm: {
        // id: 0,
        userName: "",
        password: "123456",
        realName: "",
        employeeNumber: "",
        email: "",
        position: "",
        status: 1,
        sex: "女",
        phone: ""
      },
      dataRule: {
        batchNumber: [
          { required: true, message: "产品批次不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ]
      },
      newform: false //新建
    };
  },
  methods: {
    init(id, datas) {
      this.dataForm.id = id || 0;
      this.dataForm.sid = window.sessionStorage.getItem("sid");
      this.visible = true;
      console.log(datas);
      if (datas != undefined) {
        //修改
        this.roleIdList = [];
        this.dataForm = datas;
        // this.roleIdList=datas.roleList
        datas.roleList.forEach((val, index, val_arr) => {
          console.log(val.id);
          this.roleIdList.push(val.id);
        });
        this.newform = false;
      } else {
        //新建
        this.newform = true;
        // this.dataForm=[];
        // this.roleIdList=[];
      }
     
    },
    // 表单提交
    dataFormSubmit() {
      if (this.newform == true) {
        console.log(this.roleIdList);
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            // 新建用户
            this.$http_
              .post(this.GLOBAL.baseUrl + "/user.add", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                if (data.data.isSuccess == "false") {
                  this.$message({
                    message: data.errorMsg,
                    type: "success",
                    duration: 1500,
                    onClose: () => {
                     this.$emit("refreshDataList");
                     this.visible=false;
                    }
                  });
                } else {                 
                  console.log(data);
                  console.log(data.data.userId);
                  this.picupload(this.imgurlbase);
                  var userId = data.data.userId; //新建用户的用户id
                  // 为新建用户添加角色
                  if (
                    data.data.userId != "" ||
                    data.data.userId != null ||
                    data.data.userId != undefined
                  ) {
                    
                  }
                }
              });
          }
        });
      } else {
        this.dataForm.sid = window.sessionStorage.getItem("sid");
        this.$refs["dataForm"].validate(valid => {
          //修改用户帐号列表
          if (valid) {
            this.$http_
              .post(this.GLOBAL.baseUrl + "/user.update", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data.isSuccess);
                // 为用户修改角色
                this.$http_
                  .post(
                    this.GLOBAL.baseUrl + "/user.grant.role",
                    {
                      sid: window.sessionStorage.getItem("sid"),
                      userId: this.dataForm.id,
                      roleIdList: this.roleIdList
                    },
                    {
                      headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                      }
                    }
                  )
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
              });
       
          }
        });
      }
    },
  
  }
};
</script>

<style lang="scss">
.el-dialog {
  width: 40%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
