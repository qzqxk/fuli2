<template>
	<view style="padding-bottom: 280upx;">
		<view class="text-df">
			<view v-if="calculationOptions!=2" class="cu-form-group">
				<view class="title">
					每期金额
				</view>
				<input placeholder="请输入每期定投金额" v-model="fixedMoney" type="digit"></input>
				<view class="action">
					<text>元</text>
				</view>
			</view>
			<view v-show="calculationOptions!=3" class="cu-form-group">
				<view class="title">
					定投期数
				</view>
				<input placeholder="请输入你要定投的总期数" v-model="fixedTime" type="digit"></input>
				<view class="action">
					<text>年</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					定投周期
				</view>
				<view class="flex justify-around flex-grow-1">
					<button class="cu-btn" :class="period==0?active:inactive" @tap="period=0">每周</button>
					<button class="cu-btn" :class="period==1?active:inactive" @tap="period=1">每两周</button>
					<button class="cu-btn" :class="period==2?active:inactive" @tap="period=2">每月</button>
				</view>
			</view>
			<view v-show="calculationOptions!=1" class="cu-form-group">
				<view class="title">
					年收益率
				</view>
				<input placeholder="请输入年复合收益率" v-model="expectInterest" type="digit"></input>
				<view class="action">
					<text>%</text>
				</view>
			</view>
			<view v-show="calculationOptions!=0" class="cu-form-group">
				<view class="title">
					期末资产
				</view>
				<input placeholder="请输入期末总资产" v-model="futureValue" type="digit"></input>
				<view class="action">
					<text>元</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">高级选项</view>
				<switch @change="switchChange" :class="open?'checked':''" :checked="open?true:false"></switch>
			</view>
			<view v-show="open" class="flex justify-around py-3 bg-white">
				<button class="cu-btn" :class="calculationOptions==0?active:inactive" @tap="calculationOptions=0">算终值</button>
				<button class="cu-btn" :class="calculationOptions==1?active:inactive" @tap="calculationOptions=1">算利率</button>
				<button class="cu-btn" :class="calculationOptions==2?active:inactive" @tap="calculationOptions=2">算定投金额</button>
				<button class="cu-btn" :class="calculationOptions==3?active:inactive" @tap="calculationOptions=3">算期数</button>
			</view>
		</view>
		<view class="padding mt-5">
			<button class="weui-btn" type="primary" @tap="toResult">开始计算</button>
			<button class="weui-btn" type="default" open-type="contact">我要吐槽</button>
		</view>
		<view class="fixed-bottom p-3">
			<ad unit-id="adunit-64fe28fc7b3797b6"></ad>
		</view>
	</view>
</template>

<script>
	import { isNotNumber } from '../../common/js/common.js';
	let interstitialAd = null;
	export default {
		data() {
			return {
				calculationOptions: 0, //计算选项
				period: 2, //周期
				fixedMoney: '', //每期定投金额
				fixedTime: '', //定投时长
				expectInterest: '', //复合收益率
				futureValue: '', //终值
				active: 'bg-green', //按钮活跃样式
				inactive: 'line-gray shadow', //按钮不活跃样式
				open: false
			}
		},
		onLoad() {
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-4f25f03f655b4f65'
				})
				interstitialAd.onError((err) => {
				})
				interstitialAd.onClose((res) => {
				})
			}
		},
		onShow() {
			if (interstitialAd) {
				interstitialAd.show().catch((err) => {
				})
			}
		},
		methods: {
			switchChange(e) {
				this.open = e.detail.value;
			},
			/**
			 * 跳转计算结果页面
			 */
			toResult() {
				//校验输入是否正确
				if (this.calculationOptions != 2 && isNotNumber(this.fixedMoney)) {
					uni.showToast({
						title: '请输入正确的定投金额',
						icon: 'none'
					})
					return;
				} else if (this.calculationOptions != 3 && isNotNumber(this.fixedTime)) {
					uni.showToast({
						title: '请输入正确的定投期数',
						icon: 'none'
					})
					return;
				} else if (this.calculationOptions != 1 && isNotNumber(this.expectInterest)) {
					uni.showToast({
						title: '请输入正确的收益率',
						icon: 'none'
					})
					return;
				} else if (this.calculationOptions != 0 && isNotNumber(this.futureValue)) {
					uni.showToast({
						title: '请输入正确的终值',
						icon: 'none'
					})
					return;
				}
				//存储计算参数
				uni.setStorageSync('parameter', {
					option: this.calculationOptions,
					period: this.period,
					fixedMoney: Number(this.fixedMoney), //每期定投金额
					fixedTime: Number(this.fixedTime), //定投时长
					expectInterest: Number(this.expectInterest), //复合收益率
					futureValue: Number(this.futureValue), //终值
				});
				uni.navigateTo({
					url: '../fixedResult/fixedResult'
				})
			},
		}
	}
</script>

<style>
	/* 防止表单标题长短不一 */
	.cu-form-group .title {
		min-width: 200upx;
	}
</style>