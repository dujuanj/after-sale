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
       <el-form-item label="生产批号" prop="batchNumber">
        <el-input v-model="dataForm.batchNumber" placeholder="生产批号"></el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="dataForm.productName" placeholder="产品名称" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="产品型号" prop="productModel">
        <el-input v-model="dataForm.productModel" type="text" placeholder="产品型号" style="width:50%;"></el-input>
      </el-form-item>

      <el-form-item label="Mac码" prop="mac">
        <el-input v-model="dataForm.mac" placeholder="Mac码" style="width:50%;"></el-input>
      </el-form-item>
        <el-form-item label="备注">
        <el-input v-model="dataForm.remark" type="text" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="生产时间" prop="productTime">
        <!-- <el-input v-model="dataForm.productTime" placeholder="生产时间" style="width:50%;"></el-input> -->
         <el-date-picker
      v-model="dataForm.productTime"
      type="datetimerange"
      align="right"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['12:00:00', '08:00:00']"
      value-format='timestamp'
      disabled
      >
    </el-date-picker>
      </el-form-item>
     
      <el-form-item label="生产厂家">
        <el-input v-model="dataForm.manufacturer" type="text" placeholder="生产厂家工号" disabled></el-input>
      </el-form-item>
      <el-form-item label="生产监督">
        <el-input v-model="dataForm.supervisioner" type="text" placeholder="生产监督" disabled></el-input>
      </el-form-item>
      <el-form-item label="售出时间">
        <!-- <el-input v-model="dataForm.saleTime" type="text" placeholder="售出时间"></el-input> -->
         <el-date-picker
      v-model="dataForm.saleTime"
      type="datetime"
      placeholder="选择日期时间"
      default-time="12:00:00"
      value-format='timestamp' disabled>
    </el-date-picker>
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
   
    return {
      visible: false,
   
      dataForm: {
        // id: 0,
        productName: "",
        productModel: "",
        mac: "",
        productTime: "",
        batchNumber: "",
        manufacturer: "",
        supervisioner:'',
        saleTime:''
      },
      dataRule: {
        batchNumber: [
          { required: true, message: "产品批号不能为空", trigger: "blur" }
        ]
      
       
      
      },
      newform: false //新建
    };
  },
  methods: {
    init(id, datas) {
      // this.dataForm.id = id || 0;
      this.dataForm.sid = window.sessionStorage.getItem("sid");
      this.visible = true;
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
            // 新建用户
            this.$http_
              .post(this.GLOBAL.baseUrlxg + "/productinfo/add", this.dataForm, {
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
