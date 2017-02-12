//设置背景
var loadRe = function() {
	var reList = e('#id-recommendation-list')
	for(var i = 0; i < onlineReList.length; i++) {
		var basePath = 'img/'
		var music =  onlineReList[i]
		var path = basePath + music.imgPath
        var musicName = music.name
        var html = `<div class="re-music" data-num=${i}>
            <span class=re-photo style="background-image:url(${path})"></span>
            <span class=re-name>${musicName}</span>
        </div>`
		appendHtml(reList, html)
	}
}

//绑定点击
var bindEventAddRe = function() {
    var reList = e('#id-recommendation-list')
    bindAll('.re-music', 'click', function(e) {
        var index = this.dataset.num
        log(index)
        AddFromRe(index)
    })
}
//点击更新列表
var AddFromRe = function(index) {
	var addMusic = onlineReList[index]
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

loadRe()
bindEventAddRe()
