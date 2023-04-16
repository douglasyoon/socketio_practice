const msgList = document.querySelector('ul');
const msgForm = document.querySelector('#message');
const nickForm = document.querySelector('#nick');
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener('open', () => {
  console.log('connected to server✅');
});

socket.addEventListener('message', (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;
  msgList.appendChild(li);
});

socket.addEventListener('close', () => {
  console.log('disconnected to server❌');
});

function handleSubmit(event) {
  event.preventDefault();
  const input = msgForm.querySelector('input');
  socket.send(makeMessage('new_message', input.value.toString('utf8')));
  const li = document.createElement('li');
  li.innerText = `You: ${input.value.toString('utf8')}`;
  msgList.appendChild(li);
  input.value = '';
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value.toString('utf8')));
  input.value = '';
}

msgForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
