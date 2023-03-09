import { ImageStyle, ImageProps } from "./Image.styled";

export const Image = ({ ...props }: ImageProps) => {
  return (
      <ImageStyle {...props} />
  );
};
