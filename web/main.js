;(function() {
    var version = '1.0.0',
        keys = {},
        $search = document.querySelector('#search'),
        $keyboard = document.querySelector('#keyboard'),
        $keys = document.querySelectorAll('#keyboard li'),
        $setting = document.querySelector('#setting'),
        $close = document.querySelector('.close'),
        $newWindow = document.querySelector('#newWindow'),
        $searchEngine = document.querySelector('#searchEngine')

    // init
    if (localStorage.version != version) {
        localStorage.version = version
        localStorage.newWindow = 1
        localStorage.searchEngine = 'https://www.baidu.com/s?wd='
        localStorage[49] = "https://github.com/"
        localStorage[50] = "https://www.teambition.com/"
        localStorage[51] = "http://www.fabric.io/"
        localStorage[52] = "https://analytics.amplitude.com/"
        localStorage[65] = "http://www.jianshu.com/"
        localStorage[67] = "http://www.cocos.com/docs/creator/api/"
        localStorage[68] = "https://stackshare.io/"
        localStorage[69] = "http://www.wzxjiang.com/"
        localStorage[70] = "http://jiliguala.com/niuwa/forum/"
        localStorage[81] = "https://www.v2ex.com/"
        localStorage[83] = "https://speakerdeck.com/"
        localStorage[84] = "http://t.swift.gg"
        localStorage[87] = "https://exmail.qq.com/login"
        localStorage[90] = "https://www.zhihu.com"
    }

    for (var i in $keys) {
        if (!$keys.hasOwnProperty(i)) continue

        keys[$keys[i].dataset.key] = {
            'li': $keys[i],
            'span': $keys[i].firstElementChild
        }
    }

    for (var i = 48; i < 91; i++) {
        var url = localStorage[i]
        if (url) addFavicon(keys[i]['li'], getFavicon(url))
    }

    // read settings
    if (~~localStorage.newWindow) {
        $newWindow.classList.add('active')
    } else {
        $newWindow.classList.remove('active')
    }
    $searchEngine.value = localStorage.searchEngine

    function getSpecialDomains() {
       return [
            { 
                "url": "fabric.io", 
                "ico": "https://www.fabric.io/fabric.ico" 
            },
            { 
                "url": "wzxjiang.com", 
                "ico": "http://wzxjiang.com/img/favicon.ico" 
            },
            { 
                "url": "t.swift.gg", 
                "ico": "http://t.swift.gg/myfavicons/apple-touch-icon-57x57.png"
            },
            { 
                "url": "cocos.com", 
                "ico": "http://7xnozu.com1.z0.glb.clouddn.com/cocos.png"
            },
            { 
                "url": "analytics.amplitude.com", 
                "ico": "https://static.amplitude.com/lightning/df5dc37e09b44def92baef0735f85ea7664ec7af/favicon.ico"
            },
        ]
    }

    function getFavicon(url) {
        var specialDomains = getSpecialDomains()

        for (var i = 0; i < specialDomains.length; i++) {
            var domain = specialDomains[i]
            if (url.indexOf(domain["url"]) > 0) {
                return domain["ico"]
            }
        }

        return url.split('/').slice(0,3).join('/') + "/favicon.ico"
    }

    function removeFavicon($li) {
        for (var i = 0; i < $li.childNodes.length; i++) {
            var node = $li.childNodes[i]
            if (node.nodeName == 'IMG' && node.className == 'fav') {
                $li.removeChild(node)
            }
        }
    }

    function addFavicon($li, src) {
        var img = document.createElement('img')
        img.src = src
        img.className = 'fav'
        $li.appendChild(img)
    }

    function keyDown(key) {
        if (!key) return
        keys[key]['span'].classList.add('keyDownSpan')
        keys[key]['li'].classList.add('keyDownLi')
    }

    function keyUp(key) {
        if (!key) return
        keys[key]['span'].classList.remove('keyDownSpan')
        keys[key]['li'].classList.remove('keyDownLi')
    }

    function openUrl(url) {
        if (~~localStorage.newWindow) {
            window.open(url)
        } else {
            location.href = url
        }
    }

    $search.onkeyup = function(e) {
        if (e.target.value == '设置') return $setting.style.bottom = 0
        var key = e.which || e.keyCode || 0;
        if (key == 13) openUrl(localStorage.searchEngine + e.target.value)
    }

    $close.onclick = function() {
        $setting.style.bottom = '-320px'
    }

    var keyCache = 0
    document.onkeydown = function(e) {
        var key = e.which || e.keyCode || 0
        keyCache = key
        if (key == 9) {
            window.event ? window.event.returnValue = false : e.preventDefault()
            if (document.activeElement == $search) {
                $search.blur()
            } else {
                $search.focus()
            }
        }

        if (document.activeElement == $search) return
        keyDown(key)
    }

    document.onkeyup = function(e) {
        var key = e.which || e.keyCode || 0,
            url = localStorage[key]

        if (document.activeElement != $search) {
            keyUp(key)
        }

        if (url && key == keyCache && document.activeElement != $search) openUrl(url)

        keyCache = 0
    }

    $keyboard.onclick = function(e) {
        if (e.target.tagName != 'SPAN') return
        var name = e.target.innerText,
            key = e.target.parentElement.dataset.key || 0,
            url = prompt("请输入按键 " + name + " 对应的网址", localStorage[key] || '')
        if (url === null) return
        if (url && url.indexOf('http') != 0) url = 'http://' + url

        var li = keys[key]['li']
        removeFavicon(li)
        localStorage[key] = url
        addFavicon(li, getFavicon(url))
    }

    $newWindow.onclick = function() {
        this.classList.toggle('active')
        localStorage.newWindow = +!!!~~localStorage.newWindow
    }

    $searchEngine.onchange = function(e) {
        localStorage.searchEngine = e.target.value
    }
})()

