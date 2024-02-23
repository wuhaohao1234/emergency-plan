<!--便捷导航-->
<template>
  <div class="easy-nav">
    <el-dialog
      :close-on-click-modal="false"
      title="便捷导航设置"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">
      <el-tag type="info" v-for="(item,index) in myNavList"
              :key="item.menuId"
              style="margin:20px 10px 0 0">
        <span class="nav-tag">
          <el-button type="text" class="tag-button tag-button-del" :disabled="myNavList.length<4" @click="delEasyNavHandle(item,index)"><i
            class="el-icon-error"></i></el-button>
        <a>{{ item.meta.title }}</a>
        </span>
      </el-tag>
      <el-divider></el-divider>
      <el-tag class="tag-color" type="info" v-for="(item,index) in otherNavList"
              :key="item.menuId"
              style="margin:20px 10px 0 0">
        <span class="nav-tag">
          <el-button type="text" class="tag-button tag-button-add" @click="addEasyNavHandle(item,index)"><i
            class="el-icon-circle-plus"></i></el-button>
        <a>{{ item.meta.title }}</a>
        </span>
      </el-tag>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmHandle">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {updateEasyNav} from '@/api/system/user'

export default {
  name: "easy_nav",
  data() {
    return {
      dialogVisible: false,
      organBusiness: [],
      deptBusiness: [],
      otherNavList: [],
      myNavList: [],
      businessType: 1
    }
  },
  methods: {
    init() {
      this.dialogVisible = true
      this.getMenus()

    },
    handleClose() {
      this.dialogVisible = false
    },
    //获取业务快捷菜单
    getMenus() {
      this.organBusiness = []
      this.otherNavList = []
      this.myNavList = []
      let allMenus = sessionStorage.getItem('ALL_MENU');//所有菜单
      this.businessType = sessionStorage.getItem('BUSINESS_TYPE');//业务类型
      let menus = JSON.parse(allMenus).filter(item => item.name !== 'System')
      menus.forEach(item => {
        item.children.forEach(c => {
          c.parent = item
          if(!c.menuId){
            c.menuId=item.menuId
          }
        })
        this.organBusiness = this.organBusiness.concat([...item.children])
      })
      this.organBusiness = this.organBusiness.filter(item => !item.meta.title.includes('驾驶舱') && !item.meta.title.includes('领导看板'))
      this.deptBusiness = this.organBusiness.filter(item => item.businessType.includes('2'))
      //根据当前业务判断选用哪个快捷菜单
      if (this.businessType == '1') {
        let ogEasyNav = JSON.parse(sessionStorage.getItem('OG_EASY_NAV'));//机关快捷菜单
        let menuIds = ogEasyNav.map(item => item.menuId)
        this.organBusiness.forEach(item => {
          if (menuIds.includes(item.menuId)) {
            this.myNavList.push(item)
          } else {
            this.otherNavList.push(item)
          }
        })
      } else {
        let enEasyNav = JSON.parse(sessionStorage.getItem('EN_EASY_NAV'));//部门快捷菜单
        let menuIds = enEasyNav.map(item => item.menuId)
        this.deptBusiness.forEach(item => {
          if (menuIds.includes(item.menuId)) {
            this.myNavList.push(item)
          } else {
            this.otherNavList.push(item)
          }
        })
      }
    },
    /**
     * 删除快捷菜单
     */
    delEasyNavHandle(menu, index) {
      this.myNavList.forEach((item, i) => {
        if (item.menuId == menu.menuId) {
          this.myNavList.splice(i, 1)
          this.otherNavList.push({...item})
        }
      })

    },
    /**
     * 添加快捷菜单
     */
    addEasyNavHandle(menu, index) {
      this.otherNavList.forEach((item, i) => {
        if (item.menuId == menu.menuId) {
          this.otherNavList.splice(i, 1)
          this.myNavList.push(item)
        }
      })
    },
    /**
     * 确定修改快捷菜单
     */
    confirmHandle() {
      let arr=[]
      this.myNavList.forEach(item=>{
        let data={
          meta:item.meta,
          path:item.path,
          menuId:item.menuId,
          parent:{
            path:item.parent.path
          }
        }
        arr.push(data)
      })
      let str = JSON.stringify(arr)
      let data = {
        enEasyNav: this.businessType == '2' ? str : '',
        ogEasyNav: this.businessType == '1' ? str : ''
      }
      updateEasyNav(data).then(res => {
        this.dialogVisible=false;
        sessionStorage.setItem(this.businessType=='1'?'OG_EASY_NAV':'EN_EASY_NAV',str)
        this.$emit('goBack')
        this.$modal.msgSuccess('操作成功')
      })
    }

  }
}
</script>

<style lang="scss">
.easy-nav {
  .el-tag {
    color: #1d1e1f;
    padding: 0 30px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }

  .tag-color {
    background-color: white;
  }

  .nav-tag {
    position: relative;

    .tag-button {
      position: absolute;
      right: -33px;
      bottom: 3px;
      font-size: 20px;
    }

    .tag-button-del {
      color: #ea0c0c;
    }

    .tag-button-add {
      color: #0099ff;
    }

  }

}
</style>
