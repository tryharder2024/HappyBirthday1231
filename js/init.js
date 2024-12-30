// 扩展 FireworkApp 对象
Object.assign(window.FireworkApp, {
    // Global variables
    fontSize: 200,
    rockets: [],
    shards: [],
    targets: [],
    fidelity: 3,
    counter: 0,
    textAlpha: 0,
    textVisible: false,
    visiblePoints: [],
    textPoints: [],
    textWidth: 99999999,
    c1: null,
    c2: null,
    c3: null,
    ctx1: null,
    ctx2: null,
    ctx3: null,
    
    // Initialize function
    init() {
        // Canvas initialization
        [this.c1, this.c2, this.c3] = document.querySelectorAll('canvas');
        [this.ctx1, this.ctx2, this.ctx3] = [this.c1, this.c2, this.c3].map(c => c.getContext('2d'));
        
        this.initCanvas();
        // 绑定 animate 方法的 this 上下文
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    },
    
    initCanvas() {
        this.c2.width = this.c3.width = window.innerWidth;
        this.c2.height = this.c3.height = window.innerHeight;
        
        // Text setup
        const text = '头姐,生日快乐呀！';
        this.ctx1.fillStyle = '#000';
        
        while (this.textWidth > window.innerWidth) {
            this.ctx1.font = `900 ${this.fontSize--}px Arial`;
            this.textWidth = this.ctx1.measureText(text).width;
        }
        
        this.c1.width = this.textWidth;
        this.c1.height = this.fontSize * 1.5;
        this.ctx1.font = `900 ${this.fontSize}px Arial`;
        this.ctx1.fillStyle = '#000';
        this.ctx1.fillText(text, 0, this.fontSize);
        
        this.setupTextPoints();
    },
    
    setupTextPoints() {
        const imgData = this.ctx1.getImageData(0, 0, this.c1.width, this.c1.height);
        for (let i = 0, max = imgData.data.length; i < max; i += 4) {
            const alpha = imgData.data[i + 3];
            const x = Math.floor(i / 4) % imgData.width;
            const y = Math.floor(i / 4 / imgData.width);

            if (alpha && x % this.fidelity === 0 && y % this.fidelity === 0) {
                this.targets.push({ x, y });
                this.textPoints.push({
                    x: x + this.c2.width / 2 - this.textWidth / 2,
                    y: y + this.c2.height / 2 - this.fontSize / 2
                });
            }
        }
    },

    // Animation loop
    animate() {
        this.ctx2.fillStyle = "rgba(0, 0, 0, .2)";
        this.ctx2.fillRect(0, 0, this.c2.width, this.c2.height);
        
        this.counter += 1;

        if (this.counter % 12 === 0) {
            this.rockets.push(new FireworkApp.Rocket());
        }
        
        this.rockets.forEach((r, i) => {
            r.draw();
            r.update();
            if (r.ySpeed > 0) {
                r.explode();
                this.rockets.splice(i, 1);
                this.textVisible = true;
            }
        });

        this.shards.forEach((s, i) => {
            s.draw();
            s.update();
            if (s.timer >= s.ttl || s.lightness >= 99) {
                this.shards.splice(i, 1);
            }
        });

        this.ctx2.save();
        this.ctx2.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.visiblePoints.forEach(point => {
            this.ctx2.beginPath();
            this.ctx2.arc(point.x, point.y, 1, 0, Math.PI * 2);
            this.ctx2.fill();
        });
        this.ctx2.restore();

        requestAnimationFrame(this.animate);
    },
});

// Initialize when the window loads
window.addEventListener('load', () => {
    FireworkApp.init();
}); 