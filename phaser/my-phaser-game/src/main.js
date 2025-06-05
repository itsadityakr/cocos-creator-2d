const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 600,
  backgroundColor: '#78C7F1',
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let traceMask, maskImage, slider, tracingProgress = 0;
let isDragging = false;

function preload() {
  this.load.image('b_base', 'assets/b_base.png');     // outline
  this.load.image('b_trace', 'assets/b_trace.png');   // fill
  this.load.image('slider', 'assets/start_icon.png');
  this.load.image('star', 'assets/star.png');
}

function create() {
  const centerX = this.cameras.main.centerX;
  const centerY = this.cameras.main.centerY;

  // Base outline
  this.add.image(centerX, centerY, 'b_base').setScale(1.2);

  // Trace mask image
  const traced = this.add.image(centerX, centerY, 'b_trace').setScale(1.2);
  traceMask = this.add.graphics();
  maskImage = traced.setMask(new Phaser.Display.Masks.GeometryMask(this, traceMask));

  // Slider (draggable circle)
  slider = this.add.image(centerX, centerY - 120, 'slider').setInteractive();
  this.input.setDraggable(slider);

  // Stars at start and end
  this.add.image(centerX, centerY - 120, 'star').setScale(0.7);
  this.add.image(centerX + 40, centerY + 70, 'star').setScale(0.7);

  // Dragging behavior
  this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    if (gameObject === slider) {
      const dy = dragY - (centerY - 120);
      if (dy >= 0 && dy <= 180) {
        gameObject.y = centerY - 120 + dy;
        tracingProgress = dy / 180;
      }
    }
  });

  // Drag end: check if completed
  this.input.on('dragend', () => {
    if (tracingProgress >= 0.95) {
      showSparkleEffect.call(this);
    }
  });
}

function update() {
  // Draw mask based on progress
  if (traceMask) {
    traceMask.clear();
    traceMask.fillStyle(0xffffff);
    traceMask.fillRect(120, 180, 260, 350 * tracingProgress); // Adjust to match your image
  }
}

// Sparkle animation placeholder
function showSparkleEffect() {
  const sparkle = this.add.text(180, 520, '✓ Done!', {
    fontSize: '32px',
    color: '#fff',
    backgroundColor: '#00cc00',
    padding: { x: 10, y: 5 }
  });
  this.tweens.add({
    targets: sparkle,
    alpha: 0,
    y: sparkle.y - 50,
    duration: 1000,
    ease: 'Power2',
    onComplete: () => sparkle.destroy()
  });
}
