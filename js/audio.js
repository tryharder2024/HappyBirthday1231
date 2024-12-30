// 使用更激进的自动播放策略
window.FireworkApp.Audio = {
    async initAudio() {
        const bgMusic = document.getElementById('bgMusic');
        const launchSound = document.getElementById('launchSound');
        
        try {
            // 创建音频上下文
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 尝试恢复音频上下文
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            
            // 设置并播放背景音乐（烟花爆炸声）
            bgMusic.muted = false;
            bgMusic.volume = 0.9;
            bgMusic.currentTime = 0;
            await bgMusic.play();
            
            // 解除发射音效的静音
            launchSound.muted = false;
            
        } catch (error) {
            console.log('Auto-play failed, trying alternative method');
            
            // 如果自动播放失败，尝试模拟用户交互
            const simulateClick = () => {
                bgMusic.muted = false;
                bgMusic.volume = 0.9;
                bgMusic.currentTime = 0;
                bgMusic.play();
                launchSound.muted = false;
            };
            
            // 监听多个可能的用户交互事件
            ['click', 'touchstart', 'keydown'].forEach(event => {
                document.addEventListener(event, simulateClick, { once: true });
            });
            
            // 尝试在页面加载后立即触发
            setTimeout(simulateClick, 100);
        }
    },
    
    showPlayHint() {
        const hint = document.getElementById('autoPlayHint');
        hint.style.display = 'block';
        hint.onclick = function() {
            this.style.display = 'none';
            const bgMusic = document.getElementById('bgMusic');
            bgMusic.muted = false;
            bgMusic.volume = 0.6;
            bgMusic.currentTime = 0;
            bgMusic.play();
            document.getElementById('launchSound').muted = false;
            document.getElementById('explosionSound').muted = false;
        };
    }
};

// 在 DOMContentLoaded 和 load 事件上都尝试初始化
['DOMContentLoaded', 'load'].forEach(event => {
    window.addEventListener(event, window.FireworkApp.Audio.initAudio);
}); 