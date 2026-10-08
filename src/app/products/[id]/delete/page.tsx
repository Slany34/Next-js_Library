import Link from "next/link"; 
import { notFound, redirect } from "next/navigation"; 
import { auth } from "@/auth"; 
import { getProduct } from "@/lib/products"; 
import { deleteProductAction } from "@/app/actions"; 
 
type DeleteProductPageProps = { 
  params: Promise<{ id: string }>; 
}; 
 
export default async function DeleteProductPage({ params,}: DeleteProductPageProps) { 
  const session = await auth(); 
  if (!session?.user) { 
    // เติม: ฟังก์ชันที่พาผู้ที่ยังไม่ล็อกอินกลับหน้าแรก 
    redirect("/"); 
  } 
 
  const { id } = await params; // ถอดรหัส id จาก url
  const product = getProduct(id); 
  if (!product) { 
    notFound(); //404
  } 

  // ผูกค่ารหัสสินค้า (product.id) เข้าไปกับฟังก์ชัน deleteProductAction เตรียมเอาไว้ก่อน 
  // เพื่อให้ตอนที่กดปุ่ม Submit ฟอร์ม มันจะส่ง ID นี้ไปลบได้ถูกต้อง
  const deleteAction = deleteProductAction.bind(null, product.id); 
 
  return ( 
    <main> 
      <h1>ยืนยันการลบ</h1> 
      <p>ต้องการลบสินค้า “{product.name}” หรือไม่?</p> 
      <div> 
        <form action={deleteAction}> 
          <button type="submit">ยืนยันการลบ</button> 
        </form> 
        <Link href="/">ยกเลิก</Link> 
      </div> 
    </main> 
  ); 
}