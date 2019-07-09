<template>
  <div class="mod-home">
     <!-- 导航 -->
    <el-breadcrumb separator="/" class="marbot_15" style='margin-bottom:15px;'>
      <el-breadcrumb-item :to="{ path: './sales-return-slip' }"> <a href='javascript:;'>回访单</a> </el-breadcrumb-item>

      <el-breadcrumb-item>回访单详情</el-breadcrumb-item>
      
    </el-breadcrumb>
       <el-button type="primary" icon="el-icon-edit-outline"  size="mini" @click="addOrUpdateHandle(id,datas)" class="marbot_15" style='float:left;'>修改</el-button>
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">回访记录</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>工单编号:</span> {{datas.number}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>回访时间:</span> {{datas.revisitTime}}
          </label>
        </div>
         <div class="layui-form-item">
          <label class="layui-form-label">
            <span>客户姓名:</span> {{datas.customerRealName}}
          </label>
        </div>
         <div class="layui-form-item">
          <label class="layui-form-label">
            <span>产品:</span>{{datas.productType==1?"初柜":datas.productType==2?"2层屉柜":datas.productType==3?"3层屉柜":datas.productType==4?"门禁":datas.productType==5?"门锁":''}}
          </label>
        </div>
         <div class="layui-form-item">
          <label class="layui-form-label">
            <span>Mac地址:</span> {{datas.mac}}
          </label>
        </div>
         <div class="layui-form-item">
          <label class="layui-form-label">
            <span>回访记录:</span> {{datas.revisitContent}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>回访人员:</span> {{datas.revisitUserRealName}}
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
            <span>投诉时间:</span> {{datas.serviceAppointmentTime}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>投诉内容:</span>{{datas.contentType==1?"指示灯不亮":datas.contentType==2?"无法配网":datas.contentType==3?"开门不成功":datas.contentType==4?"工作状态异常":datas.contentType==5?"无故报警":datas.contentType==6?"物理损伤":datas.contentType==0?"其它":''}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>服务人员:</span>{{datas.serviceUserRealName}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>服务时间:</span>{{datas.serviceFinishTime}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>解决方案:</span>{{datas.worksheetStatus==1?"创建完成":datas.worksheetStatus==2?"已经分派":datas.worksheetStatus==3?"工人接单处理中":datas.worksheetStatus==4?"处理完成":datas.worksheetStatus==5?"工单关闭":''}}
          </label>
        </div>
      </div>
    </div>
   <!-- 回访单弹窗，修改 -->
    <revisit-add-or-update v-if="revisitVisible" ref="revisitaddOrUpdate" @refreshDataList="getDataList"></revisit-add-or-update>
  </div>
</template>

<script>

import RevisitAddOrUpdate from '../sales/revisit-add-or-update'
export default {
  name: "slipDetail",
   data() {
      return {
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
          revisitVisible:false,
         id:'',
         datas:''
      };
    },
    activated() {
     this.datas=this.$route.params.detailDatas, 
      this.id=this.$route.params.id, 
      // sessionStorage.setItem('id',this.$route.params.id);
      // sessionStorage.setItem('datas',JSON.stringify(this.$route.params.detailDatas) )
     console.log(this.id);
      console.log(this.datas);
  },
   components: {
    RevisitAddOrUpdate
  },
      methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
       // 新增 / 修改
    addOrUpdateHandle(id,detailDatas) {
        this.revisitVisible = true;
      console.log(this.revisitVisible);
        this.$nextTick(() => {
        this.$refs.revisitaddOrUpdate.update(id, detailDatas);
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

