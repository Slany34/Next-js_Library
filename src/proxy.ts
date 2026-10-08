// เติม: ชื่อที่ Next 16 ใช้ปกป้องเส้นทาง แทน middleware เดิม 
export { auth as proxy} from "@/auth"; 
 
export const config = {  // ตั้งค่า config
  matcher: ["/products/:id/edit", "/products/:id/delete"], // ตรวจเฉพาะหน้า edit delete บล็อคคนไม่ล็อคอิน
}; 