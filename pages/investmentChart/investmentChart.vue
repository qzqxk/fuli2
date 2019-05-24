<template>
	<view>
		<view class="qiun-columns">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">投资明细</view>
			</view>
			<view class="qiun-charts">
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchend="touchLineA"></canvas>
			</view>
		</view>
		<view class="p-5" v-if="columns.length>0">
			<picker @change="bindPickerChange" :value="index" :range="columns" range-key="saveName">
				<button type="primary" plain="true">添加对比</button>
			</picker>
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
				columns:uni.getStorageSync('saveHistory'),
				LineA:{}
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			bindPickerChange(e){
				let data = this.columns[e.detail.value];
				this.columns.splice(e.detail.value,1);
				this.LineA.series.push({
					name:data.saveName,
					data:data.seriesData
				})
				canvaLineA.updateData({
					series:this.LineA.series
				})
				
			},
			getServerData() {
				let seriesData = wx.getStorageSync('seriesData');
				let xAxisData = wx.getStorageSync('xAxisData');
				this.LineA = {
					"categories": xAxisData,
					"series": [{
						"name": "当前计算",
						"data": seriesData,
						"color":"red"
					}]
				};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				_self.showLineA("canvasLineA", this.LineA);
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
						gridType: 'dash',
						dashLength: 8
					},
					yAxis: {
						gridType: 'dash',
						gridColor: '#CCCCCC',
						dashLength: 8,
						splitNumber: 5,
						min: 10,
						max: 180,
						format: (val) => {
							return val.toFixed(0) + '元'
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
						return item.data+'元'
					}
				});
			}
		}
	}
</script>

<style>
	page {
		background: #F2F2F2;
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
		border-left: 10upx solid #0ea391;
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
