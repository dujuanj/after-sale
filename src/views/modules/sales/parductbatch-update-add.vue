<template>
  <el-dialog
    :title="!dataForm.id ? '新增批次' : '修改批次'"
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
      <el-form-item label="生产批号">
        <el-input v-model="dataForm.batchNumber" placeholder="生产批号" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="生产内容">
        <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">
          <!-- 产品列表  -->
          <el-select
            v-model="domain.productType"
            placeholder="请选择产品"
            @change="modellist(domain.productType)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.productType==1?'初柜':item.productType==2?'2层屉柜':item.productType==3?'3层屉柜':item.productType==4?'门禁':item.productType==5?'门锁':''"
            :value="item.productType"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="domain.productModel" style="width:20%;" placeholder="产品型号"></el-input> -->
          <el-select v-model="domain.productModel" placeholder="产品型号">
            <el-option
              v-for="item in optionss"
              :key="item.value"
              :label="item.productModel"
              :value="item.productModel"
            ></el-option>
          </el-select>
          <!-- 数量 -->
          <el-input v-model="domain.count" style="width:20%;" placeholder="输入数量"></el-input>
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
         
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="生产厂商">
        <!-- <el-input v-model="dataForm.manufacturer" placeholder="生产厂商" style="width:50%;"></el-input> -->
          <el-select v-model="dataForm.provider" placeholder="请选择生产厂商" @change="getDataList()">
          <el-option
            v-for="item in manufacturerdatas"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生产监督">
        <el-input v-model="dataForm.supervisioner" placeholder="多个监督人以逗号 , 隔开" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="生产状态">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option
      v-for="item in status"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
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
      manufacturerdatas:[
        {
          value: "宁波亚太",
          label: "宁波亚太"
        },
        {
          value: "宁波金泰阁",
          label: "宁波金泰阁"
        }
      ],
      dataForm: {
        // id: 0,
        batchNumber: ""
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
      },
      status:[{
          value: 1 ,
          label: '未开始生产'
        }, {
          value: 2 ,
          label: '生产中'
        }, {
          value: 3 ,
          label: '生产完成'
        }]
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
        this.dynamicValidateForm.domains = datas.batchInfoList;
        this.productTime=[datas.startTime,datas.endTime]
      } else {
        //新建
        this.productTime=[];
        this.dynamicValidateForm.domains=[ {
            number: "",
            productModel: "",
            productName: ""
          }];
        this.dataForm = {};
        this.newform = true;

        console.log(this.dataForm);
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
            sid: window.sessionStorage.getItem("sid"),
          
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res.data.data);
          this.options=res.data.data.records;
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
            productType: val
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
        this.dataForm.batchInfoList = this.dynamicValidateForm.domains;
        this.dataForm.startTime = this.productTime[0];
        this.dataForm.endTime = this.productTime[1];
        this.dataForm.sid=window.sessionStorage.getItem('sid')
        console.log(this.dataForm);
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            // 添加批次
            this.$http_
              .post(
                this.GLOBAL.baseUrlxg + "/productbatch/add",
                this.dataForm,
                {
                  headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                  }
                }
              )
              .then(({ data }) => {
                console.log(data);

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
        this.dataForm.startTime = this.productTime[0];
        this.dataForm.endTime = this.productTime[1];
        this.dataForm.batchInfoList = this.dynamicValidateForm.domains;
        this.$refs["dataForm"].validate(valid => {
          //修改用户帐号列表
          if (valid) {
            this.$http_
              .post(
                this.GLOBAL.baseUrlxg + "/productbatch/update",
                this.dataForm,
                {
                  headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                  }
                }
              )
              .then(({ data }) => {
                console.log(data);
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
    },
    // 新增产品
    addDomain() {
      this.dynamicValidateForm.domains.push({
        number: "",
        productName: "",
        productModel: ""
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
