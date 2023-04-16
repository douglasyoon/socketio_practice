const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#msg input');
  const value = input.value;
  socket.emit('new_message', value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = '';
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector('#name input');
  const value = input.value;
  socket.emit('nickname', value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector('#msg');
  const nameForm = room.querySelector('#name');
  msgForm.addEventListener('submit', handleMessageSubmit);
  nameForm.addEventListener('submit', handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} joined`);
});

socket.on('bye', (user, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} left`);
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
  roomList.innerHTML = '';
  if (rooms.length === 0) {
    return;
  }
  const roomList = welcome.querySelector('ul');
  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.appendChild(li);
  });
});

// Websocket
// const msgList = document.querySelector('ul');
// const msgForm = document.querySelector('#message');
// const nickForm = document.querySelector('#nick');
// const socket = new WebSocket(`ws://${window.location.host}`);

// function makeMessage(type, payload) {
//   const msg = { type, payload };
//   return JSON.stringify(msg);
// }

// socket.addEventListener('open', () => {
//   console.log('connected to server✅');
// });

// socket.addEventListener('message', (message) => {
//   const li = document.createElement('li');
//   li.innerText = message.data;
//   msgList.appendChild(li);
// });

// socket.addEventListener('close', () => {
//   console.log('disconnected to server❌');
// });

// function handleSubmit(event) {
//   event.preventDefault();
//   const input = msgForm.querySelector('input');
//   socket.send(makeMessage('new_message', input.value.toString('utf8')));
//   const li = document.createElement('li');
//   li.innerText = `You: ${input.value.toString('utf8')}`;
//   msgList.appendChild(li);
//   input.value = '';
// }

// function handleNickSubmit(event) {
//   event.preventDefault();
//   const input = nickForm.querySelector('input');
//   socket.send(makeMessage('nickname', input.value.toString('utf8')));
//   input.value = '';
// }

// msgForm.addEventListener('submit', handleSubmit);
// nickForm.addEventListener('submit', handleNickSubmit);
