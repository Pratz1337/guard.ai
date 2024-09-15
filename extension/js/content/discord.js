document.addEventListener(
  "change",
  async function listener(event) {
    if (event.isCustomEvent) return;
    let consent = document.getElementById("consent");
    if (consent && !consent.checked) return;
    if (event?.target?.files[0]?.type?.split("/")[0] != "image") return;
    if (event.target.className == "file-input") {
      event.stopPropagation();
      await handleProtection(event, listener);
    }
  },
  true
);

document.body.addEventListener("click", async (event) => {
  if (event.target.id.startsWith("button-discord-video")) {
    const src = event.target.parentElement.querySelector("video").src;
    if (!src) {
      console.log("No video source found");
      return;
    }
    console.log(src);
    sendMessageToBackground("detectionRequest", src);
  } else if (event.target.id.startsWith("button-discord-image")) {
    const src = event.target.parentElement.querySelector("img:not(.verify-image-button-discord)").src;
    if (!src) {
      console.log("No image source found");
      return;
    }
    console.log(src);
    sendMessageToBackground("detectionRequest", src);
  }
});

function appendDetectButtonInto(elementId) {
  let targetElements = document.getElementsByClassName(elementId);
  if (targetElements.length == 0) return;
  for (let i = 0; i < targetElements.length; i++) {
    let targetElem = targetElements[i];

    let buttonEl = document.createElement("img");
    buttonEl.className = "verify-image-button";
    buttonEl.src = "https://iili.io/dH9heJs.png";

    if (targetElem.querySelector("video")) {
      buttonEl.id = `button-discord-video`;
      buttonEl.className = "verify-video-button-discord";

      if (!targetElem.querySelector("#button-discord-video")) {
        targetElem.appendChild(buttonEl);
      }
    } else if (targetElem.querySelector("img:not(.verify-image-button-discord):not(.imagePlaceholder_d4597d)")) {
      buttonEl.id = `button-discord-image`;
      buttonEl.className = "verify-image-button-discord";

      if (!targetElem.querySelector("#button-discord-image")) {
        targetElem.insertBefore(buttonEl, targetElem.children[0]);
      }
    }
  }
}

function appendConsentButtonInto(elementId) {
  let targetParentElement = document.getElementsByClassName(elementId)[0];
  if (!targetParentElement) return;
  if (!document.getElementById("consent") && targetParentElement.children.length == 4) {
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
    targetParentElement.insertBefore(container, targetParentElement.children[1]);
  }
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

const observer = new MutationObserver(function () {
  appendConsentButtonInto("scroller_d90b3d thin_c49869 scrollerBase_c49869");

  appendDetectButtonInto(
    "mosaicItem_e5c1dc mosaicItemNoJustify_e5c1dc mosaicItemMediaMosaic_e5c1dc hideOverflow_e5c1dc"
  );
});

observer.observe(document, {
  subtree: true,
  attributes: true,
});
