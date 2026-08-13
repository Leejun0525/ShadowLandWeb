export class Boss {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.name = "Shadow King";

        // =========================
        // Boss 属性
        // =========================

        this.maxHp = 600;
        this.hp = 600;

        this.attack = 18;

        this.speed = 0.7;

        this.radius = 38;

        this.dead = false;

        // =========================
        // AI
        // =========================

        this.attackCooldown = 0;

        this.skillCooldown = 180;

        this.dashCooldown = 300;

        // =========================
        // 动画
        // =========================

        this.hitFlash = 0;

        this.attackAnimation = 0;

        this.phase = 1;

        // Boss 第二阶段
        this.enraged = false;
    }


    // ========================================
    // 更新 Boss
    // ========================================

    update(player) {

        if (this.dead) {
            return;
        }


        // ====================================
        // 第二阶段
        // ====================================

        if (
            this.hp <= this.maxHp * 0.5 &&
            !this.enraged
        ) {

            this.enraged = true;

            this.phase = 2;

            this.speed = 1.15;

            this.attack = 28;

            this.skillCooldown = 60;

            console.log(
                "🔥 SHADOW KING ENRAGED!"
            );
        }


        // ====================================
        // 计算玩家距离
        // ====================================

        const dx =
            player.x - this.x;

        const dy =
            player.y - this.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // ====================================
        // 追踪玩家
        // ====================================

        if (distance > 100) {

            this.x +=
                (dx / distance) *
                this.speed;

            this.y +=
                (dy / distance) *
                this.speed;
        }


        // ====================================
        // 普通攻击
        // ====================================

        if (
            distance <= 90 &&
            this.attackCooldown <= 0
        ) {

            player.takeDamage(
                this.attack
            );

            this.attackCooldown =
                this.enraged
                    ? 35
                    : 55;

            this.attackAnimation = 15;
        }


        // ====================================
        // 技能冷却
        // ====================================

        if (
            this.skillCooldown > 0
        ) {

            this.skillCooldown--;
        }


        // ====================================
        // Dash
        // ====================================

        if (
            this.dashCooldown > 0
        ) {

            this.dashCooldown--;
        }


        // ====================================
        // 攻击动画
        // ====================================

        if (
            this.attackAnimation > 0
        ) {

            this.attackAnimation--;
        }


        // ====================================
        // 受伤闪烁
        // ====================================

        if (
            this.hitFlash > 0
        ) {

            this.hitFlash--;
        }


        // ====================================
        // 无敌技能
        // ====================================

        if (
            distance < 280 &&
            this.skillCooldown <= 0
        ) {

            this.castDarkExplosion(
                player
            );

            this.skillCooldown =
                this.enraged
                    ? 100
                    : 180;
        }
    }


    // ========================================
    // Boss 范围技能
    // ========================================

    castDarkExplosion(player) {

        const dx =
            player.x - this.x;

        const dy =
            player.y - this.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // 范围攻击

        if (distance < 220) {

            const damage =
                this.enraged
                    ? 35
                    : 22;

            player.takeDamage(
                damage
            );

            console.log(
                "💥 Shadow Explosion!",
                damage
            );
        }
    }


    // ========================================
    // Boss 受到伤害
    // ========================================

    takeDamage(amount) {

        if (this.dead) {
            return;
        }


        this.hp -= amount;

        this.hitFlash = 8;


        if (this.hp <= 0) {

            this.hp = 0;

            this.dead = true;
        }
    }


    // ========================================
    // 绘制 Boss
    // ========================================

    draw(ctx) {

        if (this.dead) {
            return;
        }


        // ====================================
        // Boss 光环
        // ====================================

        ctx.save();


        ctx.globalAlpha =
            this.enraged
                ? 0.25
                : 0.15;


        ctx.fillStyle =
            this.enraged
                ? "#ff2d55"
                : "#8b5cf6";


        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.enraged
                ? 65
                : 55,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();


        // ====================================
        // 阴影
        // ====================================

        ctx.fillStyle =
            "rgba(0,0,0,0.5)";


        ctx.beginPath();

        ctx.ellipse(
            this.x,
            this.y + 42,
            45,
            14,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ====================================
        // Boss 身体
        // ====================================

        ctx.fillStyle =
            this.hitFlash > 0
                ? "#ffffff"
                : (
                    this.enraged
                        ? "#7f1d1d"
                        : "#312e81"
                );


        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ====================================
        // 皇冠
        // ====================================

        ctx.fillStyle =
            "#facc15";


        ctx.beginPath();

        ctx.moveTo(
            this.x - 25,
            this.y - 30
        );

        ctx.lineTo(
            this.x - 15,
            this.y - 50
        );

        ctx.lineTo(
            this.x,
            this.y - 34
        );

        ctx.lineTo(
            this.x + 15,
            this.y - 50
        );

        ctx.lineTo(
            this.x + 25,
            this.y - 30
        );

        ctx.closePath();

        ctx.fill();


        // ====================================
        // 眼睛
        // ====================================

        ctx.fillStyle =
            "#ff304f";


        ctx.beginPath();

        ctx.arc(
            this.x - 12,
            this.y - 5,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            this.x + 12,
            this.y - 5,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ====================================
        // 名字
        // ====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 16px Arial";

        ctx.textAlign =
            "center";


        ctx.fillText(
            this.name,
            this.x,
            this.y - 65
        );


        // ====================================
        // Boss 血条
        // ====================================

        const barWidth = 100;

        const barHeight = 10;


        ctx.fillStyle =
            "#260808";


        ctx.fillRect(
            this.x - barWidth / 2,
            this.y - 55,
            barWidth,
            barHeight
        );


        ctx.fillStyle =
            this.enraged
                ? "#ff304f"
                : "#a855f7";


        ctx.fillRect(
            this.x - barWidth / 2,
            this.y - 55,
            barWidth *
                (
                    this.hp /
                    this.maxHp
                ),
            barHeight
        );
    }
}