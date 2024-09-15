async function getDataURL(file) {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

async function getBlobFromURL(url, fetchOptions) {
  let res = await fetch(url, fetchOptions);
  res = await res.blob();
  return res;
}

async function getFileFromURL(url, fileName, fetchOptions) {
  let res = await fetch(url, fetchOptions);
  res = await res.blob();
  const file = new File([res], fileName, { type: res.type });
  return file;
}

function handleProtection(event, listener_function) {
  event.stopPropagation();

  const file = event.target.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = async function (readerEvent) {
    chrome.runtime.sendMessage({
      from: "content",
      subject: "protectionRequest",
      mediaUrl: readerEvent.target.result,
      left: window.screenLeft + window.outerWidth,
      top: window.screenTop,
    });

    chrome.runtime.onMessage.addListener(async function msgListener(msg) {
      if (msg.from === "background" && msg.subject === "protectionResponse") {
        chrome.runtime.onMessage.removeListener(msgListener);

        let blob = await getBlobFromURL(msg.result);
        let dataTransfer = new DataTransfer();
        let file = new File([blob], "protected.jpg", { type: "image/jpeg" });
        dataTransfer.items.add(file);

        event.target.files = dataTransfer.files;

        // Create and dispatch a new event
        //document.removeEventListener("change", listener_function, { capture: true });
        const newEvent = new Event("change", { bubbles: true });
        newEvent.isCustomEvent = true;
        event.target.dispatchEvent(newEvent);
      }
    });
  };
}

function sendMessageToBackground(eventName, mediaUrl) {
  chrome.runtime.sendMessage({
    from: "content",
    subject: eventName,
    mediaUrl: mediaUrl,
    left: window.screenLeft + window.outerWidth,
    top: window.screenTop,
  });
}
