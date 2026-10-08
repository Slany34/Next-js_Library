import NextAuth from "next-auth"; 
import Google from "next-auth/providers/google"; //ตัวเชื่อมบัญชี google

// สร้างระบบ NextAuth ส่งออกตัวแปร 4 ตัว
// handlers ดึง API auth ดึง session
export const { handlers, auth, signIn, signOut } = NextAuth({ 
  trustHost: true, 
  // เติม: provider ของ Google ที่ import มาด้านบน 
  providers: [Google], // เลือกช่องทาง login
  callbacks: { // ใช้แทรกแซงควบุมพฤติกรรม ระหว่างใช้งาน
    authorized({ auth, request }) { // ตัวตรวจสอบสิทธิก่อนเข้าถึงแต่ละเว็บ
      const pathname = request.nextUrl.pathname; // ดึง path ที่ผู้ใช้กำลังจะเปิด

      // เช็คว่าหน้านั้นเป็นหน้าจัดการสินค้ารึเปล่า
      const isProductManagementPage = 
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);
        
      if (isProductManagementPage) {  // ถ้าเป็นหน้าจัดการสินค้า
        return Boolean(auth?.user); // คืนค่าเป็น Boolean ว่ามี session ของผู้ใช้อยู่หรือไม่ (true เข้าได้ false เด้งออก)
      } 

      return true; // หน้าอื่นให้ดูได้
    }, 
  }, 
}); 