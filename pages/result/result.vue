<template>
	<view class="text-df cu-card px-3" style="padding-bottom: 200upx;">
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
				<view v-if="compoundParameter.option!=3" class="flex justify-between py-1">
					<view>期数</view>
					<view>
						<text class="text-green">{{compoundParameter.n.value}}</text>
						<text>{{compoundParameter.n.unit}}</text>
					</view>
				</view>
				<view v-if="compoundParameter.option!=2" class="flex justify-between py-1">
					<view>投入本金</view>
					<view>
						<text class="text-green">{{cp}}</text>
						<text>{{compoundParameter.present.unit}}</text>
					</view>
				</view>
				<view v-if="compoundParameter.option!=0" class="flex justify-between py-1">
					<view>期末资产</view>
					<view>
						<text class="text-green">{{cf}}</text>
						<text>{{compoundParameter.f.unit}}</text>
					</view>
				</view>
				<view class="flex justify-between py-1">
					<view>总收益</view>
					<view>
						<text class="text-green">{{totalRevenue}}</text>
						<text>{{compoundParameter.present.unit}}</text>
					</view>
				</view>
				<view class="flex justify-between py-1">
					<view>总收益率</view>
					<view>
						<text class="text-green">{{totalYieldRate}}</text>
						<text>%</text>
					</view>
				</view>
				<view v-if="compoundParameter.option!=1" class="flex justify-between py-1">
					<view>{{compoundParameter.i.unit}}</view>
					<view>
						<text class="text-green">{{compoundParameter.i.value}}</text>
						<text>%</text>
					</view>
				</view>
			</view>
		</view>
		<view class="my-3">
			<ad unit-id="adunit-64fe28fc7b3797b6"></ad>
		</view>
		<view class="text-center text-sm border radius">
			<view class="py-2">
				<view class="grid">
					<view style="width: 20%;">期数({{compoundParameter.n.unit}})</view>
					<view style="width: 40%;">本期利息({{compoundParameter.present.unit}})</view>
					<view style="width: 40%;">本期本息和({{compoundParameter.present.unit}})</view>
				</view>
			</view>
			<view class="py-1" :class="index%2==0?'bg-gray light':''" v-for="(item,index) in tableList" :key="item.id">
				<view class="grid">
					<view style="width: 20%;">{{item.id}}</view>
					<view style="width: 40%;">{{item.currentI}}</view>
					<view style="width: 40%;">{{item.currentTotal}}</view>
				</view>
			</view>
		</view>
		<view class="fixed-bottom p-3" style="z-index: 9999;background-color: #f7f7f7;">
			<button class="weui-btn" type="primary" @tap="toCharts">查看图表</button>
		</view>
	</view>
</template>

<script>
	//此处必须采用相对路径，否则会报错
	import { formatMoney } from '../../common/js/common.js';
	export default {
		data() {
			return {
				compoundParameter: uni.getStorageSync("compoundParameter"), //获取用户输入的计算参数
				futureValue: 0, //复利终值
				totalRevenue: 0, //总利息,
				tableList: [], //保存每一期数据,
				title: {
					key: '期末本息和',
					value: 0,
					unit: '元'
				},
				totalYieldRate: 0,
			}
		},
		computed: {
			cp() {
				return formatMoney(this.compoundParameter.present.value);
			},
			isLong() {
				let s = this.title.value + '';
				return s.length > 12;
			},
			cf(){
				return formatMoney(this.compoundParameter.f.value);
			}
		},
		onLoad(option) {
			if (option.parameter != undefined) {
				this.compoundParameter = JSON.parse(option.parameter);
			}
			this.calculate();
		},
		methods: {
			onShareAppMessage() {
				return {
					title: '复利计算器',
					path: `/pages/result/result?parameter=${JSON.stringify(this.compoundParameter)}`
				}
			},
			toCharts() {
				uni.setStorageSync('compoundParameter',this.compoundParameter);
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
				//钱的单位
				let pUnit = this.compoundParameter.present.unit;
				//终值
				let f = this.compoundParameter.f.value;
				//期数
				let n = Number(this.compoundParameter.n.value);
				//期数单位
				let nUnit = this.compoundParameter.n.unit;
				//利率
				let i = Number(this.compoundParameter.i.value);
				//利率单位
				let iUnit = this.compoundParameter.i.unit;

				let option = this.compoundParameter.option;
				let previous = 0;
				let tempFutureValue = 0;
				switch (option) {
					case 0:
						let dealN = this.dealUnit(iUnit, nUnit);
						tempFutureValue = p * (1 + i / 100) ** dealN(n);
						this.title.key = "期末本息和";
						this.title.value = formatMoney(tempFutureValue)
						this.title.unit = pUnit;
						this.totalRevenue = formatMoney(tempFutureValue - p);
						this.totalYieldRate = formatMoney((tempFutureValue - p) / p * 100);
						if (Number.isNaN(this.totalRevenue)) {
							return;
						}
						//保存上一期本息和
						previous = p;
						for (let j = 1; j < n + 1; j++) {
							//当期本息和
							let current = p * (1 + i / 100) ** dealN(j);
							this.tableList.push({
								id: j, //期数
								currentI: formatMoney(current - previous), //本期利息
								currentTotal: formatMoney(current),
								iTotal: formatMoney(current - p) //总利息
							})
							previous = current;
						}
						break;
					case 1:
						i = (f / p) ** (1 / n);
						this.title.key = nUnit + '利率';
						this.title.value = Math.floor((i - 1) * 10000) / 100;
						this.title.unit = '%';
						this.totalRevenue = formatMoney(f - p);
						this.totalYieldRate = formatMoney((f - p) / p * 100);
						this.compoundParameter.i.value = this.title.value;
						this.compoundParameter.i.unit = this.compoundParameter.n.unit+'利率';
						if (Number.isNaN(i)) {
							return;
						}
						//保存上一期本息和
						previous = p;
						for (let j = 1; j < n + 1; j++) {
							//当期本息和
							let current = p * i ** j;
							this.tableList.push({
								id: j, //期数
								currentI: formatMoney(current - previous), //本期利息
								currentTotal: formatMoney(current),
								iTotal: formatMoney(current - p) //总利息
							})
							previous = current;
						}
						break;
					case 2:
						p = f / ((1 + i / 100) ** n);
						this.title.key = '投入本金';
						this.title.value = Math.floor(p*100)/100;
						this.title.unit = this.compoundParameter.f.unit;
						this.totalRevenue = formatMoney(f - p);
						this.totalYieldRate = formatMoney((f - p) / p * 100);
						this.compoundParameter.present.value = this.title.value;
						this.compoundParameter.present.unit = this.compoundParameter.f.unit;
						if (Number.isNaN(p)) {
							return;
						}
						//保存上一期本息和
						previous = p;
						for (let j = 1; j < n + 1; j++) {
							//当期本息和
							let current = p * (1 + i / 100) ** j;
							this.tableList.push({
								id: j, //期数
								currentI: formatMoney(current - previous), //本期利息
								currentTotal: formatMoney(current),
								iTotal: formatMoney(current - p) //总利息
							})
							previous = current;
						}
						break;
					case 3:
						n = Number(this.getN(p,f,i));
						this.title.key = '期数';
						this.title.value = n;
						this.title.unit = this.compoundParameter.i.unit.substr(0,1);
						
						tempFutureValue = p * (1 + i / 100) ** n;
						this.compoundParameter.f.value = tempFutureValue;
						this.totalRevenue = formatMoney(tempFutureValue - p);
						this.totalYieldRate = formatMoney((tempFutureValue - p) / p * 100);
						this.compoundParameter.n.value = Math.ceil(n);
						this.compoundParameter.n.unit = this.title.unit;
						if (Number.isNaN(p)) {
							return;
						}
						//保存上一期本息和
						previous = p;
						for (let j = 1; j < n + 1; j++) {
							//当期本息和
							let current = p * (1 + i / 100) ** j;
							this.tableList.push({
								id: j, //期数
								currentI: formatMoney(current - previous), //本期利息
								currentTotal: formatMoney(current),
								iTotal: formatMoney(current - p) //总利息
							})
							previous = current;
						}
						break;
					default:
						break;
				}
			},
			/**
			 * 判断n是否符合条件
			 * @param {Object} p	现值
			 * @param {Object} f	终值
			 * @param {Object} i	利率	例如：10
			 */
			getN(p,f,i){
				//假设一个N
				let n = Math.floor(f / (p*(1+i))*10);
				let incre = Math.abs(n);
				function isN() {
					let f1 = p * (i/100+1) ** n;
					return f1 > f;
				}
				while (true) {
					while (!isN()) {
						n += incre;
					}
					if (incre < 1) {
						break;
					}
					n -= incre;
					incre *= 1 / 2;
				}
				return Math.floor(n*100)/100;
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
		width: 100%;
	}
	.text-small{
		font-size: 60upx;
	}
</style>
