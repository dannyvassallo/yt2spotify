function zcInit() {
    var client = new ZeroClipboard($('#copy-button'));

    client.on('ready', function(event) {
        client.on('copy', function(event) {
            // `this` === `client`
            // `event.target` === the element that was clicked

            // Get the text content of <input> or <textarea> that comes immediately before the clicked button
            // var $prevEle = $(event.target).prev();
            var $prevEle = $('#content');
            var text = $prevEle.is('textarea') ? $prevEle.val().replace(/\n/g, '\r\n') : $prevEle.val();

            // If value of `text` is not empty, set the data to clipboard
            if (text) {
                event.clipboardData.setData('text/plain', text);
            }
        });

        client.on('aftercopy', function(event) {
            // Check if copied text is not empty
            if (event.data["text/plain"]) {
                // Call something on successful copying
                $(event.target).next().stop().css('opacity', 1).text('Copied!').fadeIn(30).fadeOut(1000);
            }
        });
    });

    client.on('error', function(event) {
        ZeroClipboard.destroy();
    });
}

// Function for copying text using window.clipboardData
function addHandler_WinClipData() {
    $('#copy-button').click(function() {
        var $prevEle = $(this).prev();
        var text = $prevEle.is('textarea') ? $prevEle.val().replace(/\n/g, '\r\n') : $prevEle.val();

        // If value of `text` is not empty, set the data to clipboard
        if (text && window.clipboardData.setData('Text', text)) {
            // Call something on successful copying
            $(this).next().stop().css('opacity', 1).text('Copied!').fadeIn(30).fadeOut(1000);
        }
    });
}

// Function for pop up a message and select text in <input> or <textarea>, in case window.Clipboard data and Flash are not available
function addHandler_AlertMsg() {
    $('#copy-button').click(function() {
        if ($(this).prev().val()) {
            alert('No Flash installed. Please copy manually');
            $(this).prev().focus().select();
        }
    });
}

// Function for checking Flash availability
function detectFlash() {
    var hasFlash = false;
    try {
        var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (fo) {
            hasFlash = true;
        }
    } catch (e) {
        if (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] !== undefined &&
            navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
            hasFlash = true;
        }
    }
    return hasFlash;
}

var hasWinClipData = !!(window.clipboardData && clipboardData.setData),
    hasFlash = detectFlash();

if (hasWinClipData) {    // Check if window.clipboardData is available
    addHandler_WinClipData();
} else if (hasFlash) {    // Check if Flash is available
    $.ajax({
        type: "GET",
        url: '//cdn.jsdelivr.net/zeroclipboard/2.1.6/ZeroClipboard.min.js',
        dataType: "script",
        cache: true,
        success: zcInit,
        error: addHandler_AlertMsg
    });
} else {    // In case window.clipboardData and Flash are not available, bind a "click" event handler to the "copy buttons" to pop up a message when clicked
    addHandler_AlertMsg();
}
