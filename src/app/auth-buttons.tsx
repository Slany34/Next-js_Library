import { signIn, signOut } from "@/auth"; 
 
type AuthButtonsProps = { 
  isLoggedIn: boolean; //สถานะ login
  userName?: string | null; // ชื่อของผู้ใช้ (มีหรือไม่ก็ได้)
}; 
 
//สร้าง component ปุ่ม
export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) { 
  if (isLoggedIn) { //ถ้า login แล้ว
    return ( 
      <div> 
        <span>{userName ?? "ผู้ใช้งาน"}</span> 
        <form 
          action={async () => { 
            "use server"; 
            await signOut({ redirectTo: "/" }); 
          }} 
        > 
          <button type="submit">Logout</button> 
        </form> 
      </div> 
    ); 
  } 
 
  return ( //ถ้ายังไม่ login
    <form 
      action={async () => { 
        "use server"; 
        // เติม: ชื่อ provider ของ Google (ตัวพิมพ์เล็ก) 
        await signIn("google", { redirectTo: "/" }); 
      }} 
    > 
      <button type="submit">Login with Google</button> 
    </form> 
  ); 
}