"use client";
import React, { useEffect, useRef } from "react";

const Particles = () => {
  const canvasElementRef = useRef(null);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasElementRef.current;
    const canvasContainer = canvasContainerRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    class Particle {
      constructor(x, y) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 20 + 1; // Decreased density range
        this.size = Math.random() * 5 + 3;
        this.color = `rgba(${Math.random() > 0.5 ? '148,0,211' : '147,112,219'}, 0.3)`;
        this.startConvergence = false;
        setTimeout(() => (this.startConvergence = true), 100);
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        let canvasRect = canvas.getBoundingClientRect();
        let mouseDisturbed = false;

        if (
          mouseX > canvasRect.left &&
          mouseX < canvasRect.right &&
          mouseY > canvasRect.top &&
          mouseY < canvasRect.bottom
        ) {
          let dx = mouseX - canvasRect.left - this.x;
          let dy = mouseY - canvasRect.top - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = 100;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * this.density * 0.6;
          let directionY = forceDirectionY * force * this.density * 0.6;

          if (distance < maxDistance) {
            this.x -= directionX;
            this.y -= directionY;
            mouseDisturbed = true;
          }
        }

        if (!mouseDisturbed && this.startConvergence) {
          if (this.x !== this.baseX) {
            let dxBase = this.x - this.baseX;
            this.x -= dxBase / 20;
          }
          if (this.y !== this.baseY) {
            let dyBase = this.y - this.baseY;
            this.y -= dyBase / 20;
          }
        }

        const randomX = (Math.random() - 0.5) * 0.3;
        const randomY = (Math.random() - 0.5) * 0.3;
        this.x += randomX;
        this.y += randomY;
      }
    }

    function init(img) {
      particles = [];
      const imgCanvas = document.createElement("canvas");
      const imgCtx = imgCanvas.getContext("2d");
      imgCanvas.width = canvas.width;
      imgCanvas.height = canvas.height;
      const scale = 2; // Increased scale to make the image larger
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (imgCanvas.width - scaledWidth) / 2;
      const offsetY = (imgCanvas.height - scaledHeight) / 2;
      imgCtx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      const imageData = imgCtx.getImageData(
        0,
        0,
        imgCanvas.width,
        imgCanvas.height
      );
      const data = imageData.data;

      const stepSize = 5;
      const skipProbability = 0.1; // Decreased skip probability to create more particles

      for (let y = 0; y < canvas.height; y += stepSize) {
        for (let x = 0; x < canvas.width; x += stepSize) {
          if (Math.random() > skipProbability) {
            if (data[y * 4 * canvas.width + x * 4 + 3] > 128) {
              let positionX = x;
              let positionY = y;
              particles.push(new Particle(positionX, positionY));
            }
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    }

    function loadImage(url) {
      const img = new Image();
      img.crossOrigin = "";
      img.src = url;
      img.onload = () => {
        init(img);
        animate();
      };
    }

    window.addEventListener("resize", function () {
      canvas.width = canvasContainer.clientWidth;
      canvas.height = canvasContainer.clientHeight;
      loadImage(
        "https://media.discordapp.net/attachments/979277341723332638/1284095311777890326/image-removebg-preview_1.png?ex=66e56273&is=66e410f3&hm=76c44db76b783c609b4d3511418699d0319e8c4d4816a3a7a681e31e9da11f78&=&format=webp&quality=lossless&width=287&height=278"
      );
    });

    window.addEventListener("mousemove", function (event) {
      mouseX = event.x;
      mouseY = event.y;
    });

    loadImage(
      "https://media.discordapp.net/attachments/979277341723332638/1284095311777890326/image-removebg-preview_1.png?ex=66e56273&is=66e410f3&hm=76c44db76b783c609b4d3511418699d0319e8c4d4816a3a7a681e31e9da11f78&=&format=webp&quality=lossless&width=287&height=278"
    );
  }, []);

  return (
    <div ref={canvasContainerRef} className="h-screen w-full">
      <canvas ref={canvasElementRef}></canvas>
    </div>
  );
};

export default Particles;