import Image from "next/image";
import React from "react";

function RandomAvatar({ custom = [] }) {
  return (
    <Image
      src={`https://avatars.dicebear.com/api/${
        custom.length > 0
          ? custom[Math.floor(Math.random() * custom.length)]
          : [
              "male",
              "female",
              "human",
              "identicon",
              "initials",
              "bottts",
              "avataaars",
              "jdenticon",
              "gridy",
              "micah",
            ][Math.floor(Math.random() * 10)]
      }/${Math.random()}.svg`}
      width={22}
      height={22}
      alt="avatar"
    />
  );
}

export default React.memo(RandomAvatar);
