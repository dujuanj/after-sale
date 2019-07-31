<template>
  <el-dialog
    :title="!dataForm.id ? '新增用户' : '修改用户'"
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
      <el-form-item label="帐号名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" type="text" placeholder="密码" style="width:50%;"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="姓名" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="dataForm.employeeNumber" type="text" placeholder="工号"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="dataForm.position" type="text" placeholder="职位"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="dataForm.sex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-select v-model="roleIdList" multiple placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">冻结</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item  size="mini" style="position:absolute;top:80px;right:70px">
        <!-- <el-upload
          class="avatar-uploader"
           accept="image/*"
            list-type="picture-card"
             name="uploadFile"
          :http-request="httpRequest"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-preview="handlePictureCardPreview"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
         <el-upload
          
            accept="image/*"
            
            list-type="picture"
            name="uploadFile"
            :file-list="picList"
            :http-request="httpRequest"
            :on-remove="handleRemove"
            limit= '1'
            
          >
           
            <el-button size="small" type="primary">点击上传头像</el-button>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
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
      roleIdList: [],
      imageUrl: "",
      imgurlbase:'',
      dialogImageUrl: '',
      dialogVisible: false,
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
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
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
        this.dataForm={}
        // this.dataForm=[];
        // this.roleIdList=[];
      }
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
          this.dataListLoading = false;
        })
        .catch(res => {
          console.log("err");
        });
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
                    message: data.data.errorMsg,
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
                    this.$http_
                      .post(
                        this.GLOBAL.baseUrl + "/user.grant.role",
                        {
                          sid: window.sessionStorage.getItem("sid"),
                          userId: userId,
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
                             this.$emit("refreshDataList");
                            this.visible=false;
                          }
                        });
                      });
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
    //图片上传转流
    httpRequest(file) {
      console.log(file.file);
      console.log(file.url);
      var reader = new FileReader();
      reader.readAsDataURL(file.file);
     
      reader.onload = e => {
        var imgurlbase = e.target.result.split(",");
        imgurlbase.shift();
        imgurlbase = imgurlbase.toString();
        console.log(imgurlbase);
        this.imgurlbase=imgurlbase;
         this.imageUrl = imgurlbase;
      };
    },
    // 删除图片
    handleRemove(file) {
      console.log(file);
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/pic.delete",
          {
            id: ""
            // createUserRealName:this.GLOBAL.createUserRealName,
            // sid:this.GLOBAL.sid
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data);
        });
    },
    // 上传用户头像
    picupload(imgurlbase) {
      var params = new URLSearchParams();
      //  params.append('worksheetId', '2');  
      params.append('filePostfix', '.jpg');  
      params.append('type', 3);
       params.append('sid', window.sessionStorage.getItem('sid'));
      params.append('picData', imgurlbase); 
      // params.append('ownerUserId', 36);
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/pic.upload",
          params,
          {
            headers: {
              // "Content-Type": "application/json;charset=UTF-8"
            },
             dataType: "form"
          }
        )
        .then(({ data }) => {
          console.log(data.data);
          // this.imageUrl=data.data;
        });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      console.log(file);
    },
    handlePictureCardPreview(file) {
       this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    
    }
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
