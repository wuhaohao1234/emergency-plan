<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <!-- 使用textarea作为编辑器的输入框 -->
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <!-- 添加自定义按钮容器 -->
    <div class="editor-custom-btn-container">
      <!-- 调用自定义的图片上传组件 -->
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
    </div>
  </div>
</template>

<script>
// 导入编辑器图片组件
import editorImage from './components/EditorImage'
// 导入插件和工具栏
import plugins from './plugins'
import toolbar from './toolbar'
// 导入动态加载脚本函数
import load from './dynamicLoadScript'
import {getToken} from "@/utils/auth";
import {viewFile} from "@/api/file";
// Tinymce CDN链接
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function() {
        // 默认生成唯一id
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      // 定义语言类型列表
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          // 设置编辑器内容
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    // 初始化编辑器
    this.init()
  },
  activated() {
    // 在组件激活时检查Tinymce是否已加载
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    // 在组件失活时销毁Tinymce
    this.destroyTinymce()
  },
  destroyed() {
    // 在组件销毁时销毁Tinymce
    this.destroyTinymce()
  },
  methods: {
    // 初始化编辑器
    init() {
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    // 初始化Tinymce
    initTinymce() {
      const _this = this
      window.tinymce.init({
        // 选择编辑器的目标元素，这里使用组件中定义的 tinymceId
        selector: `#${this.tinymceId}`,
        // 指定编辑器的语言，这里使用组件中定义的 languageTypeList 中文（zh）
        language: this.languageTypeList['zh'],
        // 指定编辑器的高度，这里使用组件中定义的 height
        height: this.height,
        // 设置编辑器内容区域的类名，这里为 panel-body
        body_class: 'panel-body ',
        // 禁用对象调整大小功能
        object_resizing: false,
        // 隐藏编辑器的状态栏
        statusbar: false,
        // 指定编辑器的工具栏，如果组件中定义了自定义的工具栏，则使用该工具栏，否则使用默认的工具栏（toolbar）
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        // 设置是否显示编辑器的菜单栏，这里使用组件中定义的 menubar
        menubar: false,
        // 指定编辑器使用的插件，这里使用组件中定义的插件列表（plugins）
        plugins: plugins,
        // 在空块元素上结束容器
        end_container_on_empty_block: true,
        // Word 粘贴的处理方式为 'clean'
        powerpaste_word_import: 'clean',
        // 设置代码对话框的高度
        code_dialog_height: 450,
        // 设置代码对话框的宽度
        code_dialog_width: 1000,
        // 设置列表的样式
        advlist_bullet_styles: 'square',
        // 设置编号列表的样式
        advlist_number_styles: 'default',
        // 设置图像工具的跨域主机
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        // 设置链接的默认打开方式为 '_blank'
        default_link_target: '_blank',
        // 禁用链接的标题提示
        link_title: false,
        // 强制在非断行空格之前插入制表符
        nonbreaking_force_tab: true,
        // 初始化完成后的回调函数
        init_instance_callback: editor => {
          if (_this.value) {
            // 设置编辑器内容
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
          // 设置图片上传的处理函数
          editor.on('preinit', () => {
            editor.settings.images_upload_handler = function (blobInfo, success, failure) {
              // 构建表单数据
              const formData = new FormData();
              formData.append('file', blobInfo.blob(), blobInfo.filename);

              // 发送POST请求到后端
              fetch(process.env.VUE_APP_BASE_API + "/file/upload", {
                method: 'POST',
                body: formData,
                headers: {
                  Authorization: "Bearer " + getToken(),
                },
              })
                .then(response => {
                  console.log(response.json);
                  // 返回的数据为文件流，将其作为图片URL插入到编辑器中
                  if (response.ok) {
                    // 解析返回的 JSON 数据
                    // 等待两个异步操作完成后再返回结果
                    return response.json();
                  }
                  throw new Error('Network response was not ok.');
                })
                .then(jsonData => {
                  console.log("Received blob:", jsonData);
                  let fileKey = jsonData.data.fileKey;
                  let data = {fileKey, token: getToken()}
                  // const reader = new FileReader();
                  viewFile(data).then(res => {
                    let fileType = 'application/octet-stream'
                    // 转换为 Blob 对象
                    const blob = new Blob([res], {type: fileType});
                    const url = URL.createObjectURL(blob);
                    console.log("Base64 URL:", url);
                    success(url);
                  });
                  // reader.readAsDataURL(blobData);
                })
                .catch(error => {
                  console.error('Error:', error);
                  failure('Image upload failed');
                });
            };
          });
        },
        convert_urls: false
      })
    },
    // 销毁Tinymce
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    // 设置编辑器内容
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    // 获取编辑器内容
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    // 图片上传成功回调函数
    imageSuccessCBK(arr) {
      // 插入图片到编辑器中
      const editor = window.tinymce.get(this.tinymceId)
      // 插入上传成功的图片到编辑器中
      arr.forEach(v => {
        // 如果图片上传后端接口返回的是文件流，则需要进行相应处理，例如将文件流转换成图片url
        const imageUrl = 'data:image/jpeg;base64,' + v.fileStream // 假设文件流是base64编码的图片数据
        editor.insertContent(`<img class="wscnph" src="${imageUrl}"  alt="">`)
      })      }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
