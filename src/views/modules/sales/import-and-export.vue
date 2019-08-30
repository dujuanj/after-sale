<template>
  <el-dialog :title="flag" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
    <div v-if="upelement">
      <el-upload
        :action="importUrl" 
        
        enctype="multipart/form-data"
        class="upload-demo"
        ref="upload"
        :auto-upload="false"
        :data='params'
      >
        <el-button slot="trigger" size="small" type="warning" plain> 请选取导入的文件</el-button>
        <br>
        <el-button style="margin-left:80%;margin-top:1px" size="small" type="success" @click="submitUpload">确定上传</el-button>
      </el-upload>
      <!-- <form
        action="https://sale.zeepson.com/api/postsale/worksheet.import"
        method="post"
        enctype="multipart/form-data"
      >
        "sid:"
        <input
          type="input"
          style="width:280px;"
          name="sid"
          value=""
        />
        <input type="file" name="file" value="请选择文件" />
        <input type="submit" value="上传" />
      </form> -->
    </div>
    <!-- <div v-else style="color:#E6A23C" class="el-icon-warning-outline">请确认当前此操作!</div> -->
    <span v-else slot="footer" class="dialog-footer">
      <el-button @click="closeDiallog()">取 消</el-button>
      <el-button type="primary" @click="sureHandle()">确 定</el-button>
    </span>
  </el-dialog>
</template>


<script>
export default {
  data() {
    return {
      dialogVisible: false,
      flag: "",
      importUrl:'',//工单url
      params:{
        sid:window.sessionStorage.getItem('sid'),
      },
      
      upelement: true, //工单导入
      worksheetDatas: "" //工单导入数据
    };
  },
  methods: {
     submitUpload() {
        this.$refs.upload.submit();
        this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                 onClose: () => {
                    this.visible = false;
                    this.$emit("refreshDataList");
                  }
              });
       this.dialogVisible=false;      
      },
    closeDiallog() {
      if (this.flag.indexOf("导入") == -1) {
        // alert(this.flag);
        this.upelement = true;
      } else {
        // alert(this.flag);
        this.upelement = false;
      }
      this.dialogVisible = false;
    },
    init(flag,importUrl) {
      this.dialogVisible = true;
      this.flag = flag;
      console.log(this.flag);
      this.importUrl=importUrl;
      // if(this.flag=='工单导入'){
      //   this.importUrl='https://sale.zeepson.com/api/postsale/worksheet.import'
      // }
      console.log(this.importUrl);
      if (this.flag.indexOf("导入") == -1) {
        // alert(this.flag);
        this.upelement = false;
      } else {
        // alert(this.flag);
        this.upelement = true;
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    httpRequest(file) {
      console.log(file);
      console.log(file.file);

      var reader = new FileReader();
      reader.readAsDataURL(file.file);

      reader.onload = e => {
        console.log(e.target.result);
        var excleDatas = e.target.result.split(",");
        excleDatas.shift();
        console.log(excleDatas);
        this.worksheetDatas = excleDatas;
      };
    },
    sureHandle() {
      this.dialogVisible = false;
      if (this.flag == "工单导入") {
        //   工单导入数据
        this.upelement = true;
        // var formData = new FormData();
        var formData = new URLSearchParams();
        formData.append("sid", window.sessionStorage.getItem("sid"));
        formData.append("file", this.worksheetDatas);
        this.$http_
          .post(
            this.GLOBAL.baseUrl + "/worksheet.import",
            // 'http://localhost:9010/worksheet.import',
            formData,
            {
              //   responseType: "blob",
              headers: {
                "Content-Type": "multipart/form-data"
                // responseType: "blob"
              },
              emulateJSON: true
              //   dataType: "form"
            }
          )
          .then(({ data }) => {
            console.log(data);
          });
      } else if (this.flag == "工单导出") {
        this.upelement = false;
        //  工单导出数据
        this.$http_
          .post(
            this.GLOBAL.baseUrl + "/worksheet.export",
            {
              sid: window.sessionStorage.getItem("sid")
            },
            {
              responseType: "blob",
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                responseType: "blob"
              }
            }
          )
          .then(({ data }) => {
            console.log(data);
            const link = document.createElement("a");
            let blob = new Blob([data], {
              type: "application/vnd.ms-excel;charset=UTF-8"
            });
            console.log(blob);
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            let num = "";
            for (let i = 0; i < 10; i++) {
              num += Math.ceil(Math.random() * 10);
            }
            link.setAttribute("download", "用户_" + num + ".xls");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
      } else if (this.flag == "知识库导出") {
        // 知识库导出
        this.upelement = false;
        this.$http_
          .post(
            this.GLOBAL.baseUrlxg + "/knowledge/export",
            {
              sid: window.sessionStorage.getItem("sid")
            },
            {
              responseType: "blob",
              headers: {
                // "Content-Type": "application/json;charset=UTF-8",
                // responseType: "blob"
              }
            }
          )
          .then(({ data }) => {
            console.log(data);
            const link = document.createElement("a");
            let blob = new Blob([data], {
              type: "application/vnd.ms-excel;charset=UTF-8"
            });
            console.log(blob);
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            let num = "";
            for (let i = 0; i < 10; i++) {
              num += Math.ceil(Math.random() * 10);
            }
            link.setAttribute("download", "用户_" + num + ".xls");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
      } else if (this.flag == "知识库导入") {
        // 知识库导入
        // var formData = new FormData();
        // // var formData=new URLSearchParams()
        // formData.append("sid", window.sessionStorage.getItem('sid'));
        // formData.append("file", this.worksheetDatas);
        var formData = {
          sid: window.sessionStorage.getItem("sid"),
          file: this.worksheetDatas
        };
        this.$http_
          .post(
            this.GLOBAL.baseUrlxg + "/knowledge/import",
            // 'http://localhost:9010/worksheet.import',
            formData,
            {
              //   responseType: "blob",
              headers: {
                // "Content-Type": "application/json"
                "Content-Type": "multipart/form-data"
                // responseType: "blob"
              }
              // dataType: "form"
            }
          )
          .then(({ data }) => {
            console.log(data);
          });
      } else if (this.flag == "产品列表导出") {
        this.upelement = false;
        // 产品列表导出
        this.$http_
          .post(
            this.GLOBAL.baseUrlxg + "/productinfo/export",
            {
              sid: window.sessionStorage.getItem("sid")
            },
            {
              responseType: "blob",
              headers: {
                // "Content-Type": "application/json;charset=UTF-8",
                // responseType: "blob"
              }
            }
          )
          .then(({ data }) => {
            console.log(data);
            const link = document.createElement("a");
            let blob = new Blob([data], {
              type: "application/vnd.ms-excel;charset=UTF-8"
            });
            console.log(blob);
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            let num = "";
            for (let i = 0; i < 10; i++) {
              num += Math.ceil(Math.random() * 10);
            }
            link.setAttribute("download", "用户_" + num + ".xls");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
      } else if (this.flag == "产品列表导入") {
      } else if (this.flag == "发货记录导出") {
        // 发货记录导出
        this.upelement = false;
        this.$http_
          .post(
            this.GLOBAL.baseUrlxg + "/shipping/export",
            {
              sid: window.sessionStorage.getItem("sid")
            },
            {
              responseType: "blob",
              headers: {
                // "Content-Type": "application/json;charset=UTF-8",
                // responseType: "blob"
              }
            }
          )
          .then(({ data }) => {
            console.log(data);
            const link = document.createElement("a");
            let blob = new Blob([data], {
              type: "application/vnd.ms-excel;charset=UTF-8"
            });
            console.log(blob);
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            let num = "";
            for (let i = 0; i < 10; i++) {
              num += Math.ceil(Math.random() * 10);
            }
            link.setAttribute("download", "用户_" + num + ".xls");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
      }
    }
  }
};
</script>