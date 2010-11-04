findVideos();
//window.addEventListener("focus", findVideos);

/**
 * Find all videos on the page. 
 */
function findVideos() {
    var embeds_col = document.getElementsByTagName('embed');
    var objects = document.getElementsByTagName('object');
    var count = 0;

    // Convert collection to array
    var embeds = [];
    for (var i = 0; i < embeds_col.length; i++) {
        ++count;
    }

    // Check object tags that don't have <embed> element
    for (var i = 0; i < objects.length; i++) {
        if (!/<embed/.test(objects[i].innerHTML)) {
            ++count;
        }
    }

	// Default to always showing the extension if the user is in Google Reader, reddit, or digg
	var doc_title = document.getElementsByTagName('title')
	if (/^(Google Reader|reddit|Digg)*?/.test(doc_title[0].innerHTML)) {
		++count;
	};

    if (count > 0)
    {
		doNotifyBoxee(count);
    }
};

function doNotifyBoxee(count) {
    var port = chrome.extension.connect({name: "boxeeNotify"});
	port.postMessage({found: (count != undefined)});
};