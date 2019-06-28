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
      <el-form-item label="工单编号"  style="width:50%;">
        <el-input v-model="dataForm.number" placeholder="工单编号"></el-input>
      </el-form-item>

      <el-form-item label="客户姓名" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.customerRealName" placeholder="客户姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="paramValue" style="width:50%;">
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

      <el-form-item label="Mac地址" prop="paramValue">
        <el-input v-model="dataForm.mac" placeholder="Mac地址"></el-input>
      </el-form-item>

      <el-form-item label="产品类型" prop="paramValue" style="width:50%;">
        <!-- <el-input v-model="dataForm.productType" placeholder="电话"></el-input> -->
        <select v-model="dataForm.productType" placeholder="选择产品类型" style="padding:0 10px;width:100%;">
          <option value="">选择产品类型</option>
          <option value="1">初柜</option>
          <option value="5">门锁</option>
          <option value="4">门禁</option>
          <option value="2">2层屉柜</option>
          <option value="3">3层屉柜</option>
        </select>
      </el-form-item>
      <el-form-item label="产品型号" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.productModel" placeholder="电话"></el-input>
      </el-form-item>

      <el-form-item label="投诉问题" prop="paramValue" style="width:50%;">
        <select name  v-model="dataForm.contentType" id style="padding:0 10px;width:100%;">
          <option value=''>请选择投诉问题类型</option>
          <option value='1'>指示灯不亮</option>
          <option value='2'>无法配网</option>
          <option value='3'>开门不成功</option>
          <option value='4'>工作状态异常</option>
          <option value='5'>无故报警</option>
          <option value='6'>物理损伤</option>
          <option value='0'>其它</option>
        </select>
      </el-form-item>
      <el-form-item label="问题描述" prop="paramValue">
        <el-input type="textarea" v-model="dataForm.contentDetail"></el-input>
      </el-form-item>
      <el-form-item label="处理方式" prop="paramValue" style="width:50%;">
        <select v-model="dataForm.serviceType" name id style="padding:0 10px;width:100%;">
          <option value=''>请选择处理方式</option>
          <option value='2'>上门维修</option>
          <option value='1'>电话支持</option>
        </select>
      </el-form-item>
      <el-form-item label="服务人员" prop="paramValue">
        <el-input v-model="dataForm.revisitUserRealName" placeholder="服务人员"></el-input>
      </el-form-item>
      <el-form-item label="服务时间" prop="paramValue">
        <el-date-picker
          v-model="value3"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getSTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="paramValue">
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
export default {
  // props:{
  //   dataForm:{
  //     // type:Array,
  //     required:true
  //   }
  // },
  data() {
    return {
      visible: false,
      dataForm:{},
      dataRule: {
        // paramKey: [
        //   { required: true, message: "参数名不能为空", trigger: "blur" }
        // ],
        // paramValue: [
        //   { required: true, message: "参数值不能为空", trigger: "blur" }
        // ]
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
      value3:'',
      newform:false
    };
  },
  methods: {
    init(id,datas) {
      // console.log(datas);
      console.log('add');
      
     
      if(datas!=undefined){ //修改
         this.dataForm=datas;
         this.prov=this.dataForm.customerProvince;
         this.dcity=this.dataForm.customerCity;
         this.ddistrict=this.dataForm.customerCounty;
         this.value3=this.dataForm.serviceAppointmentTime;//服务时间
         this.newform=false;
      }else{   //新建
        this.newform=true;
       
      }
      if(this.newform==true){
        this.dataForm=[];
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
    getSTime(){  //时间处理
        console.log(this.value3);
    },
    // 表单提交
    dataFormSubmit() {
      this.dataForm.customerProvince=this.prov;
      this.dataForm.customerCity=this.dcity;
      this.dataForm.customerCounty=this.ddistrict;
      this.dataForm.serviceAppointmentTime=this.value3;
      const _this=this;
      if(this.newform==true){  //新建表单
        this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http_
        .post(
          this.GLOBAL.baseUrl + "/worksheet.add",
          this.dataForm,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        ).then(({ data }) => {
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
        }
      });
      }else{
         this.$refs["dataForm"].validate(valid => {      //修改表单
        if (valid) {
          this.$http_
        .post(
          this.GLOBAL.baseUrl + "/repair.update",
          this.dataForm,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        ).then(({ data }) => {
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
</style>

