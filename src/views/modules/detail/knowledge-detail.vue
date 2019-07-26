<template>
  <div class="mod-home">
    <el-button
      type="primary"
      icon="el-icon-edit-outline"
      size="mini"
      @click="addOrUpdateHandle(id,datas)"
      class="marbot_15"
      style="float:left;margin-bottom:15px"
    >修改</el-button> 
    <!-- <h4>工单 {{datas.number}}</h4> -->
    <!-- 基本信息 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">基本信息</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>产品名称:</span>
            <span style="font-weight:bold;">{{datas.productName}}</span>
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>产品型号:</span>
            {{datas.productModel}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>问题描述:</span>
            {{datas.question}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>解决方案:</span>
            {{datas.answer}} 
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>创建人:</span>
            {{datas.createUserName}}
          </label>
        </div>
         <div class="layui-form-item">
          <label class="layui-form-label">
            <span>创建时间:</span>
            {{datas.createTime}}
          </label>
        </div>
      </div>
    </div>
   
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "../sales/knowledge-update-add";
export default {
  name: "workDetail",
  data() {
    return {
      picList: [],
       dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
      addOrUpdateVisible: false,
      //  datas:this.$route.params.detailDatas,
      id: "",
      datas: ""
    };
  },
  activated() {
    (this.datas = this.$route.params.detailDatas),
      (this.id = this.$route.params.id),
      console.log(this.id);
    console.log(this.datas);
    this.picquery();
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 删除图片
     handleRemove(file) {
      //  alert('222')
        console.log(file);
        this.$http_
        .post(
          this.GLOBAL.baseUrl + "/pic.delete",
          {
            id: file.id,
            // createUserRealName:this.GLOBAL.createUserRealName,
            sid:window.sessionStorage.getItem('sid')
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data);
          if(data.isSuccess=='true'){
            this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  // this.getDataList();
                }
              });
          }
        });
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      },
    // 新增 / 修改
    addOrUpdateHandle(id, detailDatas) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, detailDatas);
      });
    },
    //图片上传转流
    httpRequest(file) {
      //alert(999);

      console.log(file.file);

      var reader = new FileReader();
      reader.readAsDataURL(file.file);

      reader.onload = e => {
        var imgurlbase = e.target.result.split(",");
        imgurlbase.shift();
        imgurlbase = imgurlbase.toString();
        console.log(imgurlbase);
        this.picupload(imgurlbase);
      };
    },
    // 上传图片
    picupload(imgurlbase){
      var params = new URLSearchParams();
      params.append('worksheetId', this.id);  
      params.append('worksheetNumber', this.datas.number);
      params.append('filePostfix', '.jpg');  
      params.append('type', 2);
       params.append('sid', window.sessionStorage.getItem('sid'));
      params.append('picData', imgurlbase); 
      params.append('ownerUserId', 36);
       
       this.$http_
        .post(
          this.GLOBAL.baseUrl + "/pic.upload",
          params,
         
           {            
            headers: {
              // "Content-Type": "application/json;charset=UTF-8"
              // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            dataType: "form"
          }
        )
        .then(({ data }) => {
          console.log(data);
          if(data.isSuccess=='true'){
            this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  // this.getDataList();
                }
              });
          }
        });
    },
    // 查询图片
    picquery() {
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/pic.query",
          {
            worksheetId: this.id,
            // createUserRealName:this.GLOBAL.createUserRealName,
            sid:window.sessionStorage.getItem('sid')
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data);
          this.picList=data.data
        });
    }
  }
};
</script>

<style>
.mod-home {
  line-height: 1.5;
}
.layui-card {
  margin-bottom: 15px;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  padding-bottom: 15px;
  clear: both;
  overflow: hidden;
}
.detail .layui-card-header {
  background: #efeef0 !important;
}
.layui-card-header {
  height: 42px;
  line-height: 42px;
  padding: 0 15px;
  border-bottom: 1px solid #f6f6f6;
  color: #333;
  border-radius: 2px 2px 0 0;
  font-size: 14px;
}
.layui-card-body {
  padding: 10px 15px;
  line-height: 24px;
}
.layui-form-item {
  margin-bottom: 15px;
  clear: both;
  *zoom: 1;
}
.detail label {
  width: 100% !important;
  text-align: left !important;
}
.layui-form-label {
  float: left;
  display: block;
  padding: 9px 15px;
  width: 80px;
  font-weight: 400;
  line-height: 20px;
  text-align: right;
}
/* .el-upload-list--picture .el-upload-list__item-status-label {
  width: 46px !important;
}
.el-upload-list--picture .el-upload-list__item {
  width: 14%;
  float: left;
}
.el-upload-list--picture .el-upload-list__item-status-label i {
  margin-top: 12px;
  margin-left: 16px;
} */
.el-upload-list--picture-card .el-upload-list__item-status-label{
  width:0px!important;
}
</style>

