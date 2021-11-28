function chatApp() {
  const socket = io();
  $('#chat').on('submit', (e) => {
    socket.emit('send message', $('#name').val(), $('#message').val());
    $('#message').val('');
    $('#message').focus();
    e.preventDefault();
  });
  socket.on('receive message', (msg) => {
    $('#chatLog').append(msg + "\n");
    $('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
  });
}
