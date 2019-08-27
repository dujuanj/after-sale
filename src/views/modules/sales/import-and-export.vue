<template>
  <el-dialog :title="flag" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
    <div v-if="upelement">
      <el-upload
        class="upload-demo"
        ref="upload"
        
        :http-request="httpRequest"
      >
        <el-button slot="trigger" size="small" type="primary">请选取导入的文件</el-button>
      </el-upload>
    </div>
    <div v-else style="color:#E6A23C" class="el-icon-warning-outline">请确认当前此操作!</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
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
      upelement: true, //工单导入
      worksheetDatas:''//工单导入数据
    };
  },
  methods: {
    init(flag) {
      this.dialogVisible = true;
      this.flag = flag;
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
            console.log(e.target.result)
            var excleDatas=e.target.result.split(",");
            excleDatas.shift();
            console.log(excleDatas);
            this.worksheetDatas=excleDatas;
        };
    },
    sureHandle() {
      this.dialogVisible = false;
      if (this.flag == "工单导入") {
        //   工单导入数据
        this.upelement = true;
        // var formData = new FormData();
        var formData=new URLSearchParams()
        formData.append("sid", window.sessionStorage.getItem('sid'));
        formData.append("file", this.worksheetDatas);
         this.$http_
          .post(
            // this.GLOBAL.baseUrl + "/worksheet.import",
            'http://localhost:9010/worksheet.import',
            formData,
            {
            //   responseType: "blob",
              headers: {
                "Content-Type": "multipart/form-data"
                // responseType: "blob"
              }
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
      }
    }
  }
};
</script>