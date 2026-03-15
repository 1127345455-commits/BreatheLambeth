/**
 * Breathe Lambeth - Wisteria "Website Edition"
 * 调整：极小幅度的呼吸式摆动，适配网页全屏尺寸
 */

let clusters = [];
let isOpen = false;
const clusterCount = 20

function setup() {
  // 设置为网页全屏尺寸
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < clusterCount; i++) {
    // 在网页顶部水平均匀分布
    let xPos = map(i, 0, clusterCount - 1, width * 0.1, width * 0.9);
    clusters.push(new WisteriaCluster(xPos));
  }
}

function draw() {
  background(255); // 网页通常使用纯白背景以保持简洁

  for (let c of clusters) {
    c.update();
    c.display();
  }
}

function mousePressed() {
  // 点击页面任何地方切换“拨开/垂下”状态
  isOpen = !isOpen;
}

class WisteriaCluster {
  constructor(x) {
    this.originX = x; 
    this.originY = -30; // 稍微藏在网页顶部边缘以上
    this.currentX = x;
    this.currentY = this.originY;
    
    // 适配网页高度，长度随机在屏幕的 40% 到 70% 之间
    this.len = random(height * 0.4, height * 0.7); 
    this.segments = 24; 
    this.offsetSeed = random(2000); 
    this.petalConfigs = [];
    
    this.initVisuals();
  }

  initVisuals() {
    for (let i = 0; i < this.segments; i++) {
      let progress = i / this.segments;
      let pCount = floor(map(progress, 0, 1, 6, 1)); 
      let layer = [];
      
      for (let j = 0; j < pCount; j++) {
        layer.push({
          relX: random(-25, 25) * map(progress, 0, 1, 1, 0.4),
          relY: random(-8, 8),
          size: random(15, 30) * map(progress, 0, 1, 1.1, 0.8),
          // 颜色采样自你的原图：柔和的薰衣草紫
          c: color(random(150, 180), random(140, 170), random(230, 255), 140),
          h: random(1) > 0.85
        });
      }
      this.petalConfigs.push(layer);
    }
  }

  update() {
    let targetX = this.originX;
    let targetY = this.originY;

    if (isOpen) {
      // 网页拉开逻辑：更大幅度地滑出屏幕两侧
      targetX = (this.originX < width / 2) ? -width * 0.5 : width * 1.5;
      targetY = -this.len * 0.7;
    }

    // 网页交互建议使用更平滑的 lerp 数值
    this.currentX = lerp(this.currentX, targetX, 0.035);
    this.currentY = lerp(this.currentY, targetY, 0.035);
  }

  display() {
    push();
    translate(this.currentX, this.currentY);
    
    // 【核心修改】摆动数值调小：
    // 0.015 是速度，0.06 是幅度（约正负 3 度），呈现极轻微的呼吸感
    let swingAngle = sin(frameCount * 0.015 + this.offsetSeed) * 0.06;
    rotate(swingAngle);

    // 绘制主枝干
    stroke(160, 210, 225, 100); 
    strokeWeight(1);
    noFill();
    
    beginShape();
    vertex(0, 0);
    for(let i = 1; i <= this.segments; i++) {
        let y = map(i, 0, this.segments, 0, this.len);
        // 枝干本身的扭动幅度也同步调小
        let x = sin(i * 0.15 + frameCount * 0.015) * 3; 
        vertex(x, y);
    }
    endShape();

    // 绘制花瓣与连接小枝
    noStroke();
    for (let i = 0; i < this.petalConfigs.length; i++) {
      let layer = this.petalConfigs[i];
      let yPos = map(i, 0, this.segments, 0, this.len);
      let stemX = sin(i * 0.15 + frameCount * 0.015) * 3;

      push();
      translate(stemX, yPos);
      
      for (let p of layer) {
        // 极细的连接线
        stroke(160, 210, 225, 60);
        strokeWeight(0.5);
        line(0, 0, p.relX * 0.5, p.relY * 0.5);
        
        noStroke();
        fill(p.c);
        ellipse(p.relX, p.relY, p.size, p.size * 0.85);
        
        if (p.h) {
          fill(255, 255, 255, 80);
          ellipse(p.relX - p.size*0.15, p.relY - p.size*0.15, p.size * 0.3);
        }
      }
      pop();
    }
    pop();
  }
}

// 确保浏览器窗口大小改变时，画布自动适配
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}