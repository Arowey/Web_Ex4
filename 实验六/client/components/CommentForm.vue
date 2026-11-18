<template>
  <view class="form">
    <view class="form__row">
      <view class="field field--name">
        <text class="field__label">昵称</text>
        <input
          class="field__input"
          :value="form.name"
          placeholder="不填就是匿名同学"
          placeholder-class="field__placeholder"
          maxlength="12"
          @input="form.name = $event.detail.value"
        />
      </view>

      <view class="field">
        <text class="field__label">打分</text>
        <StarRating v-model="form.rating" />
      </view>
    </view>

    <view class="field">
      <text class="field__label">吃后感</text>
      <textarea
        class="field__textarea"
        :value="form.content"
        placeholder="说说味道、分量、价格，至少 5 个字…"
        placeholder-class="field__placeholder"
        maxlength="200"
        @input="form.content = $event.detail.value"
      />
    </view>

    <view class="form__footer">
      <text class="form__hint">
        {{ form.content.length }} / 200
        <text v-if="!canSubmit" class="form__need">· 还差 {{ needMore }} 个字</text>
      </text>

      <BaseButton size="sm" :disabled="!canSubmit" @tap="onSubmit">发表评论</BaseButton>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive } from 'vue'
import StarRating from './StarRating.vue'
import BaseButton from './BaseButton.vue'

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  rating: 5,
  content: ''
})

// 内容满 5 个字才允许提交
const canSubmit = computed(() => form.content.trim().length >= 5)
const needMore = computed(() => Math.max(0, 5 - form.content.trim().length))

function onSubmit() {
  if (!canSubmit.value) return

  emit('submit', {
    name: form.name.trim() || '匿名同学',
    rating: form.rating,
    content: form.content.trim()
  })

  // 提交后清空内容，评分回到 5 星
  form.content = ''
  form.rating = 5
}
</script>

<style scoped>
.form {
  padding: 26rpx;
  background-color: #ffffff;
  border: 1rpx solid #ece1d5;
  border-radius: 28rpx;
}

.form__row {
  display: flex;
  align-items: flex-end;
}

.field {
  margin-bottom: 20rpx;
}

.field--name {
  flex: 1;
  margin-right: 24rpx;
}

.field__label {
  display: block;
  font-size: 22rpx;
  color: #6b5b4e;
  margin-bottom: 10rpx;
}

.field__input {
  height: 76rpx;
  padding: 0 20rpx;
  background-color: #fdfbf8;
  border: 1rpx solid #ece1d5;
  border-radius: 16rpx;
  font-size: 26rpx;
}

.field__textarea {
  width: 100%;
  height: 160rpx;
  padding: 16rpx 20rpx;
  background-color: #fdfbf8;
  border: 1rpx solid #ece1d5;
  border-radius: 16rpx;
  font-size: 26rpx;
}

.field__placeholder {
  color: #b8a897;
}

.form__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form__hint {
  font-size: 20rpx;
  color: #a08f80;
}

.form__need {
  color: #d9603b;
}
</style>
