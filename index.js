import { getContext, FPS } from "./utils-module.js";

// กำหนดชื่อเรื่องของเอกสาร HTML
document.title = "A01 - App Graphics 2D";
// กำหนดให้ฟังก์ชัน main ทำงานเมื่อ DOM ถูกโหลดเสร็จสมบูรณ์
document.addEventListener("DOMContentLoaded", main);

// ฟังก์ชันหลักที่ใช้ในการเริ่มต้นแอปพลิเคชัน ทำงานเมื่อ DOM ถูกโหลดเสร็จสมบูรณ์
function main(ev) {
	// เข้าถึง context ของ canvas ที่มี id เป็น "myCanvas"
	const ctx = getContext("#myCanvas");

	// กำหนดค่าเริ่มต้นสำหรับแอปพลิเคชันในรูปแบบของอ็อบเจกต์ config
	const config = {
		width : 800,
		height : 600,
		bgColor : "white",
		debug : true,
	};

	// กำหนดขนาดของ canvas ตามค่า config
	ctx.canvas.width = config.width;
	ctx.canvas.height = config.height;

	let sunRayAngle = 0; // เพิ่มตัวแปรสำหรับเก็บมุมหมุน

	// สำหรับปลูกหญ้า
	const grassLimit = 500; // จำนวนหญ้าสูงสุด
	const grassArray = [];
	let grassGrown = false;

	// สร้างข้อมูลหญ้า
	function initGrass() {
		for (let i = 0; i < grassLimit; i++) {
			const x = Math.random() * config.width;
			const y = config.height * 0.5 + Math.random() * (config.height * 0.5 - 20);
			grassArray.push({
				x,
				y,
				height: 0,
				maxHeight: 20 + Math.random() * 20,
				growSpeed: 0.5 + Math.random() * 0.5
			});
		}
	}

	// ฟังก์ชันปลูกหญ้า
	function growGrass(ctx) {
		let allGrown = true;
		for (let i = 0; i < grassArray.length; i++) {
			const grass = grassArray[i];
			if (grass.height < grass.maxHeight) {
				grass.height += grass.growSpeed;
				if (grass.height > grass.maxHeight) grass.height = grass.maxHeight;
				allGrown = false;
			}
			// วาดหญ้าเป็นเส้นตรงเอียงขวาเล็กน้อย
			ctx.save();
			ctx.strokeStyle = "limegreen";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(grass.x, grass.y);
			ctx.lineTo(grass.x + 5, grass.y - grass.height);
			ctx.stroke();
			ctx.restore();
		}
		if (allGrown) grassGrown = true;
	}

	initGrass();

	function draw() {
		// ใช้ FPS สำหรับการวัดอัตราเฟรมต่อวินาที
		FPS.update();

		// กำหนดสีพื้นหลังของ canvas และใช้ fillRect เพื่อเติมสีพื้นหลัง
		ctx.fillStyle = config.bgColor;
		ctx.fillRect(0, 0, config.width, config.height);

		// วาดรูปจากส่วนนี้ไป **แนะนำให้วาดจากรูปที่อยู่ด้านหลังไปด้านหน้าตามลำดับ**
		// ใช้ภาพจาก MP1-app-graphics-2d.jpg เป็นแนวทางในการวาดรูป แต่จะวาดอย่างไรก็ได้ตามต้องการ

		// TODO:

		// วาดท้องฟ้า
		ctx.fillStyle = "skyblue";
		ctx.fillRect(0, 0, config.width, config.height * 0.5);

		// วาดพื้นหญ้า
		ctx.fillStyle = "green";
		ctx.fillRect(0, config.height * 0.5, config.width, config.height * 0.5);

		// ปลูกหญ้า
		growGrass(ctx);

		// วาดเขาเทาเข้ม
		ctx.save();
		ctx.fillStyle = "darkslategray";
		ctx.beginPath();
		ctx.arc(50, 300, 250, Math.PI, 0);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.restore();

		// เขาน้ำตาล
		ctx.save();
		ctx.fillStyle = "saddlebrown";
		ctx.beginPath();
		ctx.moveTo(300, 300);
		ctx.lineTo(450, 150);
		ctx.lineTo(600, 150);
		ctx.lineTo(600, 150);
		ctx.lineTo(610, 190);
		ctx.lineTo(650, 190);
		ctx.lineTo(700, 100);
		ctx.lineTo(750, 100);
		ctx.lineTo(800, 150);
		ctx.lineTo(800, 300);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.restore();

		// วาดแม่นน้ำ
		ctx.save();
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.moveTo(200, 300);
		ctx.bezierCurveTo(400, 400, 400, 250, 400, 700);
		ctx.lineTo(250, 800);
		ctx.bezierCurveTo(725, 700, 500, 300, 450, 300);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.restore();

		// วาดนก
		ctx.save();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(600, 100);
		ctx.quadraticCurveTo(620, 80, 640, 100);
		ctx.moveTo(640, 100);
		ctx.quadraticCurveTo(660, 80, 680, 100);
		ctx.stroke();
		ctx.restore();

		// อัปเดตมุมหมุน
		sunRayAngle += 0.2; // ปรับความเร็วการหมุนตามต้องการ

		//วาดแฉกดวงอาทิตย์ (หมุน)
		ctx.save();
		ctx.translate(375, 125); // ย้ายจุดหมุนไปที่จุดศูนย์กลางดวงอาทิตย์
		ctx.rotate(sunRayAngle); // หมุน canvas
		ctx.strokeStyle = "black";
		ctx.fillStyle = "red";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(-75, -35); // ปรับตำแหน่งให้สัมพันธ์กับจุดศูนย์กลางใหม่
		ctx.lineTo(75, -35);
		ctx.lineTo(0, 75);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();

		// วาดดวงอาทิตย์
		ctx.save();
		ctx.fillStyle = "yellow";
		ctx.beginPath();
		ctx.arc(375, 125, 50, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "orange";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.restore();

		//วาดต้นไม้

		// ลำต้น
		ctx.save();
		ctx.fillStyle = "saddlebrown";
		ctx.fillRect(100, 350, 50, 100);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.strokeRect(100, 350, 50, 100);
		ctx.restore();

		// ใบไม้
		ctx.save();
		ctx.fillStyle = "darkgreen";


		ctx.beginPath();
		ctx.moveTo(50, 400); 
		ctx.lineTo(200, 400); 
		ctx.lineTo(200, 200);
		ctx.lineTo(125, 150);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.restore();

		// บ้าน
		// ตัวบ้าน
		ctx.save();
		ctx.fillStyle = "lightyellow";
		ctx.fillRect(550, 350, 150, 100);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.strokeRect(550, 350, 150, 100);
		ctx.restore();
		// หลังคา
		ctx.save();
		ctx.fillStyle = "brown";
		ctx.beginPath();
		ctx.moveTo(525, 350);
		ctx.lineTo(725, 350);
		ctx.lineTo(625, 250);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.restore();
		// ประตู
		ctx.save();
		ctx.fillStyle = "sienna";
		ctx.fillRect(600, 400, 50, 50);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.strokeRect(600, 400, 50, 50);
		ctx.restore();

		// เมฆ
		ctx.save();
		ctx.fillStyle = "lightgray";
		ctx.beginPath();
		ctx.arc(150, 100, 30, 0, Math.PI * 2);
		ctx.arc(180, 80, 30, 0, Math.PI * 2);
		ctx.arc(210, 100, 30, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.restore();

		
		// เขตสิ้นสุดของการวาดรูป


		// แสดงข้อความ FPS บน canvas ถ้า config.debug เป็น true
		if (config.debug) FPS.show(ctx, 10, 28);

		// ใช้ requestAnimationFrame เพื่อเรียกใช้ฟังก์ชัน draw ต่อไป
		requestAnimationFrame(draw);
	}
	// เริ่มต้นการวาดภาพบน canvas
	draw();
}