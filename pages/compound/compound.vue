<template>
	<view class="text-df">
		<view class="cu-form-group">
			<view class="title">
				本金
			</view>
			<input placeholder="请输入" v-model="presentValue" type="digit"></input>
			<picker @change="moneyUnitChange" :range="moneyUnitColumns">
				<view class="action">
					<text>{{moneyUnit}}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">
				期数
			</view>
			<input placeholder="请输入" v-model="fixedTime" type="number"></input>
			<picker @change="bindFixedTimeUnitChange" :range="fixedTimeColumns">
				<view class="action">
					<text>{{fixedTimeUnit}}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">收益率</view>
			<input placeholder="请输入" v-model="expectInterest" type="digit"></input>
			<picker @change="bindExpectInterestUnitChange" :range="expectInterestColumns">
				<view class="action">
					<text>%{{expectInterestUnit}}</text>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</picker>
		</view>
		<view class="padding mt-5">
			<button class="weui-btn" type="primary" @tap="toResult">开始计算</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				presentValue: '',
				fixedTime: '',
				expectInterest: '',
				fixedTimeColumns: ['年', '月', '日'],
				fixedTimeUnit: '年',
				expectInterestColumns: ['年利率', '月利率', '日利率'],
				expectInterestUnit: '年利率' ,//收益率单位
				moneyUnitColumns:['元','万'],
				moneyUnit:'元'
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				console.log(res.target);
			}
			return {
				title: '极简复利计算器',
				path: '/pages/compound/compound'
			};
		},
		methods: {
			/**
			 * 跳转计算结果页面
			 */
			toResult(){
				//校验输入是否正确
				if (this.presentValue=='') {
					uni.showToast({
						title: '请输入本金',
						icon: 'none'
					})
					return;
				} else if(this.fixedTime==''){
					uni.showToast({
						title: '请输入期数',
						icon: 'none'
					})
					return;
				} else if(this.expectInterest==''){
					uni.showToast({
						title: '请输入收益率',
						icon: 'none'
					})
					return;
				}
				//存储计算参数
				uni.setStorageSync('compoundParameter',{
					present:{	//复利现值
						value:this.presentValue,
						unit:this.moneyUnit,
					},
					n:{			//期数
						value:this.fixedTime,
						unit:this.fixedTimeUnit
					},
					i:{			//利率
						value:this.expectInterest,
						unit:this.expectInterestUnit
					},
				});
				uni.navigateTo({
					url:'../result/result'
				})
			},
			moneyUnitChange(e){
				this.moneyUnit = this.moneyUnitColumns[e.detail.value];
			},
			bindExpectInterestUnitChange(e) {
				this.expectInterestUnit = this.expectInterestColumns[e.detail.value];
			},
			bindFixedTimeUnitChange(e){
				this.fixedTimeUnit = this.fixedTimeColumns[e.detail.value];
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
