<template>
  <el-dialog
    :title="!dataForm.id ? '新增知识库' : '修改知识库'"
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
      <el-form-item label="产品名称" prop="productName">
        <el-select
          v-model="dataForm.productType"
          placeholder="请选择产品"
          @change="modellist(dataForm.productType)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
           :label="item.productType==1?'初柜':item.productType==2?'二层屉柜':item.productType==3?'三层屉柜':item.productType==4?'门禁':item.productType==5?'门锁':item.productType==6?'保管柜':''"
            :value="item.productType"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="产品型号" prop="productModel">
        <el-select v-model="dataForm.productModel" placeholder="产品型号">
          <el-option
            v-for="item in optionss"
            :key="item.value"
            :label="item.productModel"
            :value="item.productModel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述" prop="provider">
        <el-input v-model="dataForm.question" placeholder="问题描述" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="解决方案" prop="remark">
        <el-input v-model="dataForm.answer" placeholder="解决方案"></el-input>
      </el-form-item>
      <!-- <el-form-item label="创建人" prop="remark">
        <el-input v-model="dataForm.createUserName" placeholder="创建人"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="创建日期" prop="remark">
        <el-date-picker
          v-model="dataForm.createTime"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item> -->
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
        // id: 0,
        productName: "",
        productModel: "",
        question: "",
        answer: "",
        createUserName:'',
        createTime:''
      },
      dataRule: {
        // productName: [
        //   { required: true, message: "产品名称不能为空", trigger: "blur" }
        // ],

        productModel: [
          { required: true, message: "产品型号不能为空", trigger: "blur" }
        ]
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
        this.dataForm={}
      }
    },
    // 表单提交
    dataFormSubmit() {
      if (this.newform == true) {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            //新增知识库
            this.dataForm.sid=window.sessionStorage.getItem('sid')
            this.$http_
              .post(this.GLOBAL.baseUrlxg + "/knowledge/add", this.dataForm, {
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
        // 修改知识库
        var datas={};
        datas.productType=this.dataForm.productType;
        datas.productModel=this.dataForm.productModel;
        datas.answer=this.dataForm.answer;
        datas.question=this.dataForm.question;
        datas.sid=window.sessionStorage.getItem('sid');
        datas.id=this.dataForm.id
         this.$http_
              .post(this.GLOBAL.baseUrlxg + "/knowledge/update", datas, {
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
          this.GLOBAL.baseUrlxg + "/product/list",
          {
            currentPage: 1,
            pageSize: 10000,
            sid: window.sessionStorage.getItem("sid")
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res.data.data);
          this.options = res.data.data.records;
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
            productType: val,
            sid:window.sessionStorage.getItem('sid')
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
