import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-24 w-full bg-white py-48">
      <div className="mx-auto flex w-full max-w-[1400px] items-center px-6 lg:px-12">
        <span className="flex-shrink-0 text-[64px] font-medium tracking-[0.35em] text-gray-900">
          TYPE
        </span>
        <div className="mx-16 flex flex-1 items-center">
          <span className="footer-arrow" aria-hidden="true" />
          <Image
            src="/Star 1.svg"
            alt="Star"
            width={52}
            height={52}
            className="-ml-3 translate-y-[1px] flex-shrink-0"
            priority
          />
        </div>
        <span className="flex-shrink-0 text-[64px] font-medium tracking-[0.35em] text-gray-900">
          GEN
        </span>
      </div>
    </footer>
  );
}
