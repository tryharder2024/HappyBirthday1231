// Add classes to our namespace
window.FireworkApp.Shard = class Shard {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.lightness = 50;
        this.size = 15 + Math.random() * 10;
        const angle = Math.random() * 2 * Math.PI;
        const blastSpeed = 1 + Math.random() * 6;
        this.xSpeed = Math.cos(angle) * blastSpeed;
        this.ySpeed = Math.sin(angle) * blastSpeed;
        this.target = FireworkApp.getTarget();
        this.ttl = 100;
        this.timer = 0;
        this.glow = 4 + Math.random() * 10;
    }

    draw() {
        const app = FireworkApp;
        app.ctx2.fillStyle = `hsl(${this.hue}, 100%, ${this.lightness}%)`;
        app.ctx2.beginPath();
        app.ctx2.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        app.ctx2.closePath();
        app.ctx2.fill();
    }

    update() {
        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const a = Math.atan2(dy, dx);
            const tx = Math.cos(a) * 5;
            const ty = Math.sin(a) * 5;
            this.size = FireworkApp.lerp(this.size, 1.5, 0.05);

            if (dist < 5) {
                this.lightness = FireworkApp.lerp(this.lightness, 100, 0.01);
                this.xSpeed = this.ySpeed = 0;
                this.x = FireworkApp.lerp(this.x, this.target.x + FireworkApp.fidelity / 2, 0.05);
                this.y = FireworkApp.lerp(this.y, this.target.y + FireworkApp.fidelity / 2, 0.05);
                this.timer += 1;
                if (!FireworkApp.visiblePoints.includes(this.target)) {
                    FireworkApp.visiblePoints.push(this.target);
                }
            } else if (dist < 10) {
                this.lightness = FireworkApp.lerp(this.lightness, 100, 0.01);
                this.xSpeed = FireworkApp.lerp(this.xSpeed, tx, 0.1);
                this.ySpeed = FireworkApp.lerp(this.ySpeed, ty, 0.1);
                this.timer += 1;
            } else {
                this.xSpeed = FireworkApp.lerp(this.xSpeed, tx, 0.02);
                this.ySpeed = FireworkApp.lerp(this.ySpeed, ty, 0.02);
            }
        } else {
            this.ySpeed += 0.05;
            this.size = FireworkApp.lerp(this.size, 1, 0.05);
            this.lightness = FireworkApp.lerp(this.lightness, 0, 0.01);

            if (this.y > FireworkApp.c2.height) {
                FireworkApp.shards.forEach((shard, idx) => {
                    if (shard === this) {
                        FireworkApp.shards.splice(idx, 1);
                    }
                });
            }
        }
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
    }
};

window.FireworkApp.Rocket = class Rocket {
    constructor() {
        const quarterW = FireworkApp.c2.width / 4;
        this.x = quarterW + Math.random() * (FireworkApp.c2.width - quarterW);
        this.y = FireworkApp.c2.height - 15;
        this.angle = Math.random() * Math.PI / 6 - Math.PI / 12;
        this.blastSpeed = 8 + Math.random() * 7;
        this.shardCount = 15 + Math.floor(Math.random() * 15);
        this.xSpeed = Math.sin(this.angle) * this.blastSpeed;
        this.ySpeed = -Math.cos(this.angle) * this.blastSpeed;
        this.hue = Math.floor(Math.random() * 360);
        this.trail = [];
        const launch = document.getElementById('launchSound');
        launch.volume = 0.4;
        launch.currentTime = 0;
        launch.play().catch(e => console.log('Launch sound failed:', e));
    }

    draw() {
        FireworkApp.ctx2.save();
        FireworkApp.ctx2.translate(this.x, this.y);
        FireworkApp.ctx2.rotate(Math.atan2(this.ySpeed, this.xSpeed) + Math.PI / 2);
        FireworkApp.ctx2.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        FireworkApp.ctx2.fillRect(0, 0, 5, 15);
        FireworkApp.ctx2.restore();
    }

    update() {
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
        this.ySpeed += 0.09;
    }

    explode() {
        for (let i = 0; i < 70; i++) {
            FireworkApp.shards.push(new FireworkApp.Shard(this.x, this.y, this.hue));
        }
    }
};

// Helper functions
window.FireworkApp.lerp = (a, b, t) => Math.abs(b - a) > 0.1 ? a + t * (b - a) : b;

FireworkApp.getTarget = function() {
    if (this.targets.length > 0 && this.textVisible) {
        const idx = Math.floor(Math.random() * this.targets.length);
        let { x, y } = this.targets[idx];
        this.targets.splice(idx, 1);

        x += this.c2.width / 2 - this.textWidth / 2;
        y += this.c2.height / 2 - this.fontSize / 2;

        return { x, y };
    }
    return null;
}; 