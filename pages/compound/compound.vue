<template>
	<view class="mb-5">
		<van-tabs active="{{ active }}" bind:change="onChange">
			<van-tab title="复利计算">
				<van-cell-group>
					<van-field value="{{ presentValue }}" @input="onPresentValueInput" required clearable label="初始本金" maxlength="10"
					 type="number" input-align="right" use-icon-slot size="large" placeholder="请输入本金">
						<view slot="icon">元</view>
					</van-field>
					<van-field value="{{ fixedTime }}" required clearable label="投资年限" type="number" input-align="right" @input="onFixedTimeInput"
					 use-icon-slot size="large" placeholder="打算投资多久">
						<view slot="icon">年</view>
					</van-field>
					<van-field value="{{ expectInterest }}" required clearable @input="onExpectInterestInput" label="年化收益率" type="digit"
					 input-align="right" use-icon-slot size="large" placeholder="预期年化收益率">
						<view slot="icon">%</view>
					</van-field>
				</van-cell-group>
				<view class="mt-5">
					<van-cell-group>
						<van-cell title="总利息" value="{{totalRevenue}}" size="large" value-class="value-class"></van-cell>
						<van-cell title="本息和" value="{{futureValue}}" size="large" value-class="value-class"></van-cell>
						<van-cell title="查看图表" @tap="lookChart" size="large" value-class="value-class" is-link></van-cell>
					</van-cell-group>
				</view>
				<view class="mx-3 mt-5">
					<button class="weui-btn" type="primary" disabled="{{disabled}}" @tap="calculate">计算</button>
					<button class="weui-btn" type="primary" disabled="{{saveDisabled}}" @tap="save">保存计算结果</button>
					<button class="weui-btn text-primary" type="default" @tap="reset">重置输入</button>
				</view>
			</van-tab>
			<van-tab title="计算历史">
				<view wx:if="{{!saveHistory.length}}" class="text-center">
					您还没有保存任何计算
				</view>
				<view wx:for="{{saveHistory}}" wx:key="index">
					<van-cell title="{{item.saveName}}" is-link></van-cell>
				</view>
			</van-tab>
		</van-tabs>
		<van-dialog use-slot show="{{ show }}" show-cancel-button confirmButtonText="保存" @close="onClose" @confirm="dialogConfirm">
			<view class="text-center pt-2">
				请输入计算名称
			</view>
			<view class="py-3 px-5">
				<input class="border py-1 px-3" value="{{cname}}" @input="onSaveNameInput" auto-focus />
			</view>
		</van-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				presentValue: '',
				fixedTime: '',
				expectInterest: '',
				totalRevenue: '点击计算得出',
				futureValue: '点击计算得出',
				show: false,
				time: 1,
				seriesData: [],
				xAxisData: [],
				saveHistory: wx.getStorageSync("saveHistory") || [],
				saveName: ''
			}
		},
		onLoad() {

		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				console.log(res.target);
			}
			return {
				title: '极简复利计算器',
				path: '/pages/compound'
			};
		},
		methods: {
			toThousand(num) {
				return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
			},

			dealNumber(str) {
				if (str.indexOf('.') !== -1) {
					return str.replace(
						str.substring(str.indexOf('.') + 3, str.indexOf('e')),
						''
					);
				} else if (str.indexOf('Infinity') !== -1) {
					return '天文数字，无法计算';
				}
				return str;
			},
			onPresentValueInput(e) {
				this.presentValue = e.detail;
			},
			onFixedTimeInput(e) {
				this.fixedTime = e.detail;
			},
			onExpectInterestInput(e) {
				this.expectInterest = e.detail;
			},
			calculate() {
				let tempFutureValue = Math.trunc(
					this.presentValue * (1 + this.expectInterest / 100) ** this.fixedTime
				);
				this.futureValue = this.dealNumber(
					this.toThousand(tempFutureValue) + '元'
				);
				this.totalRevenue = this.dealNumber(
					this.toThousand(tempFutureValue - this.presentValue) + '元'
				);

				for (let i = 0; i < Number(this.fixedTime) + 1; i++) {
					this.seriesData.push(Math.floor(this.presentValue * (1 + this.expectInterest / 100) ** i));
					this.xAxisData.push(i)
				}
				wx.setStorageSync("seriesData", this.seriesData);
				wx.setStorageSync("xAxisData", this.xAxisData);
			},
			lookChart() {
				if (this.totalRevenue === '点击计算得出') {
					wx.showToast({
						title: '计算后得出',
						icon: 'none'
					});
					return;
				}
				wx.navigateTo({
					url: './investmentChart'
				})
			},
			reset() {
				this.presentValue = '';
				this.fixedTime = '';
				this.expectInterest = '';
				this.totalRevenue = '点击计算得出';
				this.futureValue = '点击计算得出';
			},
			save() {
				this.show = true;
			},
			onSaveNameInput(e) {
				this.saveName = e.detail.value;
			},
			/**
			 * 保存计算结果
			 */
			dialogConfirm() {
				this.saveHistory.push({
					saveName: this.saveName || this.cname,
					seriesData: this.seriesData,
					xAxisData: this.xAxisData
				});
				wx.setStorageSync("saveHistory", this.saveHistory);
			},
			/**
			 * 弹框关闭触发
			 */
			onClose(e) {
				if (e.detail === 'confirm') {
					setTimeout(() => {
						this.time++;
						this.saveName = '';
					})
				}
				this.show = false;
			}
		},
		computed: {
			disabled() {
				return !(this.presentValue && this.fixedTime && this.expectInterest);
			},
			cname() {
				return '临时计算' + this.time;
			},
			saveDisabled() {
				return !(this.presentValue && this.fixedTime && this.expectInterest && (this.totalRevenue !== '点击计算得出'));
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
