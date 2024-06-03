/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet

*/

let video, bodypose, pose, keypoint, detector;
let poses = [];
let moveX = 0; //用來控制圖片水平移動的距離
let speed = 3; //控制圖片移動速度

var inup
function preload(){
  inup = loadImage("upload_9eba0692c05fbceb38024e09280b0be4.gif");
}


async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    });
  }
  requestAnimationFrame(getPoses);
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  await init();

  stroke(255);
  strokeWeight(5);
  
}

function draw() {
  image(video, 0, 0);
  drawSkeleton();
  // flip horizontal
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);
}

function drawSkeleton() {
  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];

    //eye
    let partA = pose.keypoints[1]; //取眼睛的位置
    let partB = pose.keypoints[2];
    
    if(partA.score > 0.1 && partB.score > 0.1){  //鏡頭抓取眼睛
      
      let eyeX = (partA.x + partB.x) / 2;  // 眼睛中點的 x 坐標
      let eyeY = (partA.y + partB.y) / 2;  // 眼睛中點的 y 坐標
      
      moveX =moveX+ speed;
      if (moveX > (partB.x - partA.x) / 2 || moveX < -(partB.x - partA.x) / 2) {
        speed =speed*-1;  // 反彈
      }
      
      
      push() 
      imageMode(CENTER);
      image(inup,eyeX+moveX,eyeY-25,inup.width,inup.height)
      pop()
    }

  //   if(partB.score > 0.1){
  //     push()
  //     imageMode(CENTER);
  //     image(inup,partB.x+moveX,partB.y-25,inup.width,inup.height)
  //     pop()
  //  }
    //wrist
    partA = pose.keypoints[9];
    partB = pose.keypoints[10];
    if(partA.score > 0.1){
      push()
      imageMode(CENTER);
      image(inup,partA.x,partA.y,inup.width,inup.height)
      pop()
    }

    if(partB.score > 0.1){
      push()
      imageMode(CENTER);
      image(inup,partB.x,partB.y,inup.width,inup.height)
      pop()
   }

   //text
   partA = pose.keypoints[2];
   if(partA.score > 0.1){
    push()
    scale(-1, 1); 
    textSize(50)
    fill("#960018")
    stroke("#fff321")
    strokeWeight(3)
    text("412730284 王沛瑜",partA.x-width,partA.y-100)
    pop()
  }


  }


  
}

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left kneee
  14 right knee
  15 left foot
  16 right foot
*/
