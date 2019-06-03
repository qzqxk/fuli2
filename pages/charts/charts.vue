<template>
	<view>
		<view class="text-df">
			<view class="flex px-3 py-1 border-bottom text-gray text-center">
				<view class="text-left flex-sub">序号</view>
				<view class="flex-twice">本金({{compoundParameter.present.unit}})</view>
				<view class="flex-sub">期数({{compoundParameter.n.unit}})</view>
				<view class="flex-sub">{{compoundParameter.i.unit}}</view>
			</view>
			<view class="flex ml-3 pr-3 py-2 border-bottom text-center" v-for="(item,index) in contrastData" :key="index">
				<view class="text-green flex-sub text-left">{{names[index]}}</view>
				<view class="flex-twice flex-shrink-0">{{numberFormat(item.p)}}</view>
				<view class="flex-sub">{{item.n}}</view>
				<view class="flex-sub">{{item.i}}%</view>
			</view>
			<view v-show="addTip" class="p-2 pl-3 text-link" @tap="addLine">
				+ 添加对比数据
			</view>
			<view v-show="!addTip" class="p-2 pl-3 text-gray">
				已达对比上限
			</view>
		</view>
		<view class="mt-3 container">
			<canvas v-show="chartShow" canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"
			 @touchmove="touchLineA"></canvas>
		</view>

		<view class="padding mt-3">
			<button class="weui-btn" type="primary" @tap="goHome">回到首页</button>
		</view>
		<!-- 添加对比数据 -->

		<van-dialog async-close use-slot :show="show" show-cancel-button confirmButtonText="对比" @confirm="dialogConfirm"
		 @cancel="onCancel">
			<view class="cu-bar bg-white justify-end border-bottom">
				<view class="content">请输入要对比的数据</view>
			</view>
			<view class="text-df">
				<view class="cu-form-group">
					<view class="title">
						本金
					</view>
					<input placeholder="请输入" v-model="contrastP" type="digit"></input>
					<view class="action">
						<text>{{compoundParameter.present.unit}}</text>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">
						期数
					</view>
					<input placeholder="请输入" v-model="contrastN" type="number"></input>
					<view class="action">
						<text>{{compoundParameter.n.unit}}</text>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">收益率</view>
					<input placeholder="请输入" v-model="contrastI" type="digit"></input>
					<view class="action">
						<text>%{{compoundParameter.i.unit}}</text>
					</view>
				</view>
			</view>
		</van-dialog>
	</view>
</template>

<script>
	let numeral = require('numeral');
	numeral.defaultFormat('0,0.00');
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaLineA = null;
	export default {
		data() {
			return {
				compoundParameter: uni.getStorageSync("compoundParameter"),
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				columns: uni.getStorageSync('saveHistory'),
				isEmpty: uni.getStorageSync('saveHistory').length == 0,
				LineA: {},
				colors: ['#1592ff', '#2ac35a', '#f74963', '#ffce11', '#8342e7'],
				i: 0, //i是colors的index
				maxLine: 5, //最大对比数量为5
				contrastP: '', //对比的本金
				contrastI: '', //对比的利率
				contrastN: '', //对比的期数
				show: false,
				chartShow: true,
				contrastData: [], //所有要对比的数据
				names: ['A', 'B', 'C', 'D'] //每条数据的序号
			}
		},
		computed: {
			addTip() {
				return this.contrastData.length < 4;
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(700);
			this.contrastData.push({
				p: this.compoundParameter.present.value,
				i: this.compoundParameter.i.value,
				n: this.compoundParameter.n.value
			})
			this.redraw();
		},
		methods: {
			numberFormat(num){
				return numeral(num).format();
			},
			goHome() {
				uni.switchTab({
					url: '/pages/compound/compound'
				});
			},
			onCancel(e) {
				this.show = false;
				e.detail.dialog.close();
				setTimeout(() => {
					this.chartShow = true;
				}, 200)
			},
			dialogConfirm(e) {
				//校验输入是否正确
				if (this.contrastP == '') {
					uni.showToast({
						title: '请输入本金',
						icon: 'none'
					})
					e.detail.dialog.stopLoading();
					return;
				} else if (this.contrastN == '') {
					uni.showToast({
						title: '请输入期数',
						icon: 'none'
					})
					e.detail.dialog.stopLoading();
					return;
				} else if (this.contrastI == '') {
					uni.showToast({
						title: '请输入收益率',
						icon: 'none'
					})
					e.detail.dialog.stopLoading();
					return;
				}

				e.detail.dialog.close();
				this.show = false;

				this.contrastData.push({
					p: this.contrastP,
					i: this.contrastI,
					n: this.contrastN
				})

				//重绘图表
				this.redraw();
				setTimeout(() => {
					this.chartShow = true;
				}, 200)
			},
			/**
			 * 重绘图表
			 */
			redraw() {
				//现值单位
				let pUnit = this.compoundParameter.present.unit;
				//期数单位
				let nUnit = this.compoundParameter.n.unit;
				//利率单位
				let iUnit = this.compoundParameter.i.unit;
				let dealN = this.dealUnit(iUnit, nUnit);
				let series = [];

				//循环需要对比的数据
				for (let k = 0; k < this.contrastData.length; k++) {
					let seriesData = [];
					let p = Number(this.contrastData[k].p);
					let n = Number(this.contrastData[k].n);
					let i = Number(this.contrastData[k].i);
					for (let j = 0; j < Number(n) + 1; j++) {
						seriesData.push((p * (1 + i / 100) ** dealN(j)).toFixed(2));
					}
					series.push({
						name: this.names[k],
						data: seriesData
					});
				}
				let ns = this.contrastData.map((v) => {
					return Number(v.n);
				});
				let len = Math.max(...ns);
				let xAxisData = new Array(len + 1).fill().map((v, i) => {
					return i
				})
				let LineA = {
					"categories": xAxisData,
					"series": series
				};
				this.showLineA("canvasLineA", LineA);
			},

			/**
			 * 添加对比
			 */
			addLine() {
				this.show = true;
				this.chartShow = false;
			},
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
			},
			showLineA(canvasId, chartData) {
				canvaLineA = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'line',
					fontSize: 11,
					dataPointShape: false,
					dataLabel:false,
					background: '#f7f7f7',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						gridColor: '#CCCCCC',
						disableGrid: true,
					},
					yAxis: {
						min: 0.01,
						splitNumber:2,
						gridColor:'#e5e5e5',
						format: (value) => {
							if (value > 100000000) {
								return numeral(value / 100000000).format() + 'B';
							}
							if (value > 1000000) {
								return numeral(value / 1000000).format() + 'M';
							}
							if (value > 10000) {
								return numeral(value / 10000).format() + 'W';
							}
							if (value > 1000) {
								return numeral(value / 1000).format() + 'K';
							}
							return value;
						}
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						lineStyle: 'straight',
					}
				});

			},
			touchLineA(e) {
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return `${item.name}:${numeral(item.data).format()}${_self.compoundParameter.present.unit}`;
					}
				});
			}
		}
	}
</script>

<style>
	.charts {
		width: 100%;
		height: 700upx;
	}

	.container {
		height: 700upx;
	}

	/* 防止表单标题长短不一 */
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
