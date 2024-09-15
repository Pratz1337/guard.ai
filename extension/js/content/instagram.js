//function that calls protection api and replaces the image with the protected image
//Event listener to listen for changes in the DOM and call the protection api for file uploads
document.addEventListener(
  "change",
  async function hack(event) {
    if (event.isCustomEvent) return;
    let consent = document.getElementById("consent");
    if (consent && !consent.checked) return;

    if (event.target.className.includes("_ac69")) {
      if (event.target.files[0].type?.split("/")[0] != "image") return;
      event.stopPropagation();
      await handleProtection(event, hack);
    }
  },
  true
);

document.body.addEventListener("click", async (event) => {
  if (event.target.id.startsWith("button-insta-image")) {
    value = event.target.parentElement?.children[0]?.children[0]?.children[0]?.children[0]?.src;
    if (!value) return;
    let file = await getFileFromURL(value);
    file = await getDataURL(file);
    sendMessageToBackground("detectionRequest", file, "image/jpeg");
  } else if (event.target.id.startsWith("button-insta-video")) {
    value = event.target.parentElement?.parentElement?.parentElement?.children[0]?.src;
    if (!value) return;
    sendMessageToBackground("detectionRequest", value, "video/mp4");
  }
});

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function (mutations, observer) {
  appendDetectButtonInto("_aagu");

  appendConsentButtonInto(
    "x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1p5oq8j xxbr6pl xwxc41k xbbxn1n x1n2onr6 x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x6s0dn4 x1oa3qoh xl56j7k"
  );

  //insta video
  appendDetectButtonInto("x5yr21d x10l6tqk x13vifvy xh8yej3");
});

observer.observe(document, {
  subtree: true,
  attributes: true,
});

//function to append the button to the image
function appendDetectButtonInto(elementId) {
  var targetElements = document.getElementsByClassName(elementId);
  if (targetElements.length == 0) return;
  for (var i = 0; i < targetElements.length; i++) {
    var buttonEl = document.createElement("img");
    buttonEl.className = "verify-image-button";
    if (elementId == "_aagu") buttonEl.id = `button-insta-image`;
    else if (elementId == "x5yr21d x10l6tqk x13vifvy xh8yej3") {
      buttonEl.id = `button-insta-video`;
      buttonEl.className = "verify-video-button";
    }
    buttonEl.src = "https://iili.io/dH9heJs.png";

    if (
      !targetElements[i]?.parentElement?.parentElement?.querySelector("#button-insta-image") &&
      elementId == "_aagu"
    ) {
      targetElements[i]?.parentElement?.parentElement?.appendChild(buttonEl);
    }

    //insta video
    if (
      targetElements[i]?.children?.length == 2 &&
      targetElements[i]?.children[0]?.className == "x5yr21d x19kjcj4 x6ikm8r x10wlt62 x1n2onr6 xh8yej3" &&
      elementId == "x5yr21d x10l6tqk x13vifvy xh8yej3"
    ) {
      targetElements[i]?.appendChild(buttonEl);
    }
  }
}

function appendConsentButtonInto(elementId) {
  var targetElement = document.getElementsByClassName(elementId)[0];
  if (!targetElement) return;
  if (!document.getElementById("consent")) {
    var container = document.createElement("div");
    container.className = "consent-container-insta";
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
    targetElement.appendChild(container);
  }
}
