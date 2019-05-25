<template>
	<view>
		<view class="qiun-columns">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">数字曲线</view>
			</view>
			<view class="qiun-charts">
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchend="touchLineA"></canvas>
			</view>
		</view>
		<view class="p-5" v-if="columns.length>0&&maxLine>1">
			<picker @change="bindPickerChange" :value="index" :range="columns" range-key="saveName">
				<button type="primary" plain="true">添加对比</button>
			</picker>
		</view>
		<view v-if="isEmpty" class="text-center p-2">
			<button type="primary" plain="true" @tap="showTip">添加对比</button>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaLineA = null;

	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				columns: uni.getStorageSync('saveHistory'),
				isEmpty:uni.getStorageSync('saveHistory').length==0,
				LineA: {},
				colors : ['#1592ff','#2ac35a','#f74963','#ffce11','#8342e7'],
				i:0,		//i是colors的index
				maxLine:5	//最大对比数量为5
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			showTip(){
				uni.showToast({
					title: '先保存一些计算结果再来对比',
					icon: 'none'
				});
			},
			bindPickerChange(e) {
				let data = this.columns[e.detail.value];
				this.columns.splice(e.detail.value, 1);
				this.LineA.series.push({
					name: data.saveName,
					data: data.seriesData,
					color:this.getColor()
				})
				//取期数更大的那一个
				let categories = this.LineA.categories.length>data.xAxisData.length?this.LineA.categories:data.xAxisData;
				canvaLineA.updateData({
					categories:categories,
					series: this.LineA.series
				})
				this.maxLine--;
			},
			getServerData() {
				let seriesData = wx.getStorageSync('seriesData');
				let xAxisData = wx.getStorageSync('xAxisData');
				this.LineA = {
					"categories": xAxisData,
					"series": [{
						"name": "当前计算",
						"data": seriesData,
						"color": this.getColor()
					}]
				};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				_self.showLineA("canvasLineA", this.LineA);
			},
			getColor(){
				return this.colors[this.i++];
			},
			showLineA(canvasId, chartData) {
				canvaLineA = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'line',
					fontSize: 11,
					legend: true,
					dataLabel: false,
					dataPointShape: false,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						gridColor: '#CCCCCC',
						disableGrid: true,
					},
					yAxis: {
						gridType: 'dash',
						dashLength: 8,
						min: 10,
						format: (value) => {
							if (value > 100000000) {
								return value / 100000000 + 'B';
							}
							if (value > 1000000) {
								return value / 1000000 + 'M';
							}
							if (value > 10000) {
								return value / 10000 + 'W';
							}
							if (value > 1000) {
								return value / 1000 + 'K';
							}
							return value;
						}
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						lineStyle: 'straight'
					}
				});

			},
			touchLineA(e) {
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return item.data + '元'
					}
				});
			}
		}
	}
</script>

<style>
	page {
		width: 750upx;
		overflow-x: hidden;
	}

	.qiun-padding {
		padding: 2%;
		width: 96%;
	}

	.qiun-wrap {
		display: flex;
		flex-wrap: wrap;
	}

	.qiun-rows {
		display: flex;
		flex-direction: row !important;
	}

	.qiun-columns {
		display: flex;
		flex-direction: column !important;
	}

	.qiun-common-mt {
		margin-top: 10upx;
	}

	.qiun-bg-white {
		background: #FFFFFF;
	}

	.qiun-title-bar {
		width: 96%;
		padding: 10upx 2%;
		flex-wrap: nowrap;
	}

	.qiun-title-dot-light {
		border-left: 10upx solid #09bb07;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000
	}

	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
</style>