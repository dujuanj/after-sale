<template>
  <div class="mod-home">
    <el-button
      type="primary"
      icon="el-icon-edit-outline"
      size="mini"
      @click="addOrUpdateHandle(id,datas)"
      class="marbot_15"
      style="float:left;"
    >修改</el-button>
    <!-- <h4>工单 {{datas.number}}</h4> -->
    <!-- 基本信息 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">基本信息</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>工单编号:</span>
            <span style="font-weight:bold;">{{datas.number}}</span>
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>电 话:</span>
            {{datas.customerPhone}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>创建时间:</span>
            {{datas.serviceAppointmentTime}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>地 址:</span>
            {{datas.customerProvince}} {{datas.customerCity}} {{datas.customerCounty}} {{datas.customerDetailAddress}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>客户姓名:</span>
            {{datas.customerRealName}}
          </label>
        </div>
      </div>
    </div>
    <!-- 工单详情 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">工单详情</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>产品:</span>
            {{datas.productType==1?"初柜":datas.productType==2?"2层屉柜":datas.productType==3?"3层屉柜":datas.productType==4?"门禁":datas.productType==5?"门锁":''}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>Mac地址:</span>
            {{datas.mac}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>投诉问题:</span>
            {{datas.contentType==1?"指示灯不亮":datas.contentType==2?"无法配网":datas.contentType==3?"开门不成功":datas.contentType==4?"工作状态异常":datas.contentType==5?"无故报警":datas.contentType==6?"物理损伤":datas.contentType==0?"其它":''}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>问题描述:</span>
            {{datas.contentDetail}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>处理方式:</span>
            {{datas.serviceType==1?"电话支持":datas.serviceType==2?"上门解决":''}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>服务人员:</span>
            {{datas.serviceUserRealName}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>服务时间:</span>
            {{datas.serviceAppointmentTime}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>完成时间:</span>
            {{datas.serviceFinishTime}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>解决方法:</span>
            {{datas.serviceStatusType==1?"修好了":datas.serviceStatusType==2?"修不了":''}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>备注:</span>
            {{datas.serviceStatusDetail}}
          </label>
        </div>
        <div class="layui-form-item">
          <!-- <label class="layui-form-label">
            <span>上传照片:</span>
          </label>-->
          <!-- 上传照片 -->
          <el-upload
            action
            accept="image/*"
            :multiple="false"
            list-type="picture-card"
            name="uploadFile"
            :file-list="picList"
            :http-request="httpRequest"
            :on-remove="handleRemove"
            :show-file-list="true"
            limit="5"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </div>
      </div>
    </div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "../sales/config-add-or-update";
export default {
  name: "workDetail",
  data() {
    return {
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
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
       alert('222')
        console.log(file);
        this.$http_
        .post(
          this.GLOBAL.baseUrl + "/pic.delete",
          {
            id: ''
            // createUserRealName:this.GLOBAL.createUserRealName,
            // sid:this.GLOBAL.sid
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data);
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
       this.$http_
        .post(
          this.GLOBAL.baseUrl + "/pic.upload",
          {
            worksheetId: this.id,
            worksheetNumber:this.datas.number,
            picData:imgurlbase,
            filePostfix:'.jpg',
            createUserRealName:this.GLOBAL.createUserRealName,
            createUserName:this.GLOBAL.createUserName,
            sid:this.GLOBAL.sid
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data);
        });
    },
    // 查询图片
    picquery() {
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/pic.query",
          {
            worksheetId: this.id
            // createUserRealName:this.GLOBAL.createUserRealName,
            // sid:this.GLOBAL.sid
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data);
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
.el-upload-list--picture .el-upload-list__item-status-label {
  width: 46px !important;
}
.el-upload-list--picture .el-upload-list__item {
  width: 14%;
  float: left;
}
.el-upload-list--picture .el-upload-list__item-status-label i {
  margin-top: 12px;
  margin-left: 16px;
}
</style>

