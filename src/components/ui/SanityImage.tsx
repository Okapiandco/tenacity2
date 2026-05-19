import Image from "next/image";
import type { Image as SanityImageType } from "sanity";

import { urlFor } from "@/sanity/lib/image";

export type SanityImageWithAlt = SanityImageType & { alt?: string };

type CommonProps = {
  image?: SanityImageWithAlt | null;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fallbackAlt?: string;
};

type SizedProps = CommonProps & {
  width: number;
  height: number;
  fill?: false;
};

type FillProps = CommonProps & {
  fill: true;
  width?: number;
  height?: number;
};

type Props = SizedProps | FillProps;

export function SanityImage(props: Props) {
  const { image, sizes, className, priority, fallbackAlt } = props;
  if (!image?.asset) return null;

  const alt = image.alt ?? fallbackAlt ?? "";

  if (props.fill) {
    const url = urlFor(image).width(1600).auto("format").url();
    return (
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
      />
    );
  }

  const url = urlFor(image)
    .width(props.width)
    .height(props.height)
    .fit("crop")
    .url();
  return (
    <Image
      src={url}
      alt={alt}
      width={props.width}
      height={props.height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
