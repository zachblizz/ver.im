var users = {}

$(function() {
	var socket = io();
	var uname = getParameterByName('uname');
	// displayUsrsOnline();

	$('h2').html('Hello, ' + uname + '! Welcome to ver.im');

	// TODO: only have to emit this once...
	$('#usr-msg').on('input', function() {
		socket.emit('typing', uname);
	});

	$('#msg-board').submit(function() {
		if ("" !== $('#usr-msg').val().trim() && "/cmds" !== $('#usr-msg').val().trim()
			&& $('#usr-msg').val().trim().indexOf('<script>') < 0) {
			var msg = removeTags($('#usr-msg').val().trim());

			if ("" !== msg) {
				socket.emit('chat message', msg, uname);
			} else {
				$('#msgs').append($('<li>').html('<img src="pics/invalid.png" />')); 
			}
			$('#usr-msg').val('');
		} else if ("/cmds" === $('#usr-msg').val().trim()) {
			showCommands();
		} else if ("/clear" === $('#usr-msg').val().trim()) {
			$('#msgs').html('');
			$('#usr-msg').val('');
		}

		return false;
	});

	socket.on('chat message', function(msg, name, online) {
		displayUsrsOnline(online)
		
		if (!$('#usr-msg').is(':focus')) {
			alert(name + " said something!!");
		}

		$('#' + name + '-typing').css('display', 'none');

		var msgStart = '<span style="font-size: 9px;">' + getMsgTime() + '</span> <b>' + name + ':</b>';

		switch(msg) {
			case "/happy": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/awesome4.png" />')); 
				break;
			case "/sad": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/awesome2.png" />')); 
				break;
			case "/rly":
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/awesome5.png" />')); 
				break;
			case "/doubt": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/awesome.png" />')); 
				break;
			case "/hmm": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/hmm.gif" />'));
				break;
			case "/eat": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/happyPoo.gif" />')); 
				break;
			case "/sam": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/sam.jpg" style="height: 100px;" />')); 
				break;
			case "/magic": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/MAGIC.gif" />')); 
				break;
			case "/peaceout": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/minion_bye.gif" />')); 
				break;
			case "/getfat": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/fat_man.gif" />')); 
				break;
			case "/sleepy": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/sleepyAsian.gif" />')); 
				break;
			case "/b": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/thumbsUp-1.gif" />')); 
				break;
			case "/crybabby": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/cry.gif" />')); 
				break;
			case "/rage": 
				$('#msgs').append($('<li>').html(msgStart + ' <img src="pics/keyboardRage.gif" />')); 
				break;
			default: 
				$('#msgs').append($('<li>').html(msgStart + ' ' + msg));
		}
	});

	socket.on('typing', function(name) {
		console.log(name + ' is typing...');
		$('#' + name + '-typing').css('display', 'inline-block');
	});

	socket.on('loggedin', function(usrs) {
		displayUsrsOnline();
	});

	$('#msgs').animate({scrollTop: document.body.scrollHeight},"fast");
});

function displayUsrsOnline(online) {
	$('#usrs').html('<h3>Users Online</h3>');
	online.forEach(function(name) {
		if (!users[name]) {
			users[name] = name;
		}
	})

	for (name in users) {
		$('#usrs').append($('<li>').html(name + '<span id="' + name + '-typing" style="display: none; font-size: 9px;">&nbsp;&nbsp;typing...</span>'));
	}
}

function showCommands() {
	$('#msgs').append($('<li>').html('<b>/happy:</b> <img src="pics/awesome4.png" />')); 
	$('#msgs').append($('<li>').html('<b>/sad:</b> <img src="pics/awesome2.png" />')); 
	$('#msgs').append($('<li>').html('<b>/rly:</b> <img src="pics/awesome5.png" />')); 
	$('#msgs').append($('<li>').html('<b>/doubt:</b> <img src="pics/awesome.png" />')); 
	$('#msgs').append($('<li>').html('<b>/hmm:</b> <img src="pics/hmm.gif" />'));
	$('#msgs').append($('<li>').html('<b>/eat:</b> <img src="pics/happyPoo.gif" />')); 
	$('#msgs').append($('<li>').html('<b>/sam:</b> <img src="pics/sam.jpg" style="height: 100px;" />')); 
	$('#msgs').append($('<li>').html('<b>/magic:</b> <img src="pics/MAGIC.gif" />')); 
	$('#msgs').append($('<li>').html('<b>/peaceout:</b> <img src="pics/minion_bye.gif" />')); 
	$('#msgs').append($('<li>').html('<b>/sleepy:</b> <img src="pics/sleepyAsian.gif" />')); 
	$('#msgs').append($('<li>').html('<b>/b:</b> <img src="pics/thumbsUp-1.gif" />')); 
	$('#msgs').append($('<li>').html('<b>/crybabby:</b> <img src="pics/cry.gif" />'));
	$('#usr-msg').val('');
}

function removeTags(html) {
	var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

	var tagOrComment = new RegExp(
	    '<(?:'
	    // Comment body.
	    + '!--(?:(?:-*[^->])*--+|-?)'
	    // Special "raw text" elements whose content should be elided.
	    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
	    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
	    // Regular name
	    + '|/?[a-z]'
	    + tagBody
	    + ')>',
	    'gi');

	var oldHtml;
	do {
		oldHtml = html;
		html = html.replace(tagOrComment, '');
	} while (html !== oldHtml);
	return html.replace(/</g, '&lt;');
}

function getMsgTime() {
    var date = new Date();
    return (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + ":" 
                + (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()) + ":" 
                + (date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds());
}

function getParameterByName(name, url) {
    if (!url)
      url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}