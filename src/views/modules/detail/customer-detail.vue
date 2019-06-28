<template>
  <div class="mod-home">
      <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()" class="marbot_15" style='float:right;'>修改</el-button>
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">工单 TSB119052901 回访记录</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>工单编号:</span> 办公室
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>回访时间:</span> 平行宇宙办公室
          </label>
        </div>
         <div class="layui-form-item">
          <label class="layui-form-label">
            <span>客户姓名:</span> 平行宇宙办公室
          </label>
        </div>
         <div class="layui-form-item">
          <label class="layui-form-label">
            <span>产品:</span> 平行宇宙办公室
          </label>
        </div>
         <div class="layui-form-item">
          <label class="layui-form-label">
            <span>Mac地址:</span> 平行宇宙办公室
          </label>
        </div>
         <div class="layui-form-item">
          <label class="layui-form-label">
            <span>回访记录:</span> 平行宇宙办公室
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>回访人员:</span> 平行宇宙办公室
          </label>
        </div>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">工单概况</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>投诉时间:</span> 办公室
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>投诉内容:</span> 平行宇宙办公室
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>服务人员:</span>
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>服务时间:</span>
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>解决方案:</span>
          </label>
        </div>
      </div>
    </div>
   
     <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "../sales/config-add-or-update";
export default {
  name: "slipDetail",
   data() {
      return {
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
         addOrUpdateVisible: false,
      };
    },
    activated() {
    this.getDataList();
  },
   components: {
    AddOrUpdate
  },
      methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
       // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
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
.el-upload-list--picture .el-upload-list__item-status-label{
  width:46px!important;
}
.el-upload-list--picture .el-upload-list__item{
  width:14%;
  float:left;
}
.el-upload-list--picture .el-upload-list__item-status-label i{
      margin-top: 12px;
    margin-left: 16px;
}
</style>

