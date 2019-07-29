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
      <el-form-item label="生产批号" >
        <el-input v-model="dataForm.batchNumber" placeholder="生产批号" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="产品" >
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          
        
        >
          <!-- 产品列表  -->
          <el-select v-model="domain.productName" placeholder="请选择产品" @change="modellist(domain.productName)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.productName"
              :value="item.productName"
            ></el-option>
          </el-select>
           <!-- <el-input v-model="domain.productModel" style="width:20%;" placeholder="产品型号"></el-input> -->
          <el-select v-model="domain.productModel" placeholder="产品型号">
            <el-option
              v-for="item in optionss"
              :key="item.value"
              :label="item.product_model"
              :value="item.product_model"
            ></el-option>
          </el-select>
          <!-- 数量 -->
          <el-input v-model="domain.number" style="width:20%;" placeholder="输入数量"></el-input>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-button @click="addDomain" style="margin-top:10px;">新增产品</el-button>
      </el-form-item>
      <el-form-item label="生产时间">
        <el-date-picker
          v-model="productTime"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']"
          value-format="timestamp"
          
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="生产厂商" >
        <el-input v-model="dataForm.manufacturer" placeholder="生产厂商" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="生产监督">
        <el-input v-model="dataForm.supervisioner" placeholder="多个监督人以逗号 , 隔开" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="备注" >
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
      optionss: "",
      productTime: "",
      value: "",
      valuetype: "",

      dataForm: {
        // id: 0,
        batchNumber: "",
       
      },
      dataRule: {
        batchNumber: [
          { required: true, message: "产品批次不能为空", trigger: "blur" }
        ],

        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ]
      },
      newform: false, //新建
      dynamicValidateForm: {
        domains: [
          {
            number: "",
            productModel: "",
            productName: ""
          }
        ]
      }
    };
  },
  methods: {
    init(id, datas) {
        // 产品类型
        this.producttype();
      // this.dataForm.id = id || 0;
      this.dataForm.sid = window.sessionStorage.getItem("sid");
      this.visible = true;
      console.log(datas);
      if (datas != undefined) {
        //修改

        this.dataForm = datas;
        console.log(this.dataForm);
        this.newform = false;
         this.dynamicValidateForm.domains=datas.batchInfoList;
      } else {
        //新建
        this.dataForm={}
        this.newform = true;
       
        console.log(this.dataForm);
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
    },
    // 表单提交
    dataFormSubmit() {
      if (this.newform == true) {
        console.log(this.dynamicValidateForm.domains);        
        this.dataForm.batchInfoList=this.dynamicValidateForm.domains;
        this.dataForm.startTime=this.productTime[0];
        this.dataForm.endTime=this.productTime[1];
        console.log(this.dataForm);
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            // 添加批次
            this.$http_
              .post(this.GLOBAL.baseUrlxg + "/productbatch/add", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data);
              
                  this.$message({
                    message: data.msg,
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
              .post(this.GLOBAL.baseUrlxg + "/productbatch/update", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data);
              });
          }
        });
      }
    },
    // 新增产品
    addDomain() {
      this.dynamicValidateForm.domains.push({
        number: "",
        productName: "",
        productModel: "",
        // key: Date.now()
      });
    },
    // 删除产品
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
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
