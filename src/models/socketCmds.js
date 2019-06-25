module.exports = {
  typing: 'client:typing',
  doneTyping: 'client:done-typing',
  newUser: 'client:new-user',
  loggedIn: 'server:logged-in',
  loggedOut: 'server:logged-out',
  badUsername: 'server:bad-user-name',
  sendOnlineUsers: 'server:send-online-users',
  receiveClientMsg: 'client:send-message',
  receiveServerMsg: 'server:send-message',
  // private chat cmds
  startPrivateChat: 'client:private-chat',
  chatReceiveClientMsg: 'client:chat-send-message',
  chatReceiveServerMsg: 'server:chat-send-message',
  askToJoin: 'server:ask-to-join',
  leaveRoom: 'client:leave-room'
}
