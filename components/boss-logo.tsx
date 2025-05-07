import Image from "next/image"

export function BossLogo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/images/iconlogo.png"
        alt="Boss Logo"
        width={32}
        height={32}
        className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
      />
    </div>
  )
}
