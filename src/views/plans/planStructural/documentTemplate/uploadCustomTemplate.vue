<!--定制模板上传-->
<template>
  <div id="uploadCustomTemplate">
    <el-page-header @back="goBack" content="文书定制模板上传"></el-page-header>
    <el-form style="margin-top: 20px" :model="form" ref="form" label-width="100px" :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-form-item label="文书名称" prop="documentName" label-width="100px">
            {{ detailInfo.documentName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建部门" prop="documentName" label-width="100px">
            {{ detailInfo.crateDeptName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建人" prop="typeList">
            {{ detailInfo.crateUserName+"-"+detailInfo.crateUserPhone }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="创建时间" prop="typeList">
            {{ detailInfo.createTime }}
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="文书文件">
            <download-file v-if="detailInfo.sourceFile" v-for="item in detailInfo.sourceFile" :key="item.fileKey"
                           :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="文书分类" prop="typeList">
            <el-tag style="margin:0 10px 10px 0" v-if="detailInfo.type"
                    v-for="(item,index) in buildTypeLabel(detailInfo.type)" :key="index">
              <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
              /
              <dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])" :value="item[1]"/>
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="使用部门">
            <el-tag style="margin:0 5px 5px 0" type="primary" v-if="detailInfo.useDept"
                    v-for="(item,index) in detailInfo.useDeptName"
                    :key="index">{{item}}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="224">
          <el-form-item label="模板编号" prop="templateCode">
            <el-input
              v-model="form.templateCode"
              placeholder="请输入模板编号"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="模板文件" prop="fileData">
            <file-upload :value="form.fileData" :limit="1" :fileSize="5" :fileType="['doc', 'docx']"
                         @input="getFile"></file-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="footer" align="right" style="margin-top: 50px">
        <el-form-item>
          <el-button @click="cancelHandle">取消</el-button>
          <el-button type="primary" @click="saveHandle">确定</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {uploadTemplate, findById, documentList} from '@/api/plans/structural'

export default {
  dicts: ['4', '26', '601', '608', '611', '622', '531'],
  name: "uploadCustomTemplate",
  data() {
    var checkTemplateCode = (rule, value, callback) => {
      if (value) {
        let data = {id: this.detailInfo.id, templateCode: value}
        documentList(data).then(res => {
          if (res.code === 200 && res.data.length > 0) {
            callback(new Error('模板编号已存在'))
          } else {
            callback()
          }
        })
      } else {
        callback(new Error('模板编号不能为空'))
      }
    }
    return {
      form: {
        templateCode: '',
        templateFile: '',
        fileData:undefined,
      },
      detailInfo: {
        type: ''
      },
      rules: {
        templateCode: [
          {required: true, validator: checkTemplateCode, trigger: "blur"}
        ],
        fileData: [
          {required: true, message: "模板文件不能为空", trigger: "blur"}
        ],
      },
    }
  },
  watch: {
    'form.templateCode'(newVal, oldVal) {
      if (newVal) {

      }
    }
  },
  methods: {
    init(id) {
      findById(id).then(res => {
        if (res.code === 200) {
          this.detailInfo = res.data
          this.detailInfo.sourceFile = JSON.parse(res.data.sourceFile)
          this.form.fileData = JSON.parse(res.data.templateFile)
          this.form.templateCode = res.data.templateCode
          this.detailVisible = true
        }
      })
    },
    /**
     * 构建类型信息
     */
    buildTypeLabel(val) {
      let pType = val.split(';');
      let typeList = []
      pType.filter(Boolean).forEach(item => {
        let arr = item.split(',')
        typeList.push(arr.map(Number));
      })
      return typeList;
    },
    /**
     * 获取对应字典
     * @param val
     */
    getOptions(val) {
      let options = undefined
      switch (val) {
        case 274:
          options = this.dict.type['601']
          break;
        case 275:
          options = this.dict.type['608']
          break;
        case 276:
          options = this.dict.type['611']
          break;
        case 277:
          options = this.dict.type['622']
          break;
      }
      return options;
    },
    /**
     * 取消
     */
    cancelHandle() {
      this.$emit('goBack')
    },
    /**
     * 返回
     */
    goBack() {
      this.$emit('goBack')
    },
    getFile(file) {
      this.form.fileData = file
    },
    /**
     * 保存
     */
    saveHandle() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = {
            id: this.detailInfo.id,
            templateCode: this.form.templateCode,
            templateFile: JSON.stringify(this.form.fileData)
          }
          uploadTemplate(data).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功')
              this.$emit('goBack')
            }
          })
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
