# JStool

放一些自己写过的JS~

## 1.customAudio 

自定义H5音乐播放器样式。
基于jquery

```
//参数设置
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

```

```
\\调用
MyAudio.run({$audioBox:$('#Audio1')});
```