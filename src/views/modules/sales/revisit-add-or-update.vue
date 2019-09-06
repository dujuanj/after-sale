<template>
  <el-dialog
    :title="newform ? '工单回访' : '修改回访单'"
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
      <el-form-item label="工单编号" style="width:50%;">
        <!-- <el-input v-model="dataForm.number" placeholder="工单编号"></el-input> -->
        <span>{{dataForm.number}}</span>
      </el-form-item>

      <el-form-item label="客户姓名" prop="paramValue" style="width:50%;">
        <!-- <el-input v-model="dataForm.customerRealName" placeholder="客户姓名"></el-input> -->
         <span>{{dataForm.customerRealName}}</span>
      </el-form-item>
      <el-form-item label="电话" prop="paramValue" style="width:50%;">
        <!-- <el-input v-model="dataForm.customerPhone" placeholder="电话"></el-input> -->
           <span>{{dataForm.customerPhone}}</span>
      </el-form-item>
        <el-form-item label="地址" prop="paramValue" style="width:50%;">
           <span>{{dataForm.customerProvince}} {{dataForm.customerCity}} {{dataForm.customerCounty}}</span>
      </el-form-item>
       <el-form-item label="mac地址" prop="paramValue" style="width:50%;">
           <span>{{dataForm.mac}}</span>
      </el-form-item>
      <el-form-item label="产品类型" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.productType==1?'初柜':dataForm.productType==2?'2层屉柜':dataForm.productType==3?'3层屉柜':dataForm.productType==4?'门禁':dataForm.productType==5?'门锁':''" disabled></el-input>      
      </el-form-item>
        <el-form-item label="产品型号" prop="paramValue" style="width:50%;">
        <span>{{dataForm.productModel}}</span>
      </el-form-item>
       <el-form-item label="投述问题" prop="paramValue" style="width:50%;">
        <span>{{dataForm.productModel}}</span>
      </el-form-item>
       <el-form-item label="问题描述" prop="paramValue" style="width:100%;">
        <span>{{dataForm.serviceStatusDetail}}</span>
      </el-form-item>
       <el-form-item label="处理方式" prop="paramValue" style="width:50%;">
        <span>{{dataForm.serviceStatusType}}</span>
      </el-form-item>
       <el-form-item label="服务人员" prop="paramValue" style="width:50%;">
        <span>{{dataForm.serviceUserRealName}}</span>
      </el-form-item>
       <el-form-item label="维修状态" prop="paramValue" style="width:50%;">
        <span>{{dataForm.serviceStatusType==1?'维修完成':dataForm.serviceStatusType==2?'无法维修':''}}</span>
      </el-form-item>
       <el-form-item label="解决方案" prop="paramValue" style="width:50%;">
        <span>{{dataForm.serviceStatusDetail}}</span>
      </el-form-item>
     
      <!-- <el-form-item label="回访时间" prop="paramValue">
        <el-date-picker
          v-model="dataForm.revisitTime"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getSTime"
        ></el-date-picker>
      </el-form-item> -->
      <!-- <el-form-item label="备注" prop="paramValue">
        <el-input type="textarea" v-model="dataForm.serviceStatusDetail"></el-input>
      </el-form-item> -->
       <el-form-item label="回访记录" prop="paramValue">
        <el-input type="textarea" v-model="dataForm.revisitContent"></el-input>
      </el-form-item>
       <!-- <el-form-item label="回访人员" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.revisitUserRealName" placeholder="电话"></el-input>
      </el-form-item> -->
      <el-form-item label="满意度评分" prop="paramValue" style="width:51%;" class="score">
        <!-- <el-input v-model="dataForm.revisitScore" placeholder=""></el-input> -->
        <el-rate
          v-model="dataForm.revisitScore"
          show-text>
        </el-rate>
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
      dataForm: { number: "2" },
      dataRule: {
        // paramKey: [
        //   { required: true, message: "参数名不能为空", trigger: "blur" }
        // ],
        // paramValue: [
        //   { required: true, message: "参数值不能为空", trigger: "blur" }
        // ]
      },
      
      newform: false,
      createNum: "" //新建工单编号
    };
  },
  methods: {
    // 新建回访单
    init(id, datas) {
      var _this = this;
      console.log(datas);
     
      this.newform = true;
      if (datas != undefined) {
        //修改
        this.dataForm = datas;       
        this.newform = false;
      };
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
    update(id, datas){
       this.newform = false;
       if (datas != undefined) {
        //修改
        this.dataForm = datas;  
        this.dataForm.sid=window.sessionStorage.getItem('sid')     
        // this.newform = false;
      };
      this.visible = true;
    },
    getSTime() {
      //时间处理
      console.log(this.value3);
    },
    // 表单提交
    dataFormSubmit() {
      const _this = this;
      if (this.newform == true) {
        //新建表单
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            // 新建回访单
            this.$http_
              .post(this.GLOBAL.baseUrl + "/revisit.add", this.dataForm, {
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
          
          }
        });
      } else {
        this.dataForm.sid=window.sessionStorage.getItem('sid');
        this.$refs["dataForm"].validate(valid => {
          //修改表单
          if (valid) {
            // 修改回访单
            this.$http_
              .post(this.GLOBAL.baseUrl + "/revisit.update", this.dataForm, {
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
              
          }
        });
      }
    },
  
  },

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
.score label{
  width:82px!important;
}
.el-rate{
  line-height: 2!important;
}
.el-form-item {
    margin-bottom: 5px;
}
</style>

