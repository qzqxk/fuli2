<template>
	<view class="text-df cu-card case">
		<view class="cu-item shadow py-5">
			<view class="text-center">
				<view>
					期末本息和
				</view>
				<view class="text-sl text-green">
					<text>{{futureValue}}</text>
					<text class="text-xl">{{compoundParameter.present.unit}}</text>
				</view>
			</view>
			<view class="padding-top-xl text-xl">
				<view class="flex justify-between padding-lr-xl py-1">
					<view>本金总额</view>
					<view>
						<text class="text-green">{{totalPresent}}</text>
						<text>{{compoundParameter.present.unit}}</text>
					</view>
				</view>
				<view class="flex justify-between padding-lr-xl py-1">
					<view>利息总额</view>
					<view>
						<text class="text-green">{{totalRevenue}}</text>
						<text>{{compoundParameter.present.unit}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="padding my-5">
			<button class="weui-btn" type="primary" @tap="toCharts">查看图表</button>
		</view>
		<view class="px-3 pb-5">
			<scroll-view scroll-x="true" scroll-left="0">
				<view class="scroll-view-item_H text-center text-df border radius">
					<view class="py-2">
						<view class="grid col-4">
							<view>期数({{compoundParameter.n.unit}})</view>
							<view>本期利息({{compoundParameter.present.unit}})</view>
							<view>累计利息({{compoundParameter.present.unit}})</view>
							<view>本息和({{compoundParameter.present.unit}})</view>
						</view>
					</view>
					<view class="py-1" :class="index%2==0?'bg-gray light':''" v-for="(item,index) in tableList" :key="item.id">
						<view class="grid col-4">
							<view>{{item.id}}</view>
							<view>{{item.currentI}}</view>
							<view>{{item.iTotal}}</view>
							<view>{{item.currentTotal}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	let numeral = require('numeral');
	numeral.defaultFormat('0,0.00');
	export default {
		data() {
			return {
				compoundParameter: uni.getStorageSync("compoundParameter"), //获取用户输入的计算参数
				futureValue: 0, //复利终值
				totalRevenue: 0, //总利息,
				tableList: [] //保存每一期数据,
			}
		},
		computed:{
			totalPresent(){
				return numeral(this.compoundParameter.present.value).format();
			}
		},
		onLoad() {
			this.calculate();
		},
		methods: {
			toCharts() {
				uni.navigateTo({
					url: "../charts/charts"
				})
			},
			/**
			 * 计算结果
			 * 重要约定：
			 * 按照计算收益率单位来计算复利方式，比如日利率就按日复利计算，月利率就按照月复利计算
			 * 一年等于12月，365天，一月等于30天
			 */
			calculate() {
				//现值
				let p = Number(this.compoundParameter.present.value);
				//现值单位
				let pUnit = this.compoundParameter.present.unit;
				//期数
				let n = Number(this.compoundParameter.n.value);
				//期数单位
				let nUnit = this.compoundParameter.n.unit;
				//利率
				let i = Number(this.compoundParameter.i.value);
				//利率单位
				let iUnit = this.compoundParameter.i.unit;
				let tempFutureValue = 0;
				let dealN = this.dealUnit(iUnit, nUnit);
				tempFutureValue = p * (1 + i / 100) ** dealN(n);
				this.futureValue = numeral(tempFutureValue).format()
				this.totalRevenue = numeral(tempFutureValue - p).format();
				if (Number.isNaN(this.totalRevenue)) {
					return;
				}
				//保存上一期本息和
				let previous = p;
				for (let j = 1; j < n + 1; j++) {
					//当期本息和
					let current = p * (1 + i / 100) ** dealN(j);
					this.tableList.push({
						id: j, //期数
						currentI: numeral(current - previous).format(), //本期利息
						currentTotal: numeral(current).format(),
						iTotal: numeral(current - p).format() //总利息
					})
				}
			},
			/**
			 * @param {Object} iUnit
			 * @param {Object} nUnit
			 * 根据利率和期数单位返回处理期数的函数
			 */
			dealUnit(iUnit, nUnit) {
				if (iUnit.indexOf(nUnit) != -1) {
					return n => n;
				}
				//判断收益率单位
				switch (iUnit) {
					case '年利率':
						if (nUnit == '月') {
							return n => n / 12;
						} else if (nUnit == '日') {
							return n => n / 365;
						}
						break;
					case '月利率':
						if (nUnit == '年') {
							return n => n * 12;
						} else if (nUnit == '日') {
							return n => n / 30;
						}
						break;
					case '日利率':
						if (nUnit == '年') {
							return n => n * 365;
						} else if (nUnit == '月') {
							return n => n * 30;
						}
						break;
				}
			}
		}
	}
</script>

<style>
	.scroll-view-item_H {
		display: inline-block;
		width: 150%;
	}
</style>
