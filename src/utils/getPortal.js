const getPortal = id => {
  const hasPortal = !!document.getElementById(id);

  if (!hasPortal) {
    const node = document.createElement('div');

    node.setAttribute('id', id);
    document.body.appendChild(node);
  }

  return document.getElementById(id);
};

export default getPortal;
