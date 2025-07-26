import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <img
        src="/img/background.jpg"
        alt="Background Accent"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: "none" }}
      />
      <div className="relative z-10 flex flex-col items-center w-full">
        <Link href="/" className="flex items-center gap-3 mb-8">
          <img
            src="/img/learnmate-logo.png"
            alt="LearnMate Logo"
            className="w-10 h-10 object-contain"
          />
          <span
            className="text-2xl font-bold tracking-wide"
            style={{ color: "#EBA937" }}
          >
            LearnMate
          </span>
        </Link>
        <LoginForm className="max-w-md w-full" />
      </div>
    </div>
  )
}
