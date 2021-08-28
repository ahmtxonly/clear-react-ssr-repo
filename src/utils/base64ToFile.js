const urlToFile = async (url, filename, mimeType) => {
  const fileType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];

  const res = await fetch(url);

  const buffer = await res.arrayBuffer();

  return new File([buffer], filename, { type: fileType });
};

export default urlToFile;
