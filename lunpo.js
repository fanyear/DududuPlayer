
var container = e("#id-lunpo")
var photos = es("#id-lunpo .photo")
var position = [
{
	x : -400,
	y : 0,
	z : -120,
},
{
	x : -200,
	y : 0,
	z : -60,
},
{
	x : 0,
	y : 0,
	z : 30,
},
{
	x : 200,
	y : 0,
	z : -60,
},
{
	x : 400,
	y : 0,
	z : -120,
}]
var playLunpoInterval = null
var nLunpo = 0

var playLunpo = function() {
	clearInterval(playLunpoInterval)
	playLunpoInterval = setInterval(function() {
		nLunpo = changePos(nLunpo)
	}, 3000)
}

var stopLunpo = function() {
	clearInterval(playLunpoInterval)
}

var changePos = function(nLunpo) {
	for(var i = 0; i < photos.length; i++) {
		photos[i].style.transform = `translate3d(${position[nLunpo].x}px, ${position[nLunpo].y}px, ${position[nLunpo].z}px)`
		nLunpo++
		nLunpo %= photos.length
	}
	nLunpo++
	nLunpo %= photos.length
	return nLunpo
}

var indexOf = function(e) {
	var id = e.id
	var ids = id.split("-")
	var index = parseInt(ids[ids.length - 1])
	return index
}
var setPos = function(e) {
	var event = e.target
	var index = indexOf(event)
	var pos = ((2 - index) + 5) % photos.length
	log("index", index,"pos", pos)
	nLunpo = changePos(pos)
	AddFromLunbo(index)
}

var initLunpo = function() {
	container.addEventListener("mouseover",function() {
		clearInterval(playLunpoInterval)

	})
	container.addEventListener("mouseout",function() {
		playLunpo()
	})
	container.addEventListener("click", setPos)
}

//设置背景
var setBackground = function() {
	var lunpo = e('#id-lunpo')
	var photos = findAll(lunpo, 'span')
	for(var i = 0; i < photos.length; i++) {
		var basePath = 'img/'
		var music =  onlineList[i]
		var path = basePath + music.imgPath
		photos[i].style.backgroundImage = `url(${path})`
		var a = find(photos[i], 'a')
		a.innerHTML = `${music.name}--${music.singer}`
	}
}

//点击更新 播放列表 并播放
var AddFromLunbo = function(index) {
	var addMusic = onlineList[index]
	for(var i = 0; i < musicList.length; i++) {
		var music = musicList[i].music
		if(music == addMusic.music) {
			log('播放列表已存在该歌曲')
			CutPlay(musicList[i], i)
			return
		}
	}
	musicList.push(addMusic)
	UpdateMusicList()
	var n = musicList.length - 1
	CutPlay(addMusic, n)
}

initLunpo()
playLunpo()
setBackground()
nLunpo = changePos(nLunpo)
