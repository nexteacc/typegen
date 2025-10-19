import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="relative z-0 w-full bg-white py-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-6 lg:px-12">
        {/* Product Hunt Badge */}
        <div className="mb-4">
          <a
            href="https://www.producthunt.com/products/typegen/reviews?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-typegen"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1111292&theme=light"
              alt="TypeGen - Drag-and-drop AI that rewrites in 28 styles | Product Hunt"
              style={{ width: '180px', height: '39px' }}
              width="180"
              height="39"
            />
          </a>
        </div>

        {/* TYPE ★ GEN 品牌标识 - 保持原始大小 */}
        <div className="flex w-full items-center">
          <span className="flex-shrink-0 text-[72px] font-medium tracking-[0.35em] text-gray-900">
            TYPE
          </span>
          <div className="mx-20 flex flex-1 items-center">
            <span className="footer-arrow" aria-hidden="true" />
            <Image
              src="/Star 1.svg"
              alt="Star"
              width={60}
              height={60}
              className="-ml-3 translate-y-[1px] flex-shrink-0 star-spin"
              priority
            />
          </div>
          <span className="flex-shrink-0 text-[72px] font-medium tracking-[0.35em] text-gray-900">
            GEN
          </span>
        </div>
      </div>
    </footer>
  );
}
