<template>
  <view class="search">
    <text class="search__icon">🔍</text>

    <input
      class="search__input"
      :value="modelValue"
      :placeholder="placeholder"
      placeholder-class="search__placeholder"
      confirm-type="search"
      @input="onInput"
    />

    <!-- v-if 控制清除按钮，输入框为空时不显示 -->
    <view v-if="modelValue" class="search__clear" @tap="clear">
      <text class="search__clear-icon">✕</text>
    </view>
  </view>
</template>

<script setup>
// 自定义 v-model：父组件写 <SearchBar v-model="keyword" /> 即可
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '搜索…' }
})

const emit = defineEmits(['update:modelValue'])

function onInput(event) {
  // 注意：小程序里取输入值用 event.detail.value，不是 event.target.value
  emit('update:modelValue', event.detail.value)
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.search {
  display: flex;
  align-items: center;
  height: 84rpx;
  padding: 0 26rpx;
  background-color: #ffffff;
  border: 1rpx solid #ece1d5;
  border-radius: 999rpx;
}

.search__icon {
  font-size: 26rpx;
  margin-right: 12rpx;
}

.search__input {
  flex: 1;
  font-size: 26rpx;
  color: #241c16;
}

.search__placeholder {
  color: #b8a897;
}

.search__clear {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background-color: #f2e8dc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search__clear-icon {
  font-size: 18rpx;
  color: #6b5b4e;
  line-height: 1;
}
</style>
