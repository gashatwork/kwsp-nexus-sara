import Image from "next/image"
import Link from "next/link"

export default function Logo() {
  const clearSorage = () => {
    localStorage.removeItem("voiceNexusUser");
    localStorage.removeItem("voiceNexusSession");
    sessionStorage.removeItem("chatMessages");
    sessionStorage.removeItem("userDetails");
    window.location.reload();
  }
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src="/epf-big-logo.png"
        alt="KWSP EPF Logo"
        width={110}
        height={30}
        className="object-contain"
        onClick={clearSorage}
      />
    </Link>
  )
}

