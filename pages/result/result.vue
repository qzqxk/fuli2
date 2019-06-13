<template>
	<view class="text-df cu-card">
		<view class="cu-item p-5">
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
				return numeral(this.compoundParameter.present.value).format();
			},
			isLong() {
				let s = this.title.value + '';
				return s.length > 12;
			},
			cf(){
				return numeral(this.compoundParameter.f.value).format();
			}
		},
		onLoad() {
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
				switch (option) {
					case 0:
						let tempFutureValue = 0;
						let dealN = this.dealUnit(iUnit, nUnit);
						tempFutureValue = p * (1 + i / 100) ** dealN(n);
						this.title.key = "期末本息和";
						this.title.value = numeral(tempFutureValue).format()
						this.title.unit = pUnit;
						this.totalRevenue = numeral(tempFutureValue - p).format();
						this.totalYieldRate = numeral((tempFutureValue - p) / p * 100).format();
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
								currentI: numeral(current - previous).format(), //本期利息
								currentTotal: numeral(current).format(),
								iTotal: numeral(current - p).format() //总利息
							})
						}
						break;
					case 1:
						/* f = p * i ** n;
						i = (f/p)**(1/n) */
						i = (f / p) ** (1 / n);
						this.title.key = nUnit + '利率';
						this.title.value = Math.floor((i - 1) * 10000) / 100;
						this.title.unit = '%';
						this.totalRevenue = numeral(f - p).format();
						this.totalYieldRate = numeral((f - p) / p * 100).format();
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
								currentI: numeral(current - previous).format(), //本期利息
								currentTotal: numeral(current).format(),
								iTotal: numeral(current - p).format() //总利息
							})
						}
						break;
					case 2:
						p = f / ((1 + i / 100) ** n);
						this.title.key = '投入本金';
						this.title.value = Math.floor(p*100)/100;
						this.title.unit = this.compoundParameter.f.unit;
						this.totalRevenue = numeral(f - p).format();
						this.totalYieldRate = numeral((f - p) / p * 100).format();
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
								currentI: numeral(current - previous).format(), //本期利息
								currentTotal: numeral(current).format(),
								iTotal: numeral(current - p).format() //总利息
							})
						}
						break;
					case 3:
						n = this.getN(p,f,i);
						this.title.key = '期数';
						this.title.value = n;
						this.title.unit = this.compoundParameter.i.unit.substr(0,1);
						this.totalRevenue = numeral(f - p).format();
						this.totalYieldRate = numeral((f - p) / p * 100).format();
						this.compoundParameter.n.value = this.title.value;
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
								currentI: numeral(current - previous).format(), //本期利息
								currentTotal: numeral(current).format(),
								iTotal: numeral(current - p).format() //总利息
							})
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
				return Math.ceil(n);
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
