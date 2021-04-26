let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = 500;
let height = 500;

//load background image
let loadBackground = () => {
    document.body.style.backgroundImage = "url('./images/background.jpg')";
    document.body.style.backgroundSize = "100vw 100vh";
}

let loadImage = (src, callback) => {
    let img = document.createElement("img");
    img.onload = () => callback(img);
    img.src = src;
}

let imagePath = (frameNumber, animation) => {
    return "/images/" + animation + "/" + frameNumber + ".png";
}

//all frames of game
let frames = {
    idle: [1, 2, 3, 4, 5, 6, 7, 8],
    kick: [1, 2, 3, 4, 5, 6, 7],
    punch: [1, 2, 3, 4, 5, 6, 7],
    backward: [1, 2, 3, 4, 5, 6],
    forward: [1, 2, 3, 4, 5, 6],
    block: [1, 2, 3, 4, 5, 6, 7, 8, 9]
}

//load images
let loadImages = (callback) => {
    let images = {
        idle: [],
        kick: [],
        punch: [],
        backward: [],
        forward: [],
        block: []
    }
    let imagesToLoad = 0;

    ["idle", "kick", "punch", "backward", "forward", "block"].forEach((animation) => {
        let animationFrames = frames[animation];
        imagesToLoad = imagesToLoad + animationFrames.length;

        animationFrames.forEach((frameNumber) => {
            let path = imagePath(frameNumber, animation);

            loadImage(path, (image) => {
                images[animation][frameNumber - 1] = image;
                imagesToLoad = imagesToLoad - 1;

                if (imagesToLoad === 0) {
                    callback(images);
                }
            })
        })
    })
}

let animate = (ct, images, animation, callback) => {
    images[animation].forEach((image, index) => {
        setTimeout(() => {
            ct.clearRect(0, 0, width, height);
            ct.drawImage(image, 0, 0, width, height);
        }, index * 100);
    })
    setTimeout(callback, images[animation].length * 100);
}

loadImages((images) => {
    let queueAnimation = [];

    let aux = () => {
        let selectedAnimation;
        if (queueAnimation.length === 0) {
            selectedAnimation = "idle";
        } else {
            selectedAnimation = queueAnimation.shift();
        }
        animate(ctx, images, selectedAnimation, aux);
    }

    document.getElementById("kick").onclick = () => {
        queueAnimation.push("kick");
    }

    document.getElementById("punch").onclick = () => {
        queueAnimation.push("punch");
    }

    document.getElementById("backward").onclick = () => {
        queueAnimation.push("backward");
    }

    document.getElementById("forward").onclick = () => {
        queueAnimation.push("forward");
    }


    document.addEventListener("keyup", (event) => {
        const key = event.key;
        switch (key) {
            case "ArrowLeft":
                queueAnimation.push("backward");
                break;
            case "ArrowRight":
                queueAnimation.push("forward");
                break;
            case "ArrowUp":
                queueAnimation.push("kick");
                break;
            case "ArrowDown":
                queueAnimation.push("punch");
                break;
        }
    })

    aux();
})