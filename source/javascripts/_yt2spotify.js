// Youtube - Spotify Search
var start = 1,
    index = 0,
    matches = [],
    success = document.getElementById('success'),
    failed = document.getElementById('failed'),
    content = document.getElementById('content');

function load(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                callback([{}]);
            }
        }
    };
    xhr.send();
}

function loadPage(id) {
    if (!id) {
        id = document.getElementById('id').value;
        // Split the URL at the '='
        id = id.split('=');
        id = id[1];
    }
    load('https://gdata.youtube.com/feeds/api/playlists/' + id + '?alt=jsonc&v=2&start-index=' + start + '&max-results=50', function (e) {
        // console.log('loadPage', e);
        if (e.data) {
            searchSpotify(e.data.items);
        }
    });
}

function searchSpotify(items) {
    var name = items[index].video.title || [];
    name = name.match(/[\w']+/g)
        .join(' ')
        // IGNORE THESE WORDS
        .replace(/official/ig, '')
        .replace(/featuring/ig, '')
        .replace(/feat/ig, '')
        .replace(/video/ig, '')
        .replace(/1080p/ig, '')
        .replace(/music/ig, '')
        .replace(/stream/ig, '')
        .replace(/glitch hop/ig, '')
        .replace(/download/, '')
        .replace(/free download/, '')
        .replace(/remix/, '')
        .replace(/lyric/ig, '');


    load('https://ws.spotify.com/search/1/track.json?q=' + encodeURIComponent(name), function (e) {
        if (e.tracks && e.tracks[0]) {
            // console.log('success', name, e);
            // success
            matches.push(e.tracks[0]);
            success.innerHTML += name + '\n';
            content.innerHTML += e.tracks[0].href + '\n';
        } else {
            // console.log('failt', name, e);
            // fail
            failedCount = failedCount + 1;
            // console.log(failedCount);
            failed.innerHTML += name + '\n';
            $('#failed-count').html("("+failedCount+")");
        }

        if (index < items.length - 1) {
            index += 1;
            searchSpotify(items);
        } else {
            var matchCount = matches.length;
            $('#match-count').html("("+matchCount+")");
            $('#success-count').html("("+matchCount+")");
            start += 50;
            index = 0;
            loadPage();
        }
    });
}

document.getElementById('submit').addEventListener('click', function () {
    index = 0;
    matches = [];
    loadPage();
});

// Fail Counter
var failedCount = 0

// copy text

