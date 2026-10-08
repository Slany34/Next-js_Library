"use server"; 
 
import { auth } from "@/auth"; 
import { deleteProduct, updateProduct } from "@/lib/products"; 
import { revalidatePath } from "next/cache"; 
import { redirect } from "next/navigation"; 
 
async function requireUser() { 
  const session = await auth(); //ดู session ปัจจุบัน
  if (!session?.user) {  //ถ้าไม่มี user login อยู่
    throw new Error("Unauthorized"); // เตะออกและแจ้ง error เมื่อไม่ได้ login
  } 
  return session.user; // ถ้าผ่าน จะคืนค่าข้อมูล user
} 
 
export async function updateProductAction(id: string, formData: FormData) { 
  // เติม: ฟังก์ชันที่ตรวจ session ซ้ำก่อนแก้ข้อมูล 
  await requireUser(); 
 
  const name = String(formData.get("name") ?? "").trim(); 
  const description = String(formData.get("description") ?? "").trim(); 
  const price = Number(formData.get("price")); 
 
  if (!name || !description) { 
    throw new Error("กรุณากรอกข้อมูลให้ครบ"); 
  } 
  if (!Number.isFinite(price) || price < 0) { 
    throw new Error("ราคาไม่ถูกต้อง"); 
  } 
 
  updateProduct(id, { name, description, price }); // เรียกคำสั่งบันทึกการอัปเดตไปที่ฐานข้อมูล
 
  // เติม: ฟังก์ชันที่สั่งให้ Next ดึงข้อมูลหน้าแรกใหม่ 
  revalidatePath("/"); //ล้าง cache โหลดข้อมูลใหม่
  redirect("/"); // เด้งผู้ใช้กลับไปหน้าแรก
} 
 
export async function deleteProductAction(id: string) { 
  await requireUser(); 
  deleteProduct(id); // โยน ID สั่งลบจากระบบข้อมูลจำลอง
  revalidatePath("/"); 
  redirect("/"); 
} 