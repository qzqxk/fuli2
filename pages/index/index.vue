<template>
	<view class="text-df" style="padding-bottom: 280upx;">
		<view v-show="calculationOptions!=2" class="cu-form-group">
			<view class="title">
				本金
			</view>
			<input placeholder="请输入" v-model="presentValue" type="digit"></input>
			<picker @change="moneyUnitChange" :range="moneyUnitColumns">
				<view class="action">
					<text>{{moneyUnit}}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</picker>
		</view>
		<view v-show="calculationOptions!=3" class="cu-form-group">
			<view class="title">
				期数
			</view>
			<input placeholder="请输入" v-model="fixedTime" type="number"></input>
			<picker @change="bindFixedTimeUnitChange" :range="fixedTimeColumns">
				<view class="action">
					<text>{{fixedTimeUnit}}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</picker>
		</view>
		<view v-show="calculationOptions!=1" class="cu-form-group">
			<view class="title">利率</view>
			<input placeholder="请输入" v-model="expectInterest" type="digit"></input>
			<picker @change="bindExpectInterestUnitChange" :range="expectInterestColumns">
				<view class="action">
					<text>%{{expectInterestUnit}}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</picker>
		</view>
		<view v-show="calculationOptions!=0" class="cu-form-group">
			<view class="title">终值</view>
			<input placeholder="请输入" v-model="futureValue" type="digit"></input>
			<picker @change="moneyUnitChange" :range="moneyUnitColumns">
				<view class="action">
					<text>{{moneyUnit}}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</picker>
		</view>

		<view class="cu-form-group">
			<view class="title">高级选项</view>
			<switch @change="switchChange" :class="open?'checked':''" :checked="open?true:false"></switch>
		</view>
		<view v-show="open" class="flex justify-around py-3 bg-white">
			<button class="cu-btn" :class="calculationOptions==0?active:inactive" @tap="calculationOptions=0">算终值</button>
			<button class="cu-btn" :class="calculationOptions==1?active:inactive" @tap="calculationOptions=1">算利率</button>
			<button class="cu-btn" :class="calculationOptions==2?active:inactive" @tap="computePresent">算本金</button>
			<button class="cu-btn" :class="calculationOptions==3?active:inactive" @tap="calculationOptions=3">算期数</button>
		</view>
		<view class="padding mt-5">
			<button class="weui-btn" type="primary" @tap="toResult">开始计算</button>
			<!-- #ifdef MP-WEIXIN -->
			<button class="weui-btn" type="default" open-type="contact">我要吐槽</button>
			<!-- #endif -->
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="fixed-bottom p-3">
			<ad unit-id="adunit-64fe28fc7b3797b6"></ad>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	let interstitialAd = null;
	//判断是否首次进入小程序
	let first = true;
	// #endif
	import {
		isNotNumber
	} from '../../common/js/common.js';
	export default {
		data() {
			return {
				calculationOptions: 0, //计算选项
				presentValue: '', //现值
				fixedTime: '', //期数
				expectInterest: '', //利率
				fixedTimeColumns: ['年', '月', '日'], //期数单位集合
				fixedTimeUnit: '年', //期数单位
				expectInterestColumns: ['年利率', '月利率', '日利率'], //利率单位集合
				expectInterestUnit: '年利率', //利率单位
				moneyUnitColumns: ['元', '万'],
				moneyUnit: '元',
				open: false,
				active: 'bg-green shadow-blur', //按钮活跃样式
				inactive: 'line-gray shadow', //按钮不活跃样式
				futureValue: '', //终值
			}
		},
		// #ifdef MP-WEIXIN
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
			if (!first && interstitialAd) {
				interstitialAd.show().catch((err) => {})
			}
			first = false;
		},
		// #endif
		onShareAppMessage(res) {
			return {
				title: '复利计算器',
				path: '/pages/index/index'
			};
		},
		methods: {
			computePresent() {
				this.calculationOptions = 2;
				this.fixedTimeUnit = this.expectInterestUnit.substr(0, 1);
			},
			switchChange(e) {
				this.open = e.detail.value;
			},
			/**
			 * 跳转计算结果页面
			 */
			toResult() {
				//校验输入是否正确
				if (this.calculationOptions != 2 && isNotNumber(this.presentValue)) {
					uni.showToast({
						title: '请输入正确的本金',
						icon: 'none'
					})
					return;
				} else if (this.calculationOptions != 3 && isNotNumber(this.fixedTime)) {
					uni.showToast({
						title: '请输入正确的期数',
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
				uni.setStorageSync('compoundParameter', {
					present: { //复利现值
						value: Number(this.presentValue),
						unit: this.moneyUnit
					},
					n: { //期数
						value: Number(this.fixedTime),
						unit: this.fixedTimeUnit
					},
					i: { //利率
						value: Number(this.expectInterest),
						unit: this.expectInterestUnit
					},
					f: { //终值
						value: Number(this.futureValue),
						unit: this.moneyUnit
					},
					option: this.calculationOptions //计算选项
				});
				uni.navigateTo({
					url: '../result/result'
				})
			},
			moneyUnitChange(e) {
				this.moneyUnit = this.moneyUnitColumns[e.detail.value];
			},
			bindExpectInterestUnitChange(e) {
				this.expectInterestUnit = this.expectInterestColumns[e.detail.value];
				if (this.calculationOptions == 2) {
					this.fixedTimeUnit = this.expectInterestUnit.substr(0, 1);
				}
			},
			bindFixedTimeUnitChange(e) {
				this.fixedTimeUnit = this.fixedTimeColumns[e.detail.value];
				if (this.calculationOptions == 2) {
					this.expectInterestUnit = this.fixedTimeUnit + '利率';
				}
			}
		}
	}
</script>

<style>
	/* 防止表单标题长短不一 */
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
