var MyAudio = (function ($){
	var common={
		// 转换音频时长显示
		transTime:function (time) {
			var duration = parseInt(time);
		    var minute = parseInt(duration/60);
		    var sec = duration%60+'';
		    var isM0 = ':';
		    if(minute == 0){
		        minute = '00';
		    }else if(minute < 10 ){
		        minute = '0'+minute;
		    }
		    if(sec.length == 1){
		        sec = '0'+sec;
		    }
		    return minute+isM0+sec;
		}
	};
	//默认值
	var param ={
		$audioBox:$('#Audio1'),//整个音乐播放器的id
		play:'.play-pause', //播放按钮
		iconPlay:'div',//播放按钮样式的元素
		cssPause:'icon-pause', //播放样式类名
		cssPlay:'icon-play',  //暂停样式类名
		pgsBtn:'.pgs-progress',  //进度条拖拽按钮
		pgsBg:'.pgs', //进度背景条类名
		pgsShow:'.pgs-play', //进度显示条类名
		timeTag:'.audio-time', //总时长标签类名
		currentTime:'.played-time',//已播放时长标签类名
		changePlayBtn:function($obj) {
			// 改播放按钮状态为待播放
			if($obj==undefined) return;
			// $obj.removeClass(this.cssPause).addClass(this.cssPlay);
			$obj.removeClass(this.cssPause).addClass(this.cssPlay);
		},
		changePauseBtn:function() {
			// 改播放按钮状态为待暂停
			this.$audioBox.find(this.play).children(this.iconPlay).removeClass(this.cssPlay).addClass(this.cssPause);
		},
		changePgs:function(value) {
			// 更改进度条样式
			this.$audioBox.find(this.pgsShow).css('width',value+ '%');
		},
		changeCurrentTime:function(time) {
			// 更新播放时间
			this.$audioBox.find(this.currentTime).html(time);
		},
		changeTimeTag:function(audio) {
			// 更新总时长
			this.$audioBox.find(this.timeTag).text(common.transTime(audio.duration));
		}
	};
	// 组件类
	var INIT = function(options){
		this.options=options;
		this.audio=this.options.$audioBox.find('audio')[0];
		this.$audioBox=this.options.$audioBox;
	};
	//播放完成:this=audio
	INIT.prototype.audioEnded=function() {
		this.audio.currentTime=0;
	    this.audio.pause();
		this.options.changePlayBtn(this.$audioBox.find(this.options.play).children(this.options.iconPlay));
	}
	//更新进度条:this=audio
	INIT.prototype.updateProgress = function(){
		var value = Math.round((Math.floor(this.audio.currentTime) / Math.floor(this.audio.duration)) * 100, 0);
	    var time=common.transTime(this.audio.currentTime);
	    this.options.changePgs(value);
	    if(time!='NaN:NaN') this.options.changeCurrentTime(time);
	}
	//改变暂停/播放icon
	INIT.prototype.playPause = function(){
		var self=this;
		console.log(self.options.play);
		this.$audioBox.find(self.options.play).click(function(){
	        if(self.audio.paused){
	            $('audio').each(function () {
	            	this.pause();
	            });
	            self.options.changePlayBtn($(self.options.play).children(self.options.iconPlay));
	            self.audio.play();
	            self.options.changePauseBtn();
	        } else{
	            self.audio.pause();
	            self.options.changePlayBtn(self.$audioBox.find(self.options.play).children(self.options.iconPlay));
	        }
	    });
	};
	// 获取总时长
	INIT.prototype.audioTag =function() {
		var self=this;
		$(this.audio).on("loadedmetadata",function () {
	        self.options.changeTimeTag(this);
	    });
	}
	// 监听播放进度
	INIT.prototype.timeupdate =function() {
		var self=this;
		this.audio.addEventListener('timeupdate',function() {
			self.updateProgress();
		},false);
	}
	// 播放完成，初始化信息
	INIT.prototype.ended =function() {
		var self=this;
		this.audio.addEventListener('ended',function() {
			self.audioEnded();
		},false);
	}
	// 拖拽改变进度条
	INIT.prototype.progress =function() {
		var self=this;
		this.options.$audioBox.find(this.options.pgsBtn).on('mousedown',function(ev) {
	    	var $this=$(this);
	    	var oEvent = ev || event;
            $(document).on('mousemove',function(ev) {
            	var oEvent = ev || event;
            	var downLg = oEvent.clientX - $this.parents(self.options.pgsShow).offset().left;
                var bgW=$this.parents(self.options.pgsBg).outerWidth(false);
                if(downLg<0){
                    downLg=0;
                }else if(downLg>bgW){
                    downLg=bgW;
                }
                downLg=parseInt((downLg/bgW)*100);
                self.audio.currentTime = self.audio.duration * (downLg/100);
		        self.updateProgress();
            });
            $(document).on('mouseup',function(ev) {
            	$(document).unbind('mouseup');
            	$(document).unbind('mousemove');
            });
	    });
	}
	

	var run=function(options) {
		param = $.extend({}, param, options);
		var myaudio=new INIT(param);
		// 执行
		myaudio.playPause();
		myaudio.timeupdate();
		myaudio.progress();
		myaudio.ended();
		myaudio.audioTag();
	}
	return {
		run : run,
	};
})(jQuery);