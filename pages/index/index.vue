<template>
	<view class="content">
		<van-field
            value="123"
            label="初始本金"
            maxlength="10"
            type="number"
            input-align="right"
            use-icon-slot
            size="large"
            placeholder="请输入本金"
          >
            <view slot="icon">元</view>
          </van-field>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
