chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'connectionEstablished') {
    sendResponse({ response: 'Current tab url received', url: message.data });
  } else {
    sendResponse({ response: 'Autofill data received' });

    setTimeout(() => {
      getElements({
        username: message.data.username,
        password: message.data.password,
      });
    }, 1000);
  }
});

const getElements = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const inputs = document.getElementsByTagName('input');
  const inputLength = inputs.length;

  for (let i = 0; i < inputLength; i++) {
    const input = inputs.item(i);
    if (input.type === 'password') {
      console.log('input', input);
      input.value = password;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (
      input.type === 'text' &&
      (input.name === 'username' ||
        input.name === 'login' ||
        input.name === 'email')
    ) {
      input.value = username;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (input.type === 'email') {
      input.value = username;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
};
