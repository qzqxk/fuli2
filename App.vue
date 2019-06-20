<script>
	export default {
		onPageNotFound(res) {
			uni.switchTab({
				url: 'pages/index/index'
			})
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "common/css/main.css";
	@import "common/css/icon.css";
	@import "common/css/weui.wxss";
	@import "common/css/bootstrap.wxss";
	@import "common/css/vant.css";

	page {
		background-color: #f7f7f7;
		font-size: 36rpx;
	}

	.text-primary {
		color: #09bb07 !important;
	}

	.fixed-bottom {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.text-link {
		color: #576b95;
	}

	.text-success {
		color: #09BB07;
	}

	.text-error {
		color: #e64340;
	}
</style>
