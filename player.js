
//play
var play = function() {
	playStatus = true
	var gan = e('#id-gan')
	var ganMove = 'translateX(-50%) rotateZ(-5deg)'
	var music = e('#id-audio-player')
	var delay = 500
	var playBtn = e('#id-img-play')
	playBtn.src = 'img/stop2.png'
	if(music.playTimeout == undefined) {
		music.playTimeout = null
	}
	gan.style.transform = ganMove
	setTimeout(rotateCD, delay)
	music.playTimeout = setTimeout(playMusic, delay)
	bindEventPlayProgress()
	showTime()
}

//stop
var stop = function() {
	playStatus = false
	var cd = e('#id-rotate-cd')
	clearInterval(cd.interval)
	var gan = e('#id-gan')
	var ganMove = 'translateX(-50%) rotateZ(-30deg)'
	gan.style.transform = ganMove
	var playBtn = e('#id-img-play')
	playBtn.src = 'img/play2.png'
	stopMusic()
}

//play music
var playMusic = function() {
	var music = e('#id-audio-player')
	music.play()
}

//stop music
var stopMusic = function() {
	var music = e('#id-audio-player')
	music.pause()
}

//旋转CD
var rotateCD = function() {
	var cd = e('#id-rotate-cd')
	if(cd.interval == undefined) {
		cd.interval = null
	}
	if(cd.dregree == undefined) {
		cd.dregree = 0
	}
	clearInterval(cd.interval)
	cd.interval = setInterval(function() {
		cd.dregree = (cd.dregree + 0.25) % 360
		var style = `translateX(-50%) translateY(-50%) rotateZ(${cd.dregree}deg)`
		cd.style.transform = style
	}, 20)
}

//reset CD
var resetCD = function() {
	var cd = e('#id-rotate-cd')
	var style = `translateX(-50%) translateY(-50%) rotateZ(0deg)`
	cd.dregree = 0
	cd.style.transform = style
}

//播放 时间显示
var showTime = function() {
	var music = e('#id-audio-player')
	var currentTimeSpan = e('#id-current-time')
	var durationSpan = e('#id-duration')
	music.show = null
	clearInterval(music.show)
	music.show = setInterval(function() {
		var duration = music.duration
		var currentTime = music.currentTime
		if(duration != '' && currentTime != '') {
			currentTimeSpan.innerHTML = time(currentTime)
			durationSpan.innerHTML = time(duration)
		}
		showProgrss()
	}, 100)
}

//绑定 改变进度
var bindEventPlayProgress = function() {
	var pointer = e('#id-music-progress-point')
	bindEventProgress(pointer, changeProgress, endChangeProgress)
}

var endChangeProgress = function() {
	var music = e('#id-audio-player')
	if(music.changeProgress == true) {
		music.currentTime = music.current
	}
	music.changeProgress = false
}

var showProgrss = function() {
	var music = e('#id-audio-player')
	var duration = music.duration
	var currentTime = music.currentTime
	var len = currentTime / duration * 100
	if(music.changeProgress == undefined) {
		music.changeProgress = false
	}
	if(music.changeProgress == false) {
		setProgress(len)
	}
}

var changeProgress = function() {
	var music = e('#id-audio-player')
	music.changeProgress = true
	music.current = 0
	var progressSection = e('#id-progress')
	var duration = e('#id-duration')
	var d = event.clientX - progressSection.offsetLeft
	var width = duration.offsetLeft - progressSection.offsetLeft
	if(d <= 0) {
		d = 0
	}
	if(d >= width) {
		d = width - 1
	}
	var len = Math.floor(d * 100 / width)
	var duration = music.duration
	var currentTime = music.currentTime
	music.current = duration * len / 100
	setProgress(len)
}

var setProgress = function(len) {
	var progressSection = e('#id-progress')
	var duration = e('#id-duration')
	var width = duration.offsetLeft - progressSection.offsetLeft
	var pointer = e('#id-music-progress-point')
	var px = len * width / 100
	pointer.style.left = px +'px'
	var currentProgress = e('#id-current-progress')
	currentProgress.style.width = len + '%'
}

//计算时间
var time = function(t) {
	var sec = Math.floor(t % 60)
	var min = Math.floor(t / 60)
	if(sec < 10) {
		sec = '0' + sec
	}
	if(min < 10) {
		min = '0' + min
	}
	return `${min}:${sec}`
}

//绑定 暂停 播放 按钮图片 切换
var bindEventPlay = function() {
	var pre = e('#id-img-pre')
	var next = e('#id-img-next')
	var playBtn = e('#id-img-play')
	bindEvent(playBtn, 'click', function() {
		if(playStatus == false) {
			playStatus = true
			play()
		} else {
			playStatus = false
			stop()
		}
	})
}

//绑定 进度条函数
var bindEventProgress = function(pointer, classback, endCallback) {
	var body = e('body')
 	pointer.move = false
	bindEvent(pointer, 'mousedown', function() {
		pointer.move = true
	})
	bindEvent(body, 'mousemove', function(e) {
		if(pointer.move == true) {
			classback(e)
		}
	})
	bindEvent(body, 'mouseup', function() {
		pointer.move = false
		if(endCallback != undefined) {
			endCallback()
		}
	})
	bindEvent(body, 'mouseleave', function() {
		pointer.move = false
		if(endCallback != undefined) {
			endCallback()
		}
	})
}

//绑定音量按钮
var bindEventVol = function() {
	var pointer = e('#id-music-vol-point')
	bindEventProgress(pointer, changeVol)
}

//调节音量
var changeVol = function(event) {
	var volSection = e('#id-music-vol-order')
	var d = event.clientX - volSection.offsetLeft
	if(d <= 100) {
		d = 100
	}
	if(d >= 200) {
		d = 200
	}
	//改变圆点 及 进度条
	var volWidth = d - 100
	var volume = volWidth / 100
	var pointer = e('#id-music-vol-point')
	pointer.style.left = d +'px'
	var vol = e('#id-music-vol')
	vol.style.width = volWidth + 'px'
	//改变音量
	var music = e('#id-audio-player')
	music.volume = volume
}

//音乐初始化
var musicInt = function() {
	var music = e('#id-audio-player')
	music.volume = 0.5
	UpdateMusicList()
	bindEventSelectMusic()
	if(musicList.length >= 1) {
		var m = musicList[0]
		updateMusic(m)
	}
	bindEventToggleMusic()
	bindEventMusicEnd()
	bindEventNextPlay()
}

//更新播放列表
var UpdateMusicList = function() {
	var list = e('#id-music-play-list ')
	var musics = findAll(list, '.music-info')
	for(var j = 0; j < musics.length; j++) {
		musics[j].remove()
	}
	for(var i = 0; i < musicList.length; i++) {
		insertMusic(musicList[i], i)
	}
	bindEventSelectMusic()
}

//插入音乐
var insertMusic = function(music, i) {
	var musicName = music.name
	var singer = music.singer
	var duration = music.duration
	var html = `<div class=music-info data-num=${i }>
		<span class=music-name>${musicName}</span>
		<span class=music-duration>${duration}</span>
		<span class=music-singer>${singer}</span>
	</div>`
	var list = e('#id-music-play-list')
 	appendHtml(list, html)
}

//更新当前音乐
var updateMusic = function(music) {
	var player = e('#id-audio-player')
	var baseAD = 'music/'
	player.src = baseAD + music.music
	var currentMusic = e('#id-current-music')
	var topCurrentMusic = e('#id-top-playing-name')
	topCurrentMusic.innerHTML = `${music.name}`
	currentMusic.innerHTML = `${music.name}--${music.singer}`
	upatePlayingSymbol()
	var cover = e('#id-cd-cover')
	var basePath = 'img/'
	var path = basePath + music.imgPath
	cover.style.backgroundImage = `url(${path})`
}

//更新正在播放标志
var upatePlayingSymbol = function() {
	removeClassAll('playing')
	var list = e('#id-music-play-list')
	var cur = parseInt(list.dataset.cur)
	var musics = findAll(list, '.music-info')
	musics[cur].classList.add('playing')
}

//绑定 选择播放列表
var bindEventSelectMusic = function() {
	bindAll('.music-info', 'click', function(event) {
		var list = e('#id-music-play-list')
		var cur = parseInt(list.dataset.cur)
		var num = parseInt(this.dataset.num)
		list.dataset.cur = num
		CutPlay(musicList[num], num)
	})
}

//绑定 切换歌曲按钮
var bindEventToggleMusic = function() {
	var next = e('#id-img-next')
	var pre = e('#id-img-pre')
	bindEvent(next, 'click', nextMusic)
	bindEvent(pre, 'click', preMusic)
}

//下一首
var nextMusic = function() {
	resetCD()
	var list = e('#id-music-play-list')
	var cur = parseInt(list.dataset.cur)
	var len = musicList.length
	var nextIndex = (cur + 1) % len
	list.dataset.cur = nextIndex
	updateMusic(musicList[nextIndex])
	stop()
	setTimeout(play, 500)
}

//切歌并播放
var CutPlay = function(music, n) {
	updateMusic(music)
	upateCurrentMusic(n)
	resetCD()
	stop()
	setTimeout(play, 500)
}

//更新当前歌曲
var upateCurrentMusic = function(n) {
	var list = e('#id-music-play-list')
	list.dataset.cur = n
	upatePlayingSymbol()
}

//上一首
var preMusic = function() {
	resetCD()
	var list = e('#id-music-play-list')
	var cur = parseInt(list.dataset.cur)
	var len = musicList.length
	var preIndex = (len +　cur - 1) % len
	list.dataset.cur = preIndex
	updateMusic(musicList[preIndex])
	stop()
	setTimeout(play, 500)
}

//绑定 音乐结束
var bindEventMusicEnd = function() {
	var player = e('#id-audio-player')
	bindEvent(player, 'ended', function() {
		stop()
		setTimeout(autoPlayNext, 500)
	})
}

//自动播放下一首
var autoPlayNext = function() {
	resetCD()
	var musicOrder = e('#id-music-order')
	var order = musicOrder.dataset.order
	if(order == '0') {
		nextMusic()
	}
	if(order == '1') {
		randomPlay()
	}
	if(order == '2') {
		againPlay()
	}
}

//单曲循环
var againPlay = function() {
	var list = e('#id-music-play-list')
	var cur = parseInt(list.dataset.cur)
	updateMusic(musicList[cur])
	play()
}

//随机播放
var randomPlay = function() {
	var list = e('#id-music-play-list')
	var cur = parseInt(list.dataset.cur)
	var len = musicList.length
	var nextIndex = Math.floor(Math.random() * len)
	while(nextIndex == cur) {
		nextIndex = Math.floor(Math.random() * len)
	}
	list.dataset.cur = nextIndex
	updateMusic(musicList[nextIndex])
	play()
}

//绑定播放方式
var bindEventNextPlay = function() {
	var musicOrder = e('#id-music-order')
	bindEvent(musicOrder, 'click', function() {
		var len = loop.length
		var order = (musicOrder.dataset.order + 1) % len
		musicOrder.dataset.order = order
		var basePath = 'img/'
		musicOrder.src = basePath + loop[order] + '.png'
	})
}

//换页
var bindEventPage = function() {
	var page0 = e('#id-page-0')
	var page1 = e('#id-page-1')
	var preBtn = e('#id-pre-page')
	var nextBtn = e('#id-next-page')
	var main = e('#id-main')
	bindEvent(preBtn, 'click', function(e) {
		page0.style.left = '50%'
		page0.style.opacity = '1'
		page1.style.right = '-400%'
		page1.style.opacity = '0'
		preBtn.style.opacity = '0'
		nextBtn.style.opacity = '1'
	})
	bindEvent(nextBtn, 'click', function(e) {
		page0.style.left = '-400%'
		page0.style.opacity = '0'
		page1.style.right = '50%'
		page1.style.opacity = '1'
		preBtn.style.opacity = '1'
		nextBtn.style.opacity = '0'
		scrollTo(0,0);
	})
}

//绑定事件
var bindEvents = function() {
	bindEventPage()
}
//初始化
var init = function() {
	playStatus = false
	musicInt()
	bindEventPlay()
	bindEventVol()
	bindEventPlayProgress()
	bindEvents()
}

init()
