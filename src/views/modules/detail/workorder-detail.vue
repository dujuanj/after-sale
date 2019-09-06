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
    <el-button
      type="primary"
      icon="el-icon-edit-outline"
      size="mini"
      :disabled="datas.worksheetStatus==4"
      v-if="isAuth('/api/postsale/worksheet.update')"
      @click="closeBtn(datas)"
    >关闭</el-button>
    <el-button
      type="primary"
      icon="el-icon-edit-outline"
      size="mini"
      v-if="isAuth('/api/postsale/revisit.add')"
      @click="revisitHandle(id,datas)"
    >回访</el-button>
    <!-- <h4>工单 {{datas.number}}</h4> -->
    <!-- 客户信息 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">客户信息</div>
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
            <span>客户姓名:</span>
            {{datas.customerRealName}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>地 址:</span>
            {{datas.customerProvince}} {{datas.customerCity}} {{datas.customerCounty}} {{datas.customerDetailAddress}}
          </label>
        </div>
      </div>
    </div>
    <!-- 设备信息 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">设备信息</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>Mac地址:</span>
            {{datas.mac}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>产品类型:</span>
            {{datas.productType==1?"初柜":datas.productType==2?"2层屉柜":datas.productType==3?"3层屉柜":datas.productType==4?"门禁":datas.productType==5?"门锁":''}}
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
            <span>生产时间:</span>
            {{macData.productTime}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>生产批号:</span>
            {{macData.batchNumber}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>生产厂商:</span>
            {{macData.provider}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>生产监督:</span>
            {{macData.supervisioner}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>售出时间:</span>
            {{macData.shippingTime}}
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

        <!-- <div class="layui-form-item">
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
        </div>-->
        <!-- <div class="layui-form-item">
          <!-- <label class="layui-form-label">
            <span>上传照片:</span>
        </label>-->
        <!-- 上传照片 -->
        <!-- <el-upload
          
            accept="image/*"
            
            list-type="picture-card"
            name="uploadFile"
            :file-list="picList"
            :http-request="httpRequest"
            :on-remove="handleRemove"
            :show-file-list="true"
            
          >
            <i class="el-icon-plus"></i>
        </el-upload>-->
        <!-- <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
        </el-dialog>-->
        <!-- </div> -->
      </div>
    </div>
    <!-- 分配信息 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">分配信息</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>服务人员:</span>
            {{datas.serviceUserRealName}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>服务时间:</span>
            {{datas.serviceFinishTime}}
          </label>
        </div>
      </div>
    </div>
    <!-- 维修信息 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">维修信息</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>维修状态:</span>
            <span
              style="font-weight:bold;"
            >{{datas.serviceStatusType==1?'维修完成':datas.serviceStatusType==2?'无法维修':''}}</span>
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>解决方案:</span>
            {{datas.serviceStatusDetail}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>签名照片:</span>
            <img v-for='item in datas.picList' :src="item.url" alt="" style='width:100px;height:80px;margin-right:10px;display:inline-block'>
            
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>提交时间:</span>
            {{datas.serviceFinishTime}}
          </label>
        </div>
      </div>
    </div>
    <!-- 关闭信息 -->
    <div class="layui-card detail" style="margin-top: 10px;">
      <div class="layui-card-header">关闭信息</div>
      <div class="layui-card-body">
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>关闭时间:</span>
            <span style="font-weight:bold;">{{datas.closeTime}}</span>
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>关闭人员:</span>
            {{datas.closeUserName}}
          </label>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">
            <span>关闭备注:</span>
            {{datas.closeRemark}}
          </label>
        </div>
      </div>
    </div>
    <!-- 回访信息 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <revisit-add-or-update
      v-if="revisitVisible"
      ref="revisitaddOrUpdate"
      @refreshDataList="getDataList"
    ></revisit-add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "../sales/config-add-or-update";
import RevisitAddOrUpdate from "../sales/revisit-add-or-update";
export default {
  name: "workDetail",
  data() {
    return {
      picList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      addOrUpdateVisible: false,
      revisitVisible: false,
      //  datas:this.$route.params.detailDatas,
      id: "",
      datas: "",
      macData: ""
    };
  },
  activated() {
    (this.datas = this.$route.params.detailDatas),
      (this.id = this.$route.params.id),
      console.log(this.id);
    console.log(this.datas);
    // this.picquery();
    this.getmac(this.datas.mac);
  },
  components: {
    AddOrUpdate,
    RevisitAddOrUpdate
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
            sid: window.sessionStorage.getItem("sid")
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data);
          if (data.isSuccess == "true") {
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
    // picupload(imgurlbase){
    //   var params = new URLSearchParams();
    //   params.append('worksheetId', this.id);
    //   params.append('worksheetNumber', this.datas.number);
    //   params.append('filePostfix', '.jpg');
    //   params.append('type', 2);
    //    params.append('sid', window.sessionStorage.getItem('sid'));
    //   params.append('picData', imgurlbase);
    //   params.append('ownerUserId', 36);

    //    this.$http_
    //     .post(
    //       this.GLOBAL.baseUrl + "/pic.upload",
    //       params,

    //        {
    //         headers: {
    //           // "Content-Type": "application/json;charset=UTF-8"
    //           // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    //         },
    //         dataType: "form"
    //       }
    //     )
    //     .then(({ data }) => {
    //       console.log(data);
    //       if(data.isSuccess=='true'){
    //         this.$message({
    //             message: "操作成功",
    //             type: "success",
    //             duration: 1500,
    //             onClose: () => {
    //               // this.getDataList();
    //             }
    //           });
    //       }
    //     });
    // },
    // 查询图片
    picquery() {
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/pic.query",
          {
            worksheetId: this.id,
            // createUserRealName:this.GLOBAL.createUserRealName,
            sid: window.sessionStorage.getItem("sid")
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(({ data }) => {
          console.log(data.data);
          this.picList = data.data;
        });
    },
    closeBtn(datas) {
      this.$prompt("请输入关闭备注", "关闭工单", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea"
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          datas.worksheetStatus = 4;
          datas.sid = window.sessionStorage.getItem("sid");
           datas.closeRemark = value;
          this.$http_
            .post(this.GLOBAL.baseUrl + "/worksheet.update", datas, {
              headers: {
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(({ data }) => {
              console.log(data.isSuccess);
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.getDataList();
                }
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 新增回访单
    revisitHandle(id, detailDatas) {
      this.revisitVisible = true;
      console.log(this.revisitVisible);
      this.$nextTick(() => {
        this.$refs.revisitaddOrUpdate.init(id, detailDatas);
      });
    },
    getmac(value) {
      if (value) {
        this.macshow = true;
        this.macdatas = true;
        this.$http_
          .post(
            this.GLOBAL.baseUrlxg + "/productinfo/get.mac",
            {
              // sid:window.sessionStorage.getItem('sid'),
              mac: value,
              // currentPage:1,
              // pageSize:10,
              sid: window.sessionStorage.getItem("sid")
            },
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8"
              }
            }
          )
          .then(({ data }) => {
            console.log(data.data);
            if (
              data.data == {} ||
              data.data == null ||
              data.data == undefined ||
              data.data == []
            ) {
              this.macdatas = false;
            } else {
              this.macData = data.data;
            }
          });
      }
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
.el-upload-list--picture-card .el-upload-list__item-status-label {
  width: 0px !important;
}
</style>

