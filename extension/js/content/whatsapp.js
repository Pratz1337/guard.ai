document.addEventListener(
  "change",
  async function listener(event) {
    if (event.isCustomEvent) return;
    let consent = document.getElementById("consent");
    if (consent && !consent.checked) return;
    if (event?.target?.files[0]?.type?.split("/")[0] != "image") return;
    if (
      event.target.parentElement.className ==
      "x1c4vz4f xs83m0k xdl72j9 x1g77sc7 x78zum5 xozqiw3 x1oa3qoh x12fk4p8 xeuugli x2lwn1j x1nhvcw1 x1q0g3np x6s0dn4 x1ypdohk x1vqgdyp x1i64zmx x1gja9t"
    ) {
      event.stopPropagation();
      await handleProtection(event, listener);
    }
  },
  true
);

document.body.addEventListener("click", async (event) => {
  if (event.target.id.startsWith("button-whatsapp-audio")) {
    console.log("send audio to https://ubiquitous-cod-9g575xr4x7gc764g-5000.app.github.dev/detect_audio");
  } else if (event.target.id.startsWith("button-whatsapp-common")) {
    let fileType = "video/mp4";
    const previewOverlay = document.querySelector(".overlay._alhn");
    let src = previewOverlay.querySelector("video")?.src;
    if (!src) {
      //incase the modal was for an image and not a video, use the image
      img = document.getElementsByClassName(
        "x6s0dn4 x78zum5 x5yr21d xl56j7k x6ikm8r x10wlt62 x1n2onr6 xh8yej3 xhtitgo _ao3e"
      )[0];
      src = img?.src;
      fileType = "image/jpeg";
    }
    if (!src) return;

    const blob = await getBlobFromURL(src);
    console.log(blob);
    const dataURL = await getDataURL(blob);
    sendMessageToBackground("detectionRequest", dataURL);
  }
});

function appendDetectButtonInto(elementId) {
  let targetElements = document.getElementsByClassName(elementId);
  if (targetElements.length == 0) return;
  for (var i = 0; i < targetElements.length; i++) {
    let buttonEl = document.createElement("img");
    buttonEl.className = "verify-image-button";
    if (elementId == "x9f619 xyqdw3p x10ogl3i xg8j3zb x1k2j06m x1n2onr6") buttonEl.id = `button-whatsapp-image`;
    else if (elementId == "_ak4r") {
      buttonEl.id = `button-whatsapp-audio`;
      buttonEl.className = "verify-audio-button";
    } else if (elementId == "_ajv3 _ajv1") {
      buttonEl.id = `button-whatsapp-common`;
      buttonEl.className = "verify-video-button-whatsapp";
    }
    buttonEl.src = "https://iili.io/dH9heJs.png";

    //whastapp video (and images now on the topbar of the modal)
    if (!targetElements[i]?.querySelector("#button-whatsapp-common") && targetElements[i]?.className == "_ajv3 _ajv1") {
      targetElements[i]?.insertBefore(buttonEl, targetElements[i]?.children[0]);
    }
  }
}

function appendConsentButtonInto(elementId) {
  let parentElement = document.getElementsByClassName(elementId)[0];
  if (!parentElement) return;
  var targetParentElement = parentElement.children[0].children[0];
  if (
    (!document.getElementById("consent") && targetParentElement.children.length == 7) ||
    targetParentElement.children.length == 6
  ) {
    var container = document.createElement("div");
    container.className = "consent-container-whatsapp";
    var button = document.createElement("input");
    button.type = "checkbox";
    button.id = "consent";
    button.className = "consent-button";
    container.appendChild(button);
    var label = document.createElement("label");
    label.htmlFor = "consent";
    label.appendChild(document.createTextNode("Enable image protection"));
    label.className = "consent-label";
    container.appendChild(label);
    targetParentElement.insertBefore(container, targetParentElement.children[2]);
  }
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

const observer = new MutationObserver(function () {
  appendDetectButtonInto("_ak4r");

  //video
  appendDetectButtonInto("_ajv3 _ajv1");

  appendConsentButtonInto("_ak4w xacj9c0 xfh8nwu xoqspk4 x12v9rci x138vmkv");
});
// Register the element root you want to look for changes
observer.observe(document, {
  subtree: true,
  attributes: true,
});
