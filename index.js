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
	const grassArray = []; // เก็บข้อมูลหญ้า
	let grassGrown = false; // ตัวแปรบอกว่าหญ้าขึ้นเต็มที่แล้วหรือยัง

	// สร้างข้อมูลหญ้า
	function initGrass() {
		for (let i = 0; i < grassLimit; i++) {
			const x = Math.random() * config.width; // ตำแหน่ง x แบบสุ่ม
			// ตำแหน่ง y แบบสุ่มในครึ่งล่างของ canvas
			const y = config.height * 0.6 + Math.random() * (config.height * 0.4 - 20);
			grassArray.push({
				x,
				y,
				height: 0,
				maxHeight: 20 + Math.random() * 20, // ความสูงสูงสุดแบบสุ่ม
				growSpeed: 0.005 + Math.random() * 0.05 // ความเร็วการเติบโตแบบสุ่ม
			});
		}
	}

	// ฟังก์ชันปลูกหญ้า
	function growGrass(ctx) { // รับ context ของ canvas เป็นพารามิเตอร์
		let allGrown = true;
		for (let i = 0; i < grassArray.length; i++) { 
			const grass = grassArray[i]; 
			if (grass.height < grass.maxHeight) { // ถ้าหญ้ายังไม่สูงสุด
				grass.height += grass.growSpeed; // เพิ่มความสูงของหญ้า
				// จำกัดความสูงไม่ให้เกิน maxHeight
				if (grass.height > grass.maxHeight) grass.height = grass.maxHeight;
				allGrown = false; 
			}
			// วาดหญ้าเป็นเส้นตรงเอียงขวาเล็กน้อย
			ctx.save();
			ctx.strokeStyle = "lightgreen"; // สีหญ้า
			ctx.lineWidth = 2; // ความหนาของเส้นหญ้า
			ctx.beginPath();
			ctx.moveTo(grass.x, grass.y); // จุดเริ่มต้นที่ฐานหญ้า
			ctx.lineTo(grass.x, grass.y - grass.height); // เอียงขวาเล็กน้อย
			ctx.stroke();
			ctx.restore();
		}
		if (allGrown) grassGrown = true;
	}

	initGrass();

	let cloudX = 150; // ตำแหน่งเริ่มต้นของเมฆ

	function draw() {
		// ใช้ FPS สำหรับการวัดอัตราเฟรมต่อวินาที
		FPS.update();

		// กำหนดสีพื้นหลังของ canvas และใช้ fillRect เพื่อเติมสีพื้นหลัง
		ctx.fillStyle = config.bgColor; 
		ctx.fillRect(0, 0, config.width, config.height);

		// วาดรูปจากส่วนนี้ไป **แนะนำให้วาดจากรูปที่อยู่ด้านหลังไปด้านหน้าตามลำดับ**
		// ใช้ภาพจาก MP1-app-graphics-2d.jpg เป็นแนวทางในการวาดรูป แต่จะวาดอย่างไรก็ได้ตามต้องการ

		// TODO:

		// วาดท้องฟ้า (ผมวาดท้องฟ้าก่อนเพราะอยู่ด้านหลังสุด)
		ctx.fillStyle = "skyblue";// สีท้องฟ้า
		ctx.fillRect(0, 0, config.width, config.height * 0.5); // ครึ่งบนของ canvas

		// วาดพื้นหญ้า (ผมวาดพื้นหญ้าหลังเพราะอยู่ด้านหลังสุด)
		ctx.fillStyle = "green"; // สีพื้นหญ้า
		ctx.fillRect(0, config.height * 0.5, config.width, config.height * 0.5); // ครึ่งล่างของ canvas

		// ปลูกหญ้า
		growGrass(ctx); 

		// วาดเขาเทาเข้ม (ผมเอาคลึ่งวงกลมมาวาด)
		ctx.save();
		ctx.fillStyle = "darkslategray"; // สีเขาเทาเข้ม
		ctx.beginPath();
		ctx.arc(50, 300, 250, Math.PI, 0); // วาดครึ่งวงกลม
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black"; // สีกรอบ
		ctx.lineWidth = 2; // ความหนากรอบ
		ctx.stroke();
		ctx.restore();

		// เขาน้ำตาล (ผมวาดเป็นรูปหลายเหลี่ยม)
		ctx.save();
		ctx.fillStyle = "saddlebrown"; // สีเขาน้ำตาล
		ctx.beginPath();
		ctx.moveTo(300, 300); // จุดเริ่มต้นที่ฐานเขา
		ctx.lineTo(450, 150); 
		ctx.lineTo(600, 150);
		ctx.lineTo(600, 150);
		ctx.lineTo(610, 190);
		ctx.lineTo(650, 190);
		ctx.lineTo(700, 100);
		ctx.lineTo(750, 100);
		ctx.lineTo(800, 150);
		ctx.lineTo(800, 300); // จุดสิ้นสุดที่ฐานเขา
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black"; // สีกรอบ
		ctx.lineWidth = 2; // ความหนากรอบ
		ctx.stroke();
		ctx.restore();

		// วาดแม่นน้ำ (ผมเอา bezier curve 2 อันมาต่อกัน)
		ctx.save();
		ctx.fillStyle = "blue"; // สีแม่น้ำ
		ctx.beginPath();
		ctx.moveTo(200, 300); 
		ctx.bezierCurveTo(400, 400, 400, 250, 400, 700); // เส้นซ้าย
		ctx.lineTo(250, 800); // ฐานแม่น้ำ
		ctx.bezierCurveTo(725, 700, 500, 300, 450, 300); // เส้นขวา
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black"; // สีกรอบ
		ctx.lineWidth = 2; // ความหนากรอบ
		ctx.stroke();
		ctx.restore();

		// วาดนก (ผมวาดเป็นเส้นโค้ง 2 อัน)
		ctx.save();
		ctx.strokeStyle = "black"; // สีเส้นนก
		ctx.lineWidth = 2; // ความหนาเส้นนก
		ctx.beginPath();
		ctx.moveTo(600, 100);
		ctx.quadraticCurveTo(620, 80, 640, 100); // ปีกซ้าย
		ctx.moveTo(640, 100);
		ctx.quadraticCurveTo(660, 80, 680, 100); // ปีกขวา
		ctx.stroke();
		ctx.restore();

		// อัปเดตมุมหมุน
		sunRayAngle += 0.2; // ปรับความเร็วการหมุนตามต้องการ

		//วาดแฉกดวงอาทิตย์ (หมุน)
		ctx.save();
		ctx.translate(375, 125); // ย้ายจุดหมุนไปที่จุดศูนย์กลางดวงอาทิตย์
		ctx.rotate(sunRayAngle); // หมุน canvas
		ctx.strokeStyle = "black"; // สีเส้นแฉก
		ctx.fillStyle = "red"; // สีแฉก
		ctx.lineWidth = 4; // ความหนาเส้นแฉก
		ctx.beginPath();
		ctx.moveTo(-75, -35); // จุดเริ่มต้นที่ฐานแฉก
		ctx.lineTo(75, -35); 
		ctx.lineTo(0, 75);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();

		// วาดดวงอาทิตย์ (ใช้ arc วาดวงกลมหลังจากแฉก)
		ctx.save();
		ctx.fillStyle = "yellow"; // สีดวงอาทิตย์
		ctx.beginPath();
		ctx.arc(375, 125, 50, 0, Math.PI * 2); // วาดวงกลม
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "orange"; // สีกรอบดวงอาทิตย์
		ctx.lineWidth = 2; // ความหนากรอบ
		ctx.stroke();
		ctx.restore();

		//วาดต้นไม้

		// ลำต้น
		ctx.save();
		ctx.fillStyle = "saddlebrown"; // สีลำต้น
		ctx.fillRect(100, 350, 50, 100);
		ctx.strokeStyle = "black"; // สีกรอบลำต้น
		ctx.lineWidth = 2; // ความหนากรอบลำต้น
		ctx.strokeRect(100, 350, 50, 100);
		ctx.restore();

		// ใบไม้
		ctx.save();
		ctx.fillStyle = "darkgreen"; // สีใบไม้


		ctx.beginPath();
		ctx.moveTo(50, 400); // จุดเริ่มต้นที่ฐานใบไม้
		ctx.lineTo(200, 400);
		ctx.lineTo(200, 200);
		ctx.lineTo(125, 150); // ยอดใบไม้
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black"; // สีกรอบใบไม้
		ctx.lineWidth = 2; // ความหนากรอบใบไม้
		ctx.stroke();
		ctx.restore();

		// บ้าน
		// ตัวบ้าน
		ctx.save();
		ctx.fillStyle = "lightyellow"; // สีตัวบ้าน
		ctx.fillRect(550, 350, 150, 100); // ตัวบ้าน
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.strokeRect(550, 350, 150, 100); // กรอบตัวบ้าน
		ctx.restore();
		// หลังคา
		ctx.save();
		ctx.fillStyle = "brown"; // สีหลังคา
		ctx.beginPath();
		ctx.moveTo(525, 350); // จุดเริ่มต้นที่มุมซ้ายของหลังคา
		ctx.lineTo(725, 350); // มุมขวาของหลังคา
		ctx.lineTo(625, 250); // ยอดหลังคา
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "black"; // สีกรอบหลังคา
		ctx.lineWidth = 2; // ความหนากรอบหลังคา
		ctx.stroke();
		ctx.restore();
		// ประตู
		ctx.save();
		ctx.fillStyle = "sienna"; // สีประตู
		ctx.fillRect(600, 400, 50, 50); // ตัวประตู
		ctx.strokeStyle = "black"; // สีกรอบประตู
		ctx.lineWidth = 2; // ความหนากรอบประตู
		ctx.strokeRect(600, 400, 50, 50); // วาดกรอบประตู
		ctx.restore();

		// อัปเดตตำแหน่งเมฆ
		cloudX += 2; // ปรับความเร็วตามต้องการ
		if (cloudX > config.width + 30) cloudX = -90; // รีเซ็ตเมื่อทะลุขอบขวา

		// เมฆ (ใช้ cloudX เป็นตำแหน่ง x ของเมฆ เพื่อให้เคลื่อนที่ได้)
		ctx.save();
		ctx.fillStyle = "rgba(240,240,240,0.8)"; // สีเมฆ
		ctx.beginPath();
		ctx.arc(cloudX, 100, 50, 0, Math.PI * 2); 
		ctx.arc(cloudX + 30, 80, 50, 0, Math.PI * 2); 
		ctx.arc(cloudX + 70, 100, 50, 0, Math.PI * 2); 
		ctx.closePath();
		ctx.fill();
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