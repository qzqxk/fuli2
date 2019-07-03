<template>
	<view class="text-df cu-card px-3">
		<view class="p-5 bg-white rounded">
			<view class="text-center">
				<view class="text-xl">
					{{title.key}}
				</view>
				<view class="text-green">
					<text :class="isLong?'text-small':'text-sl'">{{title.value}}</text>
					<text class="text-xl">{{title.unit}}</text>
				</view>
			</view>
			<view class="text-lg mt-3 text-gray">
				<view v-if="parameter.option!=3" class="flex justify-between py-1">
					<view>定投期数</view>
					<view>
						<text class="text-green">{{parameter.fixedTime}}</text>
						<text>年</text>
					</view>
				</view>
				<view v-if="parameter.option!=2" class="flex justify-between py-1">
					<view>每期金额</view>
					<view>
						<text class="text-green">{{parameter.fixedMoney}}</text>
						<text>元</text>
					</view>
				</view>
				<view class="flex justify-between py-1">
					<view>投入本金</view>
					<view>
						<text class="text-green">{{principal}}</text>
						<text>元</text>
					</view>
				</view>
				<view v-if="parameter.option!=0" class="flex justify-between py-1">
					<view>期末资产</view>
					<view>
						<text class="text-green">{{parameter.futureValue}}</text>
						<text>元</text>
					</view>
				</view>
				<view class="flex justify-between py-1">
					<view>总收益</view>
					<view>
						<text class="text-green">{{totalRevenue}}</text>
						<text>元</text>
					</view>
				</view>
				<view class="flex justify-between py-1">
					<view>总收益率</view>
					<view>
						<text class="text-green">{{totalYieldRate}}</text>
						<text>%</text>
					</view>
				</view>
				<view v-if="parameter.option!=1" class="flex justify-between py-1">
					<view>年收益率</view>
					<view>
						<text class="text-green">{{parameter.expectInterest}}</text>
						<text>%</text>
					</view>
				</view>
			</view>
		</view>
		<view class="my-3">
			<ad unit-id="adunit-64fe28fc7b3797b6"></ad>
		</view>
		<view class="my-5">
			<!-- #ifdef MP-WEIXIN -->
			<button class="weui-btn" type="primary" open-type="share">去分享</button>
			<button class="weui-btn" type="default" @tap="goHome">回到首页</button>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<button class="weui-btn" type="default" @tap="goHome">回到首页</button>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<button class="weui-btn" type="primary" @tap="goHome">回到首页</button>
			<!-- #endif -->
		</view>
</template>

<script>
	import {
		formatMoney
	} from '../../common/js/common.js';
	export default {
		data() {
			return {
				parameter: uni.getStorageSync("parameter"), //获取用户输入的计算参数
				principal: 0, //本金
				totalRevenue: 0, //总收益
				totalYieldRate: 0, //总收益率
				title: {
					key: '',
					value: 0,
					unit: '元'
				}
			}
		},
		computed: {
			isLong() {
				let s = this.title.value + '';
				return s.length > 12;
			}
		},
		onLoad(option) {
			if (option.parameter != undefined) {
				this.parameter = JSON.parse(option.parameter);
			}
			this.calculate();
		},
		methods: {
			//回到首页
			goHome() {
				uni.switchTab({
					url: '/pages/fixedInvestment/fixedInvestment'
				});
			},
			onShareAppMessage() {
				return {
					title: '定投计算器',
					path: `/pages/fixedResult/fixedResult?parameter=${JSON.stringify(this.parameter)}`
				}
			},
			//计算
			calculate() {
				let option = this.parameter.option;
				let fixedTime = this.parameter.fixedTime;
				let fixedMoney = Number(this.parameter.fixedMoney);
				let period = this.parameter.period;
				let expectInterest = this.parameter.expectInterest;
				let futureValue = Number(this.parameter.futureValue);
				let x = 0;
				let y = 1 / 12;
				let z = fixedTime * 12;
				if (period == 0) {
					y = 1 / 52;
					z = fixedTime * 52;
				} else if (period == 1) {
					y = 1 / 26;
					z = fixedTime * 26;
				}
				switch (option) {
					case 0:
						x = Math.pow(1 + expectInterest / 100, y);
						futureValue = (fixedMoney * x * (Math.pow(x, z) - 1)) / (x - 1);
						this.parameter.futureValue = formatMoney(futureValue);
						this.principal = formatMoney(fixedMoney * z); //总本金
						this.totalRevenue = formatMoney(futureValue - fixedMoney * z); //总收益
						this.totalYieldRate = formatMoney((futureValue - fixedMoney * z) / (fixedMoney * z) * 100); //总收益率
						this.title.key = '期末总资产';
						this.title.value = this.parameter.futureValue;
						this.title.unit = '元';
						break;
					case 1:
						let revenue = this.pmt(futureValue, fixedMoney, z, y);
						this.principal = formatMoney(fixedMoney * z); //总本金
						this.totalRevenue = formatMoney(futureValue - fixedMoney * z); //总收益
						this.totalYieldRate = formatMoney((futureValue - fixedMoney * z) / (fixedMoney * z) * 100); //总收益率
						this.title.key = '年复合收益率';
						this.title.value = Math.floor(revenue * 10000) / 100;
						this.title.unit = '%';
						this.parameter.futureValue = formatMoney(futureValue);
						break;
					case 2:
						x = Math.pow(1 + expectInterest / 100, y);
						fixedMoney = (futureValue * (x - 1)) / (x * (Math.pow(x, z) - 1))
						this.parameter.futureValue = formatMoney(futureValue);
						this.principal = formatMoney(fixedMoney * z); //总本金
						this.totalRevenue = formatMoney(futureValue - fixedMoney * z); //总收益
						this.totalYieldRate = formatMoney((futureValue - fixedMoney * z) / (fixedMoney * z) * 100); //总收益率
						this.title.key = '每期定投金额';
						this.title.value = formatMoney(fixedMoney);
						this.title.unit = '元';
						break;
					case 3:
						x = Math.pow(1 + expectInterest / 100, y);
						z = this.dealZ(futureValue, fixedMoney, x, y);
						this.parameter.futureValue = formatMoney(futureValue);
						this.principal = formatMoney(fixedMoney * z); //总本金
						this.totalRevenue = formatMoney(futureValue - fixedMoney * z); //总收益
						this.totalYieldRate = formatMoney((futureValue - fixedMoney * z) / (fixedMoney * z) * 100); //总收益率
						this.title.key = '定投总时长';
						if (period == 0) {
							fixedTime = z / 52;
						} else if (period == 1) {
							fixedTime = z / 26;
						} else {
							fixedTime = z / 12;
						}
						this.title.value = Math.floor(fixedTime * 100) / 100;
						this.title.unit = '年';
						break;
					default:
						break;
				}
			},
			pmt(futureValue, fixedMoney, z, y) {
				//假设一个收益率
				let rrate = futureValue / (z * fixedMoney);
				let incre = Math.abs(rrate);

				function isPmt() {
					let f = (fixedMoney * rrate * (Math.pow(rrate, z) - 1)) / (rrate - 1);
					return f > futureValue;
				}
				while (true) {
					while (!isPmt()) {
						rrate += incre;
					}
					if (incre < 0.000001) {
						break;
					}
					rrate -= incre;
					incre *= 1 / 2;
				}
				return rrate ** (1 / y) - 1;
			},
			dealZ(futureValue, fixedMoney, x, y) {
				//假设一个Z
				let z = futureValue / fixedMoney;
				let incre = Math.abs(z);

				function isZ() {
					let f = (fixedMoney * x * (Math.pow(x, z) - 1)) / (x - 1);
					return f > futureValue;
				}
				while (true) {
					while (!isZ()) {
						z += incre;
					}
					if (incre < 1) {
						break;
					}
					z -= incre;
					incre *= 1 / 2;
				}
				return Math.floor(z);
			}
		}
	}
</script>

<style>
	.text-small {
		font-size: 60upx;
	}
</style>
