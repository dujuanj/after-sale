<template>
  <el-dialog
    :title="!dataForm.id ? '新增维修单' : '修改维修单'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="130px"
    >
      <el-form-item label="上门人员姓名" prop="productName">
        <el-input v-model="dataForm.serviceUserRealName" placeholder="问题描述" style="width:50%;"></el-input>
      </el-form-item>

      <el-form-item label="上门人员用户名" prop="productModel">
        <el-input v-model="dataForm.serviceUserName" placeholder="问题描述" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="服务类型" prop="provider">
        <el-select v-model="dataForm.serviceType" placeholder="请选择服务类型">
             <el-option label="电话支持" value="1"></el-option>
             <el-option label="上门解决" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务预约时间类型" prop="remark">
         <el-select v-model="dataForm.serviceAppointmentTimeType" placeholder="请选择服务预约时间类型">
             <el-option label="随时上门" value="1"></el-option>
             <el-option label="具体时间" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务预约上门时间" prop="remark">
        <!-- <el-input v-model="dataForm.serviceAppointmentTime" placeholder="创建人"></el-input> -->
         <el-date-picker
           v-model="dataForm.serviceAppointmentTime"
           type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
           placeholder="选择日期时间">
         </el-date-picker>
      </el-form-item>
       <el-form-item label="服务情况" prop="provider">
        <el-select v-model="dataForm.serviceStatusType" placeholder="请选择服务的情况">
             <el-option label="修好了" value="5"></el-option>
             <el-option label="修不了" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务结束时间" prop="remark">
        <el-date-picker
          v-model="dataForm.serviceFinishTime"
          type="datetime"
          placeholder="选择日期时间"
          
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
       <el-form-item label="工单状态" prop="provider">
        <el-select v-model="dataForm.worksheetStatus" placeholder="请选择服务的情况">
             <el-option label="新建完成" value="1"></el-option>
             <el-option label="已分派" value="2"></el-option>
              <el-option label="执行中" value="3"></el-option>
             <el-option label="工单关闭" value="4"></el-option>
              <el-option label="已回访" value="5"></el-option>
           
        </el-select>
      </el-form-item>
       <el-form-item label="服务备注" prop="provider">
         <el-input type="textarea" v-model="dataForm.serviceStatusDetail"></el-input>
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
      optionss: "",
      productTime: "",

      dataForm: {
        sid:window.sessionStorage.getItem('sid')
      },
      dataRule: {
        // productName: [
        //   { required: true, message: "产品名称不能为空", trigger: "blur" }
        // ],

        // productModel: [
        //   { required: true, message: "产品型号不能为空", trigger: "blur" }
        // ]
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
      // this.dataForm.id = id || 0;
      // this.dataForm.sid = window.sessionStorage.getItem("sid");
      this.visible = true;
      console.log(datas);
      this.producttype();
      if (datas != undefined) {
        //修改

        this.dataForm = datas;
        // this.dataForm.createTime=new Date(datas.createTime).getTime();
        // console.log(this.dataForm);
        this.newform = false;
      } else {
        //新建
        this.newform = true;
        this.dataForm = {};
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.dataForm.sid=window.sessionStorage.getItem('sid');
      if (this.newform == true) {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            //新增知识库
            this.$http_
              .post(this.GLOBAL.baseUrl + "/repair.add", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data);
                if (data.isSuccess == "false") {
                  this.$message({
                    message: data.errorMsg,
                    type: "success",
                    duration: 1500,
                    onClose: () => {
                      this.$emit("refreshDataList");
                      this.visible = false;
                    }
                  });
                } else {
                  this.$message({
                    message: "新建成功",
                    type: "success",
                    duration: 1500,
                    onClose: () => {
                      this.$emit("refreshDataList");
                      this.visible = false;
                    }
                  });
                }
              });
          }
        });
      } else {
        // 修改
        this.$http_
          .post(this.GLOBAL.baseUrl + "/repair.update", this.dataForm, {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          })
          .then(({ data }) => {
            console.log(data);
            if (data.isSuccess == "false") {
              this.$message({
                message: data.errorMsg,
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.$emit("refreshDataList");
                  this.visible = false;
                }
              });
            } else {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.$emit("refreshDataList");
                  this.visible = false;
                }
              });
            }
          });
      }
    },
    // 新增产品
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    // 删除产品
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    // 产品类型
    producttype() {
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/product/name.list",

          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res.data.data);
          this.options = res.data.data;
        })
        .catch(res => {
          console.log("err");
        });
    },
    //  查询产品编号
    modellist(val) {
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/product/model.list",
          {
            productName: val
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res.data.data);
          this.optionss = res.data.data;
        })
        .catch(res => {
          console.log("err");
        });
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
