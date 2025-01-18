"use client";
import { useRouter } from 'next/navigation';
 
export default function LoadingPage() {

  const router = useRouter();

  const handleRedirect = () => {
    router.push('/home'); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/back_landing.jpg')",
          backgroundSize: "cover",
        }}
      ></div>

      <div className="relative z-10 text-center" >
        <button
          onClick={handleRedirect}
          className="w-64 h-32 bg-no-repeat bg-center bg-contain animate-growShrink"
          style={{
            backgroundImage: "url('/START.png')",
          }}
          type="button"
          
          >
          <span className="sr-only">Start</span>
        </button>
        </div>
    </div>
  );
}
