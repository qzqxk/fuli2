<template>
	<view class="text-df">
		<view class="cu-form-group">
			<view class="title">
				分期金额
			</view>
			<input placeholder="请输入分期金额" v-model="instalmentAmount" type="digit"></input>
			<view class="action">
				<text>元</text>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">
				分多少期
			</view>
			<input placeholder="请输入期数" v-model="periods" type="number"></input>
			<view class="action">
				<text>期</text>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">
				每期还款
			</view>
			<input placeholder="请输入每期还款" v-model="repayment" type="digit"></input>
			<view class="action">
				<text>元</text>
			</view>
		</view>
		<view class="mt-5">
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content">
						<text>年化利率</text>
					</view>
					<view class="action">
						<text>{{revenue}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="mx-3 mt-5">
			<button class="weui-btn" type="primary" :disabled="disabled" @tap="calculate">计算</button>
			<button class="weui-btn text-primary" type="default" @tap="reset">复位</button>
		</view>
		<view class="p-3" style="padding-bottom: 100upx;">
			<ad unit-id="adunit-64fe28fc7b3797b6"></ad>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				instalmentAmount: '',
				periods: '',
				repayment: '',
				revenue: '点击计算得出'
			}
		},
		computed: {
			disabled() {
				return !(this.instalmentAmount > 0 && this.periods > 0 && this.repayment > 0);
			}
		},
		onShareAppMessage(res) {
			return {
				title: '分期利率计算器',
				path: '/pages/installment/installment'
			};
		},
		methods: {
			calculate() {
				try {
					this.revenue = this.irr(this.instalmentAmount, this.periods, this.repayment)
				} catch (err) {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				}
			},
			reset() {
				this.instalmentAmount = '';
				this.periods = '';
				this.repayment = '';
				this.revenue = '点击计算得出';
			},
			irr(debitAmount, nper, eachPayment) {
				if (eachPayment <= 0) {
					throw new Error('每期还款必须大于0');
				}

				function isIrr(rrate) {
					let amount = 0;
					for (let i = 1; i < Number(nper) + 1; i++) {
						amount += eachPayment / rrate ** i;
					}
					return debitAmount - amount > 0 ? true : false;
				}
				let rrate = nper * eachPayment / debitAmount;
				let incre = Math.abs(rrate);

				while (true) {
					while (!isIrr(rrate)) {
						rrate += incre;
					}
					if (incre < 0.00001) {
						break;
					}
					rrate -= incre;
					incre *= 1 / 2;
				}
				if (rrate < 1) {
					throw new Error('输入错误');
				}
				return ((rrate - 1) * 100 * 12).toFixed(2) + '%';
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
