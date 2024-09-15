chrome.runtime.onMessage.addListener((msg) => {
	const fromFilter = ["background"];
	if (!fromFilter.includes(msg.from)) return;

	let popupImage = document.getElementsByClassName("popup-image-selected")[0];
	let resultSpan = document.getElementsByClassName("popup-result")[0];
	if (!resultSpan) {
		resultSpan = document.createElement("span");
		resultSpan.className = "popup-result";
		document.getElementsByClassName("popup-body")[0].appendChild(resultSpan);
	}

	if (msg.subject === "dataForPopup") {
		if (msg.data.mediaType?.includes("video")) {
			generateVideoThumbnail(msg.data.mediaUrl).then((thumbnail) => {
				popupImage.src = thumbnail;
			});
		} else popupImage.src = msg.data.mediaUrl;

		if (msg.popupType == "result") {
			resultSpan.innerHTML = msg.data.result;
		} else if (msg.popupType == "loader") {
			resultSpan.innerHTML = msg.data.text;
		} else if (msg.popupType == "fileDownloadPopup") {
			resultSpan.innerHTML = "Download file";
			const link = document.createElement("a");
			link.href = msg.data.mediaUrl;
			link.setAttribute("download", msg.data.fileName);
			document.body.appendChild(link);
			link.click();
			resultSpan.innerHTML += " You may close this popup now."
		}
	} else if (msg.subject === "closePopup") {
		window.close();
	}
});

const generateVideoThumbnail = (src) => {
	return new Promise((resolve) => {
		const canvas = document.createElement("canvas");
		const video = document.createElement("video");

		// this is important
		video.autoplay = true;
		video.muted = true;
		video.src = src;

		video.onloadeddata = () => {
			let ctx = canvas.getContext("2d");

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
			video.pause();
			return resolve(canvas.toDataURL("image/png"));
		};
	});
};
