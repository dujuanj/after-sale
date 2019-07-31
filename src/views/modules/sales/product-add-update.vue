<template>
  <el-dialog
    :title="!dataForm.id ? '新增产品' : '产品'"
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
        <el-input
          v-model="dataForm.batchNumber"
          placeholder="生产批号"
          
        ></el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <!-- <el-input v-model="dataForm.productName" placeholder="产品名称" style="width:50%;"></el-input> -->
        <el-select
          v-model="dataForm.productName"
          placeholder="请选择产品类型"
          @change="modellist(dataForm.productName)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.productName"
            :value="item.productName"
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

      <el-form-item label="Mac码" prop="mac">
        <el-input v-model="dataForm.mac" placeholder="Mac码" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <!-- <el-input v-model="dataForm.remark" type="text" placeholder="备注" disabled></el-input> -->
        <span>{{dataForm.remark}}</span>
      </el-form-item>
      <el-form-item label="生产时间" prop="productTime">
        <!-- <el-input v-model="dataForm.productTime" placeholder="生产时间" style="width:50%;" disabled></el-input> -->
        <span>{{dataForm.startTime}} -- {{dataForm.endTime}}</span>
        <!-- <el-date-picker
          v-model="dataForm.productTime"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']"
          value-format="timestamp"
          disabled
        ></el-date-picker> -->
      </el-form-item>

      <el-form-item label="生产厂家">
        <!-- <el-input v-model="dataForm.manufacturer" type="text" placeholder="生产厂家工号" disabled></el-input> -->
        <span>{{dataForm.manufacturer}}</span>
      </el-form-item>
      <el-form-item label="生产监督">
        <!-- <el-input v-model="dataForm.supervisioner" type="text" placeholder="生产监督" disabled></el-input> -->
        <span>{{dataForm.supervisioner}}</span>
      </el-form-item>

      <!-- <el-form-item label="售出时间">
      <!-- <el-input v-model="dataForm.saleTime" type="text" placeholder="售出时间"></el-input>-->
      <!-- <el-date-picker
      v-model="dataForm.saleTime"
      type="datetime"
      placeholder="选择日期时间"
      default-time="12:00:00"
      value-format='timestamp' disabled>
    </el-date-picker>
      </el-form-item>-->
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
      getData: "",
      dataForm: {
        // id: 0,
        productName: "",
        productModel: "",
        mac: "",
        productTime: "",
        batchNumber: window.sessionStorage.getItem('batchnumber'),
        manufacturer: "",
        supervisioner: "",
        saleTime: ""
      },
      
      dataRule: {
        batchNumber: [
          { required: true, message: "产品批号不能为空", trigger: "blur" }
        ]
      },
      options: "",
      optionss: "",
      newform: false //新建
    };
  },
  methods: {
    init(id, datas) {
      this.producttype();
      this.getInfo(this.dataForm.batchNumber,datas);
      // this.dataForm.id = id || 0;
      this.dataForm.sid = window.sessionStorage.getItem("sid");
      this.visible = true;
      console.log(datas);
      if (datas != undefined) {
        //修改

        this.dataForm = datas;
        console.log(this.dataForm);
        this.newform = false;
      } else {
        //新建
        this.newform = true;
        this.dataForm = {};
      }
    },
    // 表单提交
    dataFormSubmit() {
      if (this.newform == true) {
        delete this.dataForm.id
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
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.$emit("refreshDataList");
                    this.visible = false;
                  }
                });
                // if (data.data.isSuccess == "false") {
                //   this.$message({
                //     message: data.errorMsg,
                //     type: "success",
                //     duration: 1500,
                //     onClose: () => {
                //      this.$emit("refreshDataList");
                //      this.visible=false;
                //     }
                //   });
                // } else {
                //   console.log(data);

                // }
              });
          }
        });
      } else {
        this.dataForm.sid = window.sessionStorage.getItem("sid");
        this.$refs["dataForm"].validate(valid => {
          //修改用户帐号列表
          if (valid) {
            this.$http_
              .post(this.GLOBAL.baseUrlxg + "/productinfo/update", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                 this.$message({
                  message: "操作成功",
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
    },
    // 生产批号--产品信息
    getInfo(data,datas) {
      console.log(data);
      this.$http_
        .post(
          this.GLOBAL.baseUrlxg + "/productbatch/get",
          {
            batchNumber: data
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data);
          this.dataForm = data.data;

          if(this.newform== false){
            this.dataForm.productName=datas.productName;
            this.dataForm.productModel=datas.productModel;
            this.dataForm.mac=datas.mac
          }
        });
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
