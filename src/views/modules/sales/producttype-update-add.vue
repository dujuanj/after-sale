<template>
  <el-dialog
    :title="!dataForm.id ? '新增产品' : '修改产品'"
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
      <el-form-item label="产品名称" prop="productTypeName">
        <el-input v-model="dataForm.productTypeName" placeholder="产品名称" style="width:50%;"></el-input>
      </el-form-item>
       <el-form-item label="产品类型" >
        <el-input v-model="dataForm.productType" placeholder="输入数字 1-5" style="width:50%;"></el-input>
      </el-form-item>
     
      <el-form-item label="产品型号" prop="productModel">
        <el-input v-model="dataForm.productModel" placeholder="产品型号" style="width:50%;"></el-input>
      </el-form-item>
      
      <el-form-item label="备注" prop="remark">
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
      productTime: "",

      dataForm: {
        // id: 0,
        // productName: "",
        // productModel: "",
        // provider: "",
        // Remark: "",
       
      },
      dataRule: {
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],

        productModel: [
          { required: true, message: "产品型号不能为空", trigger: "blur" },
          
        ],
         provider: [
          { required: true, message: "供应商不能为空", trigger: "blur" }
        ],
      },
      newform: false, //新建
      dynamicValidateForm: {
        domains: [
          {
            value: ""
          }
        ]
      }
    };
  },
  methods: {
    init(id, datas) {
      console.log(id);
      this.dataForm.id = id ;
      this.dataForm.sid = window.sessionStorage.getItem("sid");
      this.visible = true;
      console.log(this.dataForm.id)
      console.log(datas);
      if (datas != undefined) {
        //修改

        this.dataForm = datas;
      
        this.newform = false;
      } else {
        //新建
        this.newform = true;
        this.dataForm={}
 
      }
    },
    // 表单提交
    dataFormSubmit() {
      if (this.newform == true) {
     
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            // 添加产品
            this.$http_
              .post(this.GLOBAL.baseUrlxg + "/product/add", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data)
                 this.$message({
                    message: data.errorMsg,
                    type: "success",
                    duration: 1500,
                    onClose: () => {
                      this.$emit("refreshDataList");
                      this.visible = false;
                    }
                  });
                
              });
          }
        });
      } else {
        this.dataForm.sid = window.sessionStorage.getItem("sid");
        this.$refs["dataForm"].validate(valid => {
          //修改用户帐号列表
          if (valid) {
            this.$http_
              .post(this.GLOBAL.baseUrlxg + "/product/update", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                this.$message({
                    message: data.errorMsg,
                    type: "success",
                    duration: 1500,
                    onClose: () => {
                      this.$emit("refreshDataList");
                      this.visible = false;
                    }
                  });
                
              });
          }
        });
      }
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
