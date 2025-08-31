import Image from "next/image"
import Link from "next/link"

const assetBg = "https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/404/error-5.png"
const assetIllustration = "https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/404/error-6.png"

export default function NotFound() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="px-4 py-8 flex flex-col items-center justify-center justify-self-center text-center">
        <h2 className="text-base-content mb-6 text-5xl font-semibold">Whoops!</h2>
        <h3 className="text-base-content mb-1.5 text-3xl font-semibold">Something went wrong</h3>
        <p className="text-base-content mb-6 max-w-sm">
          The page you're looking for isn't found, we suggest you back to home.
        </p>
        <Link href="/" className="btn btn-primary btn-gradient">
          Back to home page
        </Link>
      </div>

      <div className="relative max-h-screen w-full p-2 max-lg:hidden">
        <Image
          src={assetBg}
          alt="404 background"
          fill
          className="rounded-2xl object-cover"
        />
        <Image
          src={assetIllustration}
          alt="404 illustration"
          width={477}
          height={477}
          className="absolute top-1/2 left-1/2 h-[clamp(300px,40vw,477px)] -translate-x-[42%] -translate-y-1/2"
        />
      </div>
    </div>
  )
}
