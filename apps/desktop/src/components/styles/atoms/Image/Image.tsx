import { ImageStyle, ImageProps } from "./Image.style";

export const Image = ({ ...props }: ImageProps) => {
  return (
    <>
      <ImageStyle {...props} />
    </>
  );
};
