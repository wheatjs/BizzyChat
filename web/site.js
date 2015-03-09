var socket = io();
var myNick = "";

$(function()
{
	$("#chat").hide();
	$("#login").show();
	$("#resp").hide();
});

function validate_message(msg)
{
	
}

function doLogin()
{
	var nick = $("#login_nick").val();
	var pass = $("#login_pass").val();
	
	socket.emit('AUTH_LOGIN', nick, pass);
}

$('#messages').append($('<li class="user_notice">').text("Welcome to the chat!"));
$('#msgBox').keypress(function (e) {
	if (e.which == 13) {
		var text =  $("#msgBox").val();
		$('#msgBox').val('');
		
		socket.emit('CHAT_MSG', text);
		$('#messages').append("<span class='chat_message'><span class='chat_nick'>"+myNick+"</span>: "+text+"</span><br/>");
		
		return false;
	}
});


socket.on('CHAT_MSG', function(nick, msg)
{
	$('#messages').append("<span class='chat_message'><span class='chat_nick'>"+nick+"</span>: "+msg+"</span><br/>");
});

socket.on('USR_CONNECT', function()
{
	$('#messages').append($('<li class="user_notice">').text("User connected."));
	getNicks();
});

socket.on('USR_DISCONNECT', function()
{
	$('#messages').append($('<li class="user_notice">').text("User disconnected."));
	getNicks();
});

socket.on('CONN_KICKED', function(reason)
{
	alert("You were kicked from the server: "+reason);
	window.location = window.location;
});

socket.on('USR_KICKED', function(nick, reason)
{
	$('#messages').append("<span class='chat_message user_notice'><span class='chat_nick'>"+nick+"</span> was kicked("+reason+").</span><br/>");
	getNicks();
});
socket.on('disconnected', function(reason)
{
	window.location = window.location;
});

socket.on('NICK_LIST', function(list)
{
	if(!list) return;
	
	var html = "<h1 style='color: darkgreen;font-size: 20px'>Users</h1><br/>";
	for(var i = 0; i < list.length; i++)
		html += "<span class='ulist_nick'>"+list[i]+"</span><br/>";
	
	html += "";
	$("#sidebar").html(html);
});

socket.on('CHAT_HISTORY', function(list)
{
	if(!list) return;
	
	for(var i = 0; i < list.length; i++)
		$('#messages').append("<span class='chat_message'><span class='chat_nick'>"+list[i][0]+"</span>: "+list[i][1]+"</span><br/>");
	
});

function getNicks()
{
	socket.emit("NICK_LIST");
}
setInterval(getNicks, 3000)

//auth response
socket.on('AUTH_RESPONSE', function(status, error)
{
	if(status)
	{
		$("#chat").show();
		$("#login").hide();
		myNick = $("#login_nick").val();
		$("#login_pass").val("");
		$("#resp").hide();
	}
	else
	{
		$("#resp_error").html(error);
		$("#resp").show();
	}
});