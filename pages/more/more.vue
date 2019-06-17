<template>
	<view>
		<guide v-if="showGuide"></guide>
		<nx-cell icon="/static/moreMoneySelect.png" border title="定投计算器" @tap="goCompound"></nx-cell>
		<fuli-cell url="../installment/installment" title="分期利率计算器" icon="/static/bag.png"></fuli-cell>
		<fuli-cell url="../houseModel/houseModel" title="二手房投资估算器" icon="/static/home.png"></fuli-cell>
		<button open-type="contact">
			<fuli-cell title="意见反馈" icon="/static/service.png"></fuli-cell>
		</button>
		<button open-type="share">
			<nx-cell icon="/static/share.png" title="分享给好友"></nx-cell>
		</button>
		<view class="fixed-bottom p-3">
			<ad unit-id="adunit-64fe28fc7b3797b6"></ad>
		</view>
	</view>
</template>

<script>
	import nxCell from '../../components/nx-cell.vue';
	export default {
		data() {
			return {}
		},
		methods: {
			tipAttention() {
				this.showGuide = true;
				setTimeout(() => {
					this.showGuide = false;
				}, 4000)
			},
			goCompound() {
				wx.navigateToMiniProgram({
					appId: 'wxd44da5e300b3e1a0'
				})
			},
			onShareAppMessage() {
				return {
					title: '复利计算器',
					path: '/pages/compound/compound'
				}
			},
		},
		components: {
			nxCell
		}
	}
</script>

<style>
	.fuli-cell {
		background: white;
		color: #353535;
	}

	.fuli-cell-left {
		padding: 31rpx 36rpx;
	}

	.fuli-cell-right {
		font-size: 36rpx;
		padding: 31rpx 26rpx 31rpx 0;
	}

	.fuli-cell-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.fuli-cell-active {
		background-color: #e5e5e5;
	}

	button {
		padding: 0;
		line-height: 1.6;
		font-size: initial;
		text-align: initial;
		border-radius: inherit;
	}

	button:after {
		border: none;
		border-radius: 0;
	}
</style>
