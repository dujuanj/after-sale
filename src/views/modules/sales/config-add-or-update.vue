<template>
  <el-dialog
    :title="!dataForm.id ? '新建工单' : '修改工单'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="工单编号" prop="paramKey">
        <el-input v-model="dataForm.paramKey" placeholder="工单编号"></el-input>
      </el-form-item> <br>
      <el-form-item label="客户姓名" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="客户姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>
      </el-form-item>
       <el-form-item label="地址" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>
        
      </el-form-item> <br>
       <el-form-item label="Mac地址" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>        
      </el-form-item> <br>
       <el-form-item label="产品类型" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>        
      </el-form-item>
        <el-form-item label="产品型号" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>        
      </el-form-item>
     
        <el-form-item label="投诉问题" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>        
      </el-form-item>
        <el-form-item label="问题描述" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>        
      </el-form-item>
        <el-form-item label="处理方式" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>        
      </el-form-item>
       <el-form-item label="服务人员" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>        
      </el-form-item>
       <el-form-item label="服务时间" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>        
      </el-form-item>
       <el-form-item label="备注" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="电话"></el-input>        
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
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          paramKey: '',
          paramValue: '',
          remark: ''
        },
        dataRule: {
          paramKey: [
            { required: true, message: '参数名不能为空', trigger: 'blur' }
          ],
          paramValue: [
            { required: true, message: '参数值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.paramKey = data.config.paramKey
                this.dataForm.paramValue = data.config.paramValue
                this.dataForm.remark = data.config.remark
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/config/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'paramKey': this.dataForm.paramKey,
                'paramValue': this.dataForm.paramValue,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .el-dialog{
    width:33%;
  }
</style>

