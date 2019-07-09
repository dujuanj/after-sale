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
        <el-input v-model="dataForm.password" type="password" placeholder="密码" style="width:50%;"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="姓名" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="工号" >
        <el-input v-model="dataForm.employeeNumber" type="text" placeholder="工号"></el-input>
      </el-form-item>
      <el-form-item label="职位" >
        <el-input v-model="dataForm.position" type="text" placeholder="职位"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="mobile">
        <el-radio-group v-model="dataForm.sex">
          <el-radio  label= "男" >男</el-radio>
          <el-radio  label= "女" >女</el-radio>
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
      <el-form-item  style='position:absolute;top:50px;right:50px'>
         <el-upload
            action
            accept="image/*"
            :multiple="false"
            list-type="picture-card"
            name="uploadFile"
            :file-list="picList"
            :http-request="httpRequest"
            :on-remove="handleRemove"
            :show-file-list="true"
            limit="1"
          >
            <i class="el-icon-plus"></i>
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
      dataForm: {
        // id: 0,
        userName: "",
        password: "",
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
      newform: true
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      // this.$http({
      //   url: this.$http.adornUrl('/sys/role/select'),
      //   method: 'get',
      //   params: this.$http.adornParams()
      // }).then(({data}) => {
      //   this.roleList = data && data.code === 0 ? data.list : []
      // }).then(() => {
      //   this.visible = true
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].resetFields()
      //   })
      // }).then(() => {
      //   if (this.dataForm.id) {
      //     // this.$http({
      //     //   url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
      //     //   method: 'get',
      //     //   params: this.$http.adornParams()
      //     // }).then(({data}) => {
      //     //   if (data && data.code === 0) {
      //     //     this.dataForm.userName = data.user.username
      //     //     this.dataForm.salt = data.user.salt
      //     //     this.dataForm.email = data.user.email
      //     //     this.dataForm.mobile = data.user.mobile
      //     //     this.dataForm.roleIdList = data.user.roleIdList
      //     //     this.dataForm.status = data.user.status
      //     //   }
      //     // })
      //   }
      // })
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/role.query",
          {},
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
                console.log(data);
                 if (res.status == "200") {
                   alert('true')
                 }
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
      }else{

      }
    }
  }
};
</script>

<style lang="scss">
.el-dialog {
  width: 40%;
}
.el-upload--picture-card{
  width:200px;
  height: 200px;
  line-height: 200px;
}
</style>
