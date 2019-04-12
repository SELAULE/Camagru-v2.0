window.onload = function()
{
	let width = 500,
		height = 0,
		streaming = false;

	video = document.getElementById('video');
	const canvas1 = document.getElementById('canvas');
	const canvas2 = document.getElementById('canvas2');
	const photo_button = document.getElementById('photo_button');
	const save_photo = document.getElementById('save_photo');
	const fileToUpload = document.getElementById('fileToUpload');

	navigator.mediaDevices.getUserMedia({video: true, audio: false})

	.then((stream) => {
		video.srcObject = stream;
		video.play();
	})

	.catch((err) => {
		console.log(`Error: ${err}`);
	});

	video.addEventListener('canplay', (e) => {
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth / width);
			video.setAttribute('width',width);
			video.setAttribute('height',height);
			canvas.setAttribute('width',width);
			canvas.setAttribute('height',height);
			streaming = true;
		}
	}, false);

	fileToUpload.addEventListener('click', (ev) => {

		uploadspot = document.getElementById('uploadspot');
		uploadspot.click();
		uploadspot.addEventListener('change', () => {
			
			if (uploadspot.files && uploadspot.files[0]) {
				var reader = new FileReader()
				reader.onload = (e) => {
					document.getElementById('image_upload').setAttribute('src', e.target.result);
					document.getElementById('image_upload').style.display = 'block';
					document.getElementById('video').style.display = 'none';
					video = document.getElementById('image_upload');
				}
				reader.readAsDataURL(uploadspot.files[0]);
			}
			console.log(uploadspot.files);
		})

	})

	photo_button.addEventListener('click', (e) =>
	{
		document.getElementById("save_photo").style.visibility = "visible";
		document.getElementById("canvas").style.display = "block";
		takepicture();
		preview();
		e.preventDefault()
	}, false);

	save_photo.addEventListener('click', (e) =>
	{
		savepic();
		e.preventDefault();
	}, false);
	canvas.addEventListener('click', (e) =>
	{
		document.getElementById("canvas").style.display = "none";
		document.getElementById("save_photo").style.visibility = "hidden";
		e.preventDefault();
	}, false);


	function takepicture()
	{
		const context1 = canvas1.getContext('2d');

		if (width && height) {
			canvas1.width = width;
			canvas1.height = height;
			context1.drawImage(video, 0, 0, width, height);
			
		}
	}
	function preview()
	{
		const context = canvas.getContext('2d');
		if (width && height) {
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video, 0, 0, width, height);
			if (document.getElementById("emoji1").hasAttribute("src")) {
				var emoji1 = document.getElementById("emoji1");
				var left = parseInt(emoji1.style.left);
				var top = parseInt(emoji1.style.top);
				context.drawImage(emoji1,left,top,100,100);
			}
			if (document.getElementById("emoji2").hasAttribute("src")) {
				var emoji2 = document.getElementById("emoji2");
				var left2 = parseInt(emoji2.style.left);
				var top2 = parseInt(emoji2.style.top);
				context.drawImage(emoji2,left2,top2,100,100);
			}
		}
	}

	function savepic()
	{
		var dataURL = canvas.toDataURL();
		var	emoji = document.getElementById("emoji1").src;
		const form = document.createElement('form');
		form.action = '/cam';
		form.method = 'post';
		const myogimage = document.createElement('input');
		const myoverlay = document.createElement('input');
		myogimage.type = 'hidden';
		myogimage.name = 'img64';
		myogimage.value = dataURL;
		myoverlay.type = 'hidden';
		myoverlay.name = 'emoji64';
		myoverlay.value = emoji;
		if (document.getElementById("emoji2").hasAttribute("src"))
		{
			var	emoji2 = document.getElementById("emoji2").src;
			const myoverlay2 = document.createElement('input');
			myoverlay2.type = 'hidden';
			myoverlay2.name = 'emoji64_2';
			myoverlay2.value = emoji2;
			form.appendChild(myoverlay2);
		}
		form.appendChild(myogimage);
		form.appendChild(myoverlay);
		document.body.appendChild(form);
		form.submit();
	}

}