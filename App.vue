<script>
	var fundebug = require('./libs/fundebug.1.3.1.min.js');
	fundebug.init({
		apikey: 'f93ca01c668e76d262aeff48bcc4d372cc3df92fc16c755ba1a17485127256ea'
	})
	export default {
		onPageNotFound(res) {
			uni.switchTab({
				url: 'pages/index/index'
			})
		},
		//清空缓存
		onShow() {
			// uni.clearStorageSync();
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "common/css/main.css";
	@import "common/css/icon.css";
	@import "common/css/weui.wxss";
	@import "common/css/bootstrap.wxss";

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
