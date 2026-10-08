// import ProductExplorer from "@/components/ProductExplorer";

// export default function Home() {
//   return <ProductExplorer />;
// }
import { auth } from "@/auth";
import { AuthButtons } from "./auth-buttons"; 
import ProductExplorer from "@/components/ProductExplorer";

// ใช้ async สร้างหน้าเว็บ เพื่อดึงข้อมูลโดยตรงจาก servver
export default async function HomePage() {
  const session = await auth(); // รอรับ sesion ของผู้ใช้ 
  const isLoggedIn = Boolean(session?.user); //เช็คข้อมูล user แล้วแปลงเป็น Boolean

  return (
    <main>
      <header>
        <h1>สินค้า</h1>
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </header>

      <ProductExplorer isLoggedIn={isLoggedIn} />
    </main>
  );
}