<template>
	<view class="text-df">
		<view class="cu-form-group">
			<view class="title">
				房屋总价
			</view>
			<input placeholder="请输入房屋总价" v-model="dealPrice" type="digit"></input>
			<view class="action">
				<text>万</text>
			</view>
		</view>
		<picker @change="onDownPaymentPickerChange" :range="downPaymentColumns" value="1">
			<view class="cu-list menu">
				<view class="cu-item arrow">
					<view class="content">
						<text>首付比例</text>
					</view>
					<view class="action">
						<text>{{cdownPayment}}</text>
					</view>
				</view>
			</view>
		</picker>
		<picker @change="onLoansLimitPickerChange" :range="loansLimitColumns" :value="loansLimit-1">
			<view class="cu-list menu">
				<view class="cu-item arrow">
					<view class="content">
						<text>按揭年数</text>
					</view>
					<view class="action">
						<text>{{cloansLimit}}</text>
					</view>
				</view>
			</view>
		</picker>
		<picker @change="onLoansRatePickerChange" range-key="key" :range="loansRateColumns" value="7">
			<view class="cu-list menu">
				<view class="cu-item arrow">
					<view class="content">
						<text>贷款年利率</text>
					</view>
					<view class="action">
						<text>{{cloansRate}}</text>
					</view>
				</view>
			</view>
		</picker>
		<view class="mt-3">
			<view class="cu-form-group">
				<view class="title">
					税费
				</view>
				<input placeholder="请输入税费比例" v-model="expenses" type="digit"></input>
				<view class="action">
					<text>%</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					贷款服务费
				</view>
				<input placeholder="请输入贷款担保服务费比例" v-model="loanService" type="digit"></input>
				<view class="action">
					<text>%</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					中介费
				</view>
				<input placeholder="请输入中介抽成比例" v-model="agentRate" type="digit"></input>
				<view class="action">
					<text>%</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					其它费用
				</view>
				<input placeholder="请输入其它费用" v-model="otherCost" type="digit"></input>
				<view class="action">
					<text>元</text>
				</view>
			</view>
		</view>

		<view class="mt-3">
			<view class="cu-form-group">
				<view class="title">
					预期装修费
				</view>
				<input placeholder="您预期装修费是多少" v-model="expectRenovationCost" type="digit"></input>
				<view class="action">
					<text>万</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					预期月租金
				</view>
				<input placeholder="您预期房屋出租后能租多少钱" v-model="expectMothRent" type="digit"></input>
				<view class="action">
					<text>元</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					期望收益率
				</view>
				<input placeholder="您期望每年的收益率是多少" v-model="expectOtherInterest" type="digit"></input>
				<view class="action">
					<text>%</text>
				</view>
			</view>
		</view>

		<view class="mt-3">
			<view class="cu-form-group">
				<view class="title">
					持有时长
				</view>
				<input placeholder="准备持有多久后卖出" v-model="expectHoldTime" type="digit"></input>
				<view class="action">
					<text>年</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					房价年涨幅
				</view>
				<input placeholder="持有期间您预期的房价年涨幅" v-model="expectHouseRise" type="digit"></input>
				<view class="action">
					<text>%</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					租金年涨幅
				</view>
				<input placeholder="持有期间您预期的租金年涨幅" v-model="expectRentRise" type="digit"></input>
				<view class="action">
					<text>%</text>
				</view>
			</view>
		</view>
		<view class="mt-5">
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-title text-orange "></text> 估算结果（不构成投资建议）
				</view>
			</view>
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content">
						<text>预期房屋售价</text>
					</view>
					<view class="action">
						<text>{{houseSell}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text>每月还款</text>
					</view>
					<view class="action">
						<text>{{monthPay}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text>初期总投资</text>
					</view>
					<view class="action">
						<text>{{totalInvestment}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text>现金的现金回报率</text>
					</view>
					<view class="action">
						<text>{{cashRewards}}</text>
					</view>
				</view>

				<view class="cu-item">
					<view class="content">
						<text>投资回报率</text>
					</view>
					<view class="action">
						<text>{{investment}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text>年化回报率</text>
					</view>
					<view class="action">
						<text>{{annualized}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="mx-3 my-5">
			<button class="weui-btn" type="primary" :disabled="disabled" @tap="calculate">计算</button>
			<button class="weui-btn text-primary" type="default" @tap="reset">复位</button>
		</view>
		<view class="px-3" style="padding-bottom: 100upx;">
			<ad unit-id="adunit-64fe28fc7b3797b6"></ad>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//房屋总价
				dealPrice: 160,
				//首付比例
				downPayment: 3,
				downPaymentColumns: [2, 3, 4, 5, 6, 7, 8, 9],
				//贷款期限
				loansLimit: 20,
				//贷款年利率
				loansRate: 4.9,
				loansLimitColumns: Array.from({
					length: 30
				}, (v, k) => k + 1),
				loansRateColumns: [{
						key: '基准利率7折(3.43%)',
						value: 3.43
					},
					{
						key: '基准利率8折(3.92%)',
						value: 3.92
					},
					{
						key: '8.3折(4.067%)',
						value: 4.067
					},
					{
						key: '8.5折(4.165%)',
						value: 4.165
					},
					{
						key: '8.8折(4.312%)',
						value: 4.312
					},
					{
						key: '9折(4.41%)',
						value: 4.41
					},
					{
						key: '9.5折(4.665%)',
						value: 4.655
					},
					{
						key: '基准利率(4.9%)',
						value: 4.9
					},
					{
						key: '1.05倍(5.145%)',
						value: 5.145
					},
					{
						key: '1.1倍(5.39%)',
						value: 5.39
					},
					{
						key: '1.15倍(5.635%)',
						value: 5.635
					},
					{
						key: '1.2倍(5.88%)',
						value: 5.88
					},
					{
						key: '1.25倍(6.125%)',
						value: 6.125
					},
					{
						key: '1.3倍(6.37%)',
						value: 6.37
					},
					{
						key: '1.35倍(6.615%)',
						value: 6.615
					},
					{
						key: '1.4倍(6.86%)',
						value: 6.86
					}
				],
				//税费比例
				expenses: 3,
				otherCost: 5000,
				//贷款服务费
				loanService: 1.5,
				//中介抽成比例
				agentRate: 2,
				//预期装修费
				expectRenovationCost: 10,
				//预期月租金
				expectMothRent: 3000,
				//预期投资其它产品收益率
				expectOtherInterest: 15,
				//预期租金年涨幅
				expectRentRise: 5,
				//预期房价年涨幅
				expectHouseRise: 8,
				//预期持有时长
				expectHoldTime: 5,
				houseSell: '点击计算得出',
				monthPay: '点击计算得出',
				totalInvestment: '点击计算得出',
				investment: '点击计算得出',
				annualized: '点击计算得出',
				cashRewards: '点击计算得出'
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				console.log(res.target);
			}

			return {
				title: '二手房投资估算',
				path: '/pages/houseModel/houseModel'
			};
		},
		methods: {
			onDealPriceInput(e) {
				this.dealPrice = e.detail;
			},
			onExpensesInput(e) {
				this.expenses = e.detail;
			},
			onAgentRateInput(e) {
				this.agentRate = e.detail;
			},
			onExpectMothRentInput(e) {
				this.expectMothRent = e.detail;
			},
			onExpectHouseRiseInput(e) {
				this.expectHouseRise = e.detail;
			},
			onExpectRentRiseInput(e) {
				this.expectRentRise = e.detail;
			},
			onExpectHoldTimeInput(e) {
				this.expectHoldTime = e.detail;
			},
			onLoanServiceInput(e) {
				this.loanService = e.detail;
			},
			onExpectRenovationCostInput(e) {
				this.expectRenovationCost = e.detail;
			},
			onExpectOtherInterestInput(e) {
				this.expectOtherInterest = e.detail;
			},
			onOtherCostInput(e) {
				this.otherCost = e.detail;
			},
			onLoansLimitPickerChange(e) {
				this.loansLimit = this.loansLimitColumns[e.detail.value];
			},
			onLoansRatePickerChange(e) {
				this.loansRate = this.loansRateColumns[e.detail.value].value;
			},
			onDownPaymentPickerChange(e) {
				this.downPayment = this.downPaymentColumns[e.detail.value];
			},
			calculate() {
				let dealPrice = this.dealPrice * 10000;
				//首付款
				let initialPay = (dealPrice * this.downPayment) / 10;
				//贷款金额
				let loanAmount = dealPrice - initialPay;
				//贷款月利率
				let b = this.loansRate / 100 / 12;
				//贷款月数
				let m = this.loansLimit * 12;
				//每月还款
				let monthPay = (loanAmount * b * (1 + b) ** m) / ((1 + b) ** m - 1);
				this.monthPay = Math.floor(monthPay) + '元';
				//保存每月利息
				let mothInterests = [];
				let surplusPrincipal = loanAmount;
				for (let i = 0; i < m; i++) {
					let mothInterest = surplusPrincipal * b;
					mothInterests.push(mothInterest);
					surplusPrincipal -= monthPay - mothInterest;
				}
				//计算月利率
				let x = (1 + this.expectOtherInterest / 100) ** (1 / 12);

				let tempExpectHoldTime = this.expectHoldTime;
				if (this.expectHoldTime > this.loansLimit) {
					tempExpectHoldTime = this.loansLimit;
				}

				//到卖房时每月还款的本息和
				let amount = Math.floor(
					(monthPay * x * (x ** (tempExpectHoldTime * 12) - 1)) / (x - 1)
				);
				//计算到卖房时期间的本金和
				let principalAccount = 0;
				for (let i = 0; i < tempExpectHoldTime * 12; i++) {
					principalAccount += monthPay - mothInterests[i];
				}
				//持有期间月供中利息的损失
				let rentDamage = amount - principalAccount;
				let rentAmount = 0;
				for (let i = 0; i < this.expectHoldTime; i++) {
					let monthRent = this.expectMothRent * (1 + this.expectRentRise / 100) ** i;
					let yearRent = Math.floor(
						(monthRent * x * (Math.pow(x, 12) - 1)) / (x - 1)
					);
					rentAmount += yearRent * (1 + this.expectOtherInterest / 100) ** (this.expectHoldTime - i - 1);
				}

				//持有期间共损失金额
				let damage = rentDamage - rentAmount;
				//房屋售价
				let tempHouseSell =
					Math.floor(
						dealPrice * (1 + this.expectHouseRise / 100) ** this.expectHoldTime
					) +
					(10000 * this.expectRenovationCost) / 2;
				this.houseSell = tempHouseSell + '元';
				//赚到的钱
				let makeMoney = tempHouseSell - damage - loanAmount;
				//总投资
				this.totalInvestment =
					this.expenses / 100 * this.dealPrice +
					this.expectRenovationCost * 10000 +
					initialPay +
					(dealPrice * this.agentRate) / 100 +
					(this.loanService / 100) * loanAmount +
					Number(this.otherCost);
				let tempInvestment = makeMoney / this.totalInvestment;
				//总投资回报率
				this.investment = (100 * tempInvestment).toFixed(2) + '%';
				//现金的现金回报率
				this.cashRewards = (this.expectMothRent * 12 / this.totalInvestment * 100).toFixed(2) + '%';
				//年化回报率
				let tempAnnualized =
					Math.pow(tempInvestment, 1 / this.expectHoldTime) - 1;
				this.annualized = (tempAnnualized * 100).toFixed(2) + '%';
			},
			reset() {
				this.dealPrice = '';
				this.downPayment = 3;
				this.loansLimit = 20;
				this.loansRate = 4.9;
				this.expenses = '';
				this.agentRate = 2;
				this.expectRenovationCost = '';
				this.expectMothRent = '';
				this.expectOtherInterest = 15;
				this.expectHouseRise = 8;
				this.expectRentRise = 5;
				this.expectHoldTime = 5;
				this.otherCost = 5000;
				this.houseSell = '点击计算得出';
				this.totalInvestment = '点击计算得出';
				this.investment = '点击计算得出';
				this.annualized = '点击计算得出';
				this.cashRewards = '点击计算得出';
			}
		},
		computed: {
			disabled() {
				return !(
					this.dealPrice &&
					this.downPayment &&
					this.loansLimit &&
					this.expenses &&
					this.loansRate &&
					this.otherCost &&
					this.loanService &&
					this.agentRate &&
					this.expectRenovationCost &&
					this.expectMothRent &&
					this.expectOtherInterest &&
					this.expectRentRise &&
					this.expectHouseRise &&
					this.expectHoldTime
				);
			},
			cloansRate() {
				return this.loansRate + '%';
			},
			cloansLimit() {
				return this.loansLimit + '年';
			},
			cdownPayment() {
				return this.downPayment + '成';
			}
		}
	}
</script>

<style>
	.value-class {
		color: #353535 !important;
	}
	/* 防止表单标题长短不一 */
	.cu-form-group .title {
		min-width: calc(5em + 15px);
	}
</style>
