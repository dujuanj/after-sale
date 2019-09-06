<template>
  <el-dialog
    :title="!dataForm.id ? '新建工单' : '修改工单'"
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
      <!-- <el-form-item label="工单编号" style="width:50%;"> -->
      <!-- <el-input v-model="dataForm.number" placeholder="工单编号"></el-input> -->
      <!-- <span>{{dataForm.number}}</span> -->
      <!-- </el-form-item> -->

      <el-form-item label="客户姓名" prop="customerRealName" style="width:50%;">
        <el-input v-model="dataForm.customerRealName" placeholder="客户姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="customerPhone" style="width:50%;">
        <el-input v-model="dataForm.customerPhone" placeholder="电话"></el-input>
      </el-form-item>
      <!-- 地址省市区 -->
      <el-form-item label="省市区:">
        <select
          id="province1"
          name="province"
          v-model="prov"
          style="height:40px;width:100px;"
          placeholder="省"
        >
          <option v-for="option in arr" :value="option.name">{{option.name }}</option>
        </select>

        <select id="city1" name="city" v-model="dcity" style="height:40px;width:100px">
          <option v-for="option in cityArr" :value="option.name">{{ option.name }}</option>
        </select>

        <select
          id="district1"
          name="ruleForm.area"
          v-model="ddistrict"
          style="height:40px;width:100px;"
        >
          <option v-for="option in districtArr" :value="option.name">{{ option.name }}</option>
        </select>
      </el-form-item>
      <!-- 地址省市区结束 -->
      <el-form-item label="详细地址" prop="paramValue">
        <el-input v-model="dataForm.customerDetailAddress" placeholder="输入地址"></el-input>
      </el-form-item>
      <el-divider class="divider"></el-divider>
      <el-form-item label="Mac地址" prop="mac">
        <el-input v-model="dataForm.mac" placeholder="Mac地址" @blur='getmac(dataForm.mac)'></el-input>
      </el-form-item>
    <!-- mac显示信息 -->
    <div v-if='macshow'>
      <div v-if='macdatas'>

        <el-form-item label="产品类型" prop="paramValue" style="width:45%;float:left;">
        <el-input v-model="macData.productType==1?'初柜':macData.productType==2?'2层屉柜':macData.productType==3?'3层屉柜':macData.productType==4?'门禁':macData.productType==5?'门锁':''" disabled></el-input>       
      </el-form-item>
      <el-form-item label="产品型号" prop="paramValue" style="width:45%;float:left;">
        <el-input v-model="macData.productModel" disabled></el-input>
      </el-form-item>
       <el-form-item label="生产时间" prop="paramValue" style="width:45%;float:left;">
        <el-input v-model="macData.productTime" disabled></el-input>
      </el-form-item>
       <el-form-item label="生产批号" prop="paramValue" style="width:45%;float:left;">
        <el-input v-model="macData.batchNumber" disabled></el-input>
      </el-form-item>
       <el-form-item label="生产厂商" prop="paramValue" style="width:45%;float:left;">
        <el-input v-model="macData.provider" disabled></el-input>
      </el-form-item>
       <el-form-item label="生产监督" prop="paramValue" style="width:45%;float:left;">
        <el-input v-model="macData.supervisioner" disabled></el-input>
      </el-form-item>
      <el-form-item label="售出时间" prop="paramValue" style="width:45%;float:left;">
        <el-input v-model="macData.shippingTime" disabled></el-input>
      </el-form-item>
      </div>
      <div v-else style='color:#E6A23C;margin-left:10px;margin-bottom:17px;'>未查到该产品信息</div> 
    </div>
    
  <!-- mac显示结束 -->
      <el-form-item label="投诉问题" prop="contentType" style="width:50%;">
        <select name v-model="dataForm.contentType" id style="padding:0 10px;width:100%;">
          <option value=''>请选择投诉问题类型</option>
          <option value="1">指示灯不亮</option>
          <option value="2">无法配网</option>
          <option value="3">开门不成功</option>
          <option value="4">工作状态异常</option>
          <option value="5">无故报警</option>
          <option value="6">物理损伤</option>
          <option value="0">其它</option>
        </select>
      </el-form-item>
      <el-form-item label="问题描述" prop="contentDetail">
        <el-input type="textarea" v-model="dataForm.contentDetail"></el-input>
      </el-form-item>
      <el-form-item label="处理方式" prop="serviceType" style="width:50%;">
        <el-select 
        :disabled="dataForm.worksheetStatus==4"
        v-model="dataForm.serviceType" 
       
         placeholder="请选择"
        >
          <!-- <el-option value=''>请选择处理方式</el-option>
          <el-option value="2">上门维修</el-option>
          <el-option value="1">远程协助</el-option> -->
           <el-option v-for='item in serviceTypedatas' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
        <el-divider class="divider"></el-divider>
      <el-form-item label="服务人员" prop="paramValue">
        <!-- <el-input v-model="dataForm.serviceUserRealName" placeholder="服务人员" :disabled="dataForm.worksheetStatus==4"></el-input> -->
         <el-select 
           :disabled="dataForm.worksheetStatus==4"
          v-model="dataForm.serviceUserRealName"  
          placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.realName" :value="item.realName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务时间" prop="paramValue" >
        <el-date-picker
          v-model="value3"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getSTime"
          :disabled="dataForm.worksheetStatus==4"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="备注" prop="paramValue">
        <el-input type="textarea" v-model="dataForm.serviceStatusDetail"></el-input>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    productype: Object,
    required: true
  },
  data() {
    return {
      visible: false,
      options:'',//服务人员
      serviceTypedatas:[{name:'上门维修',value:2},{name:'远程协助',value:1}],
      dataForm: { number: "2",contentType:'' },
      dataRule: {
        customerRealName: [
          { required: true, message: "客户姓名不能为空", trigger: "blur" }
        ],
        customerPhone: [
          { required: true, message: "电话不能为空", trigger: "blur" }
        ],
         mac: [
          { required: true, message: "mac不能为空", trigger: "blur" }
        ],
        contentType:[
          { required: true, message: "投诉问题不能为空", trigger: "blur" }
        ],
        contentDetail:[
           { required: true, message: "投诉的内容不能为空", trigger: "blur" }
        ],
        serviceType:[
           { required: true, message: "处理方式不能为空", trigger: "blur" }
        ]
      },
      // 省市区
      arr: this.GLOBAL.arrAll,
      prov: "省",
      dcity: "市",
      ddistrict: "区",
      // 页面绑定的
      citys: "",
      districtDatas: "",
      cityArr: [],
      districtArr: [],
      // 处理类型的省市区
      value3: "",
      newform: false,
      macshow:false,
      macdatas:false,
      macData:'',//mac带出的数据
      createNum: "" //新建工单编号
    };
  },
  methods: {
    init(id, datas) {
      var _this = this;
      // console.log(datas);
      this.getServersname();
      console.log("add");

      if (datas != undefined) {
        //修改
        this.dataForm = datas;
        this.prov = this.dataForm.customerProvince;
        this.dcity = this.dataForm.customerCity;
        this.ddistrict = this.dataForm.customerCounty;
        this.value3 = this.dataForm.serviceAppointmentTime; //服务时间
        this.newform = false;
        this.macshow = true;
       this.macdatas=true;
        this.getmac(this.dataForm.mac);
      } else {
        //新建
        this.newform = true;
        this.macData={}
        // console.log(this.createNum);
        // this.dataForm.number=this.createNum;
      }
      if (this.newform == true) {
        this.dataForm = { number: "" };
        // this.createNumber();
        console.log(this.dataForm);
      }
      // this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        // this.$refs["dataForm"].resetFields();
        // if (this.dataForm.id) {
        //   this.$http({
        //     url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.id}`),
        //     method: "get",
        //     params: this.$http.adornParams()
        //   }).then(({ data }) => {
        //     if (data && data.code === 0) {
        //       this.dataForm.paramKey = data.config.paramKey;
        //       this.dataForm.paramValue = data.config.paramValue;
        //       this.dataForm.remark = data.config.remark;
        //     }
        //   });
        // }
      });
    },
    getmac(value){
      if(value){
        this.macshow=true;
        this.macdatas=true;
        this.$http_
              .post(this.GLOBAL.baseUrlxg + "/productinfo/get.mac", 
              {
                // sid:window.sessionStorage.getItem('sid'),
                mac:value,
                // currentPage:1,
                // pageSize:10,
                sid:window.sessionStorage.getItem('sid')
              }, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data.data);
                if(data.data=={} ||data.data==null ||data.data==undefined||data.data==[]||data.data.productType==null){
                  this.macdatas=false;
                }else{
                  this.macData=data.data;
                }
              });
      }
    },
    getServersname(){  //获取服务人员
      this.$http_
              .post(this.GLOBAL.baseUrl + "/role.user.query", 
              {
                roleId:3,
               
                currentPage:1,
                pageSize:1000,
                sid:window.sessionStorage.getItem('sid')
              }, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data.data);
                this.options=data.data.list;
               
              });
    },
    getSTime() {
      //时间处理
      console.log(this.value3);
    },
    // 表单提交
    dataFormSubmit() {
      this.dataForm.customerProvince = this.prov;
      this.dataForm.customerCity = this.dcity;
      this.dataForm.customerCounty = this.ddistrict;
      this.dataForm.serviceAppointmentTime = this.value3;
      this.dataForm.sid = window.sessionStorage.getItem("sid");
      // this.dataForm.productType=this.macData.productType;
      // this.dataForm.productModel=this.macData.productModel;
      // this.dataForm.mac=this.macData.mac
      const _this = this;
      if (this.newform == true) {
        //新建表单
        this.dataForm.worksheetStatus= 1;
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            // 新建工单
            this.$http_
              .post(this.GLOBAL.baseUrl + "/worksheet.add", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data.isSuccess);
                _this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    _this.visible = false;
                    _this.$emit("refreshDataList");
                  }
                });
              });
            // 新建维修单
            // this.$http_
            //   .post(this.GLOBAL.baseUrl + "/repair.add", this.dataForm, {
            //     headers: {
            //       "Content-Type": "application/json;charset=UTF-8"
            //     }
            //   })
            //   .then(({ data }) => {
            //     console.log(data);
            //     console.log(data.isSuccess);
            //     _this.$message({
            //       message: "操作成功",
            //       type: "success",
            //       duration: 1500,
            //       onClose: () => {
            //         _this.visible = false;
            //         _this.$emit("refreshDataList");
            //       }
            //     });
            //   });
          }
        });
      } else {
        this.$refs["dataForm"].validate(valid => {
          //修改表单
          if (valid) {
            // 修改售工单
            this.$http_
              .post(this.GLOBAL.baseUrl + "/worksheet.update", this.dataForm, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data.isSuccess);
                _this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    _this.visible = false;
                    _this.$emit("refreshDataList");
                  }
                });
              });
            // 修改维修单
            //  this.$http_
            // .post(this.GLOBAL.baseUrl + "/repair.update", this.dataForm, {
            //   headers: {
            //     "Content-Type": "application/json;charset=UTF-8"
            //   }
            // })
            // .then(({ data }) => {
            //   console.log(data.isSuccess);
            //   _this.$message({
            //     message: "操作成功",
            //     type: "success",
            //     duration: 1500,
            //     onClose: () => {
            //       _this.visible = false;
            //       _this.$emit("refreshDataList");
            //     }
            //   });
            // });
          }
        });
      }
    },
    // 省市区方法
    updateCity: function() {
      for (var i in this.arr) {
        var obj = this.arr[i];
        if (obj.name == this.prov) {
          this.cityArr = obj.sub;
          break;
        }
      }
      this.ruleForm.city = this.cityArr[1].name;
    },
    updateDistrict: function() {
      for (var i in this.cityArr) {
        var obj = this.cityArr[i];
        if (obj.name == this.dcity) {
          this.districtArr = obj.sub;
          break;
        }
      }
      if (
        this.districtArr &&
        this.districtArr.length > 0 &&
        this.districtArr[1].name
      ) {
        //this.ddistrict = this.districtArr[1].name;
      } else {
        this.ddistrict = "";
      }
    }
    // 省市区方法结束
    // createNumber() {
    //   //新售后工单编号
    //   var _this = this;
    //   this.$http_
    //     .post(
    //       this.GLOBAL.baseUrl + "/worksheet.number.create",
    //       {
    //         sid:window.sessionStorage.getItem('sid')
    //       },
    //       {
    //         headers: {
    //           "Content-Type": "application/json;charset=UTF-8"
    //         }
    //       }
    //     )
    //     .then(res => {
    //       console.log(res.data.data.number);
    //       this.dataForm.number = res.data.data.number;
    //       _this.createNum = res.data.data.number;
    //       // console.log(this.createNum);
    //       //  console.log(_this.createNum);
    //     })
    //     .catch(res => {
    //       console.log("err");
    //     });
    // }
  },
  watch: {
    prov: function() {
      this.updateCity();
      this.updateDistrict();
    },
    dcity: function() {
      this.updateDistrict();
    },
    // province:function(){
    //     this.updateCity();
    //     this.updateDistrict();
    // },
    city: function() {
      this.updateDistrict();
    }
  }
};
</script>
<style lang="scss">
.el-dialog {
  width: 33%;
}
select {
  border: 1px solid #ccc;
  color: #606266;
  border-radius: 3px;
  height: 37px;
}
.wid100 {
  width: 100%;
  div {
    width: 72.4%;
  }
}
.divider {
  width: 100%;
  height: 1px;
  display: inline-block;
  background-color: #909399;
  margin-bottom: 11px;
}
</style>

