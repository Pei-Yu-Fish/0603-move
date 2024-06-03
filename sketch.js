/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet

*/

let video, bodypose, pose, keypoint, detector;
let poses = [];
let t=0 //控動移動速度

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
  t+=0.1;
  if(t>1){t=0;} //重設T以循環
}

function drawSkeleton() {
  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];

    //eye
    let partA = pose.keypoints[1]; //取眼睛的位置
    let partB = pose.keypoints[2];
    
    if(partA.score > 0.1 && partB.score > 0.1){  //鏡頭抓取眼睛
      
      let eyeX = lerp(partA.x , partB.x,t);  // 計算兩眼之間的距離和移動速度
      
      push() 
      imageMode(CENTER);
      image(inup,eyeX,partA.y-25,inup.width,inup.height)
      pop()
    }


    //wrist
    let partC = pose.keypoints[9];
    let partD = pose.keypoints[10];
    if(partC.score > 0.1 && partD.score > 0.1){
      let wristX = lerp(partC.x , partD.x,t);
      push()
      imageMode(CENTER);
      image(inup,wristX,partC.y,inup.width,inup.height)
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
