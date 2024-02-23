export default {
  install(Vue) {
    Vue.directive('preventReClick', {
      inserted(el, binding) {
        el.addEventListener('click', () => {
          if (!el.disabled) {
            el.disabled = true
            setTimeout(() => {
              el.disabled = false
            }, binding.value || 1000) // 默认1秒内禁止提交
          }
        })
      }
    })
  }
}
