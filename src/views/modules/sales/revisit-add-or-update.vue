<template>
  <el-dialog
    :title="newform ? '新建回访单' : '修改回访单'"
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
        <el-input v-model="dataForm.customerRealName" placeholder="客户姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.customerPhone" placeholder="电话"></el-input>
      </el-form-item>
      <el-form-item label="产品类型" prop="paramValue" style="width:50%;">
        <!-- <el-input v-model="dataForm.productType" placeholder="电话"></el-input> -->
        <select
          v-model="dataForm.productType"
          placeholder="选择产品类型"
          style="padding:0 10px;width:100%;"
        >
          <option value>选择产品类型</option>
          <option value="1">初柜</option>
          <option value="5">门锁</option>
          <option value="4">门禁</option>
          <option value="2">2层屉柜</option>
          <option value="3">3层屉柜</option>
        </select>
      </el-form-item>
     
      <el-form-item label="回访时间" prop="paramValue">
        <el-date-picker
          v-model="dataForm.revisitTime"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getSTime"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="备注" prop="paramValue">
        <el-input type="textarea" v-model="dataForm.serviceStatusDetail"></el-input>
      </el-form-item> -->
       <el-form-item label="回访记录" prop="paramValue">
        <el-input type="textarea" v-model="dataForm.revisitContent"></el-input>
      </el-form-item>
       <el-form-item label="回访人员" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.revisitUserRealName" placeholder="电话"></el-input>
      </el-form-item>
      <el-form-item label="满意度评分" prop="paramValue" style="width:51%;">
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
      console.log("add");
      this.newform = true;
      if (datas != undefined) {
        //修改
        this.dataForm = datas;       
        // this.newform = false;
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
.el-form-item__label{
  // width:85px!important;
}
</style>

