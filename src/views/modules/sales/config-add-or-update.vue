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
      <el-form-item label="工单编号" prop="paramKey" style="width:50%;">
        <el-input v-model="dataForm.paramKey" placeholder="工单编号"></el-input>
      </el-form-item>

      <el-form-item label="客户姓名" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.paramValue" placeholder="客户姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>
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
        <el-input v-model="dataForm.paramValue" placeholder="输入地址"></el-input>
      </el-form-item>

      <el-form-item label="Mac地址" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>
      </el-form-item>

      <el-form-item label="产品类型" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>
      </el-form-item>
      <el-form-item label="产品型号" prop="paramValue" style="width:50%;">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>
      </el-form-item>

      <el-form-item label="投诉问题" prop="paramValue" style="width:50%;">
        <select name id style="padding:0 10px;width:100%;">
          <option value>请选择投诉问题类型</option>
          <option value>指示灯不亮</option>
          <option value>无法配网</option>
          <option value>开门不成功</option>
          <option value>工作状态异常</option>
          <option value>无故报警</option>
          <option value>物理损伤</option>
          <option value>其它</option>
        </select>
      </el-form-item>
      <el-form-item label="问题描述" prop="paramValue">
        <el-input type="textarea" v-model="dataForm.paramValue"></el-input>
      </el-form-item>
      <el-form-item label="处理方式" prop="paramValue" style="width:50%;">
        <select name id style="padding:0 10px;width:100%;">
          <option value>请选择处理方式</option>
          <option value>上门维修</option>
          <option value>远程协助</option>
        </select>
      </el-form-item>
      <el-form-item label="服务人员" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>
      </el-form-item>
      <el-form-item label="服务时间" prop="paramValue">
        <el-date-picker
          v-model="value3"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="paramValue">
        <el-input type="textarea" v-model="dataForm.paramValue"></el-input>
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
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        paramKey: "",
        paramValue: "",
        remark: ""
      },
      dataRule: {
        paramKey: [
          { required: true, message: "参数名不能为空", trigger: "blur" }
        ],
        paramValue: [
          { required: true, message: "参数值不能为空", trigger: "blur" }
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
      value3:''
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.paramKey = data.config.paramKey;
              this.dataForm.paramValue = data.config.paramValue;
              this.dataForm.remark = data.config.remark;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.arr);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/config/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              paramKey: this.dataForm.paramKey,
              paramValue: this.dataForm.paramValue,
              remark: this.dataForm.remark
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
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

