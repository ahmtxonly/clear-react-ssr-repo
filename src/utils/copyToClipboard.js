const fallbackCopyTextToClipboard = (text, callback) => {
  const textArea = document.createElement('textarea');

  textArea.value = text;
  textArea.style.position = 'fixed';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');

    if (successful) {
      if (callback && typeof callback === 'function') {
        callback(text);
      }
    }
  } catch (err) {
    console.error('Fallback method was unable to copy', err);
  }

  document.body.removeChild(textArea);
};

const copyToClipboard = (text, callback) => {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text, callback);
  }

  navigator.clipboard.writeText(text).then(
    () => {
      if (callback && typeof callback === 'function') {
        callback(text);
      }
    },
    err => {
      console.error('navigator.clipboard could not copy text: ', err);
    }
  );

  return true;
};

export default copyToClipboard;
