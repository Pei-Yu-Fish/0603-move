/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet

*/

let video, detector;
let poses = [];
let eyeImages = [];
let inup;

let eyeOffset = 0;
let eyeDirection = 1;
const eyeSpeed = 2;

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

  // 更新眼睛图片的位置
  eyeOffset += eyeSpeed * eyeDirection;
  if (eyeOffset > 10 || eyeOffset < -10) {
    eyeDirection *= -1;
  }
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    
    // 左眼
    let leftEye = pose.keypoints[1];
    // 右眼
    let rightEye = pose.keypoints[2];
    
    if (leftEye.score > 0.1) {
      push();
      imageMode(CENTER);
      image(inup, leftEye.x + eyeOffset, leftEye.y, inup.width, inup.height);
      pop();
    }
    
    if (rightEye.score > 0.1) {
      push();
      imageMode(CENTER);
      image(inup, rightEye.x + eyeOffset, rightEye.y, inup.width, inup.height);
      pop();
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
