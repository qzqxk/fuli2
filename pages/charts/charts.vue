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
				<view class="text-green flex-sub text-left" :style="{color:sequence[index].color}">{{sequence[index].name}}</view>
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
		<view class="cu-modal" :class="show?'show':''">
			<view class="cu-dialog" style="vertical-align: baseline;">
				<view class="cu-bar bg-white justify-end">
					<view class="content">请输入要对比的数据</view>
				</view>
				<view class="text-df text-left">
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
				<view class="cu-bar bg-white justify-between px-3">
					<button class="cu-btn line-green text-green flex-grow-1" @tap="onCancel">取消</button>
					<button class="cu-btn bg-green margin-left flex-grow-1" @tap="dialogConfirm">对比</button>
				</view>
			</view>
		</view>
		<view class="px-3" style="padding-bottom: 100upx;">
			<ad unit-id="adunit-64fe28fc7b3797b6"></ad>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import {
		formatMoney
	} from '../../common/js/common.js';
	var _self;
	var canvaLineA = null;
	let cWidth = '';
	let cHeight = '';
	let pixelRatio = 1;
	export default {
		data() {
			return {
				compoundParameter: uni.getStorageSync("compoundParameter"),
				contrastP: '', //对比的本金
				contrastI: '', //对比的利率
				contrastN: '', //对比的期数
				show: false,
				chartShow: true,
				contrastData: [], //所有要对比的数据
				sequence: [{
					name: 'A',
					color: '#1890ff'
				}, {
					name: 'B',
					color: '#2fc25b'
				}, {
					name: 'C',
					color: '#facc14'
				}, {
					name: 'D',
					color: '#f04864'
				}], //每条数据的序号
			}
		},
		computed: {
			addTip() {
				return this.contrastData.length < 4;
			}
		},
		onLoad() {
			_self = this;
			cWidth = uni.upx2px(750);
			cHeight = uni.upx2px(700);
			this.contrastData.push({
				p: this.compoundParameter.present.value,
				i: this.compoundParameter.i.value,
				n: this.compoundParameter.n.value
			})
			this.redraw();
		},
		methods: {
			numberFormat(num) {
				return formatMoney(num);
			},
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			onCancel(e) {
				this.show = false;
				setTimeout(() => {
					this.chartShow = true;
				}, 200)
			},
			dialogConfirm() {
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
						name: this.sequence[k].name,
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
					dataLabel: false,
					background: '#f7f7f7',
					pixelRatio: pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						gridColor: '#CCCCCC',
						disableGrid: true,
					},
					yAxis: {
						min: 0.01,
						splitNumber: 2,
						gridColor: '#e5e5e5',
						format: (value) => {
							if (value > 100000000) {
								return formatMoney(value / 100000000) + 'B';
							}
							if (value > 1000000) {
								return formatMoney(value / 1000000) + 'M';
							}
							if (value > 10000) {
								return formatMoney(value / 10000) + 'W';
							}
							if (value > 1000) {
								return formatMoney(value / 1000) + 'K';
							}
							return value;
						}
					},
					width: cWidth * pixelRatio,
					height: cHeight * pixelRatio,
				});

			},
			touchLineA(e) {
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return `${item.name} 第${category}期 ${formatMoney(item.data)}${_self.compoundParameter.present.unit}`;
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
		min-width: 150upx;
	}
</style>
