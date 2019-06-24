<template>
	<view>
		<nx-cell @tap="goInstallment" icon="/static/bag.png" border title="分期利率计算器"></nx-cell>
		<nx-cell @tap="goHouseModel" icon="/static/home.png" border title="二手房投资估算器"></nx-cell>
		<button open-type="contact">
			<nx-cell icon="/static/service.png" border title="我要吐槽"></nx-cell>
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
	let interstitialAd = null
	export default {
		data() {
			return {}
		},
		onLoad() {
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-4f25f03f655b4f65'
				})
				interstitialAd.onError((err) => {})
				interstitialAd.onClose((res) => {})
			}
		},
		onShow() {
			if (interstitialAd) {
				interstitialAd.show().catch((err) => {})
			}
		},
		methods: {
			goHouseModel() {
				uni.navigateTo({
					url: '../houseModel/houseModel'
				})
			},
			goInstallment() {
				uni.navigateTo({
					url: '../installment/installment'
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
		all:initial
	}
	button:after {
		all:initial
	}
</style>
