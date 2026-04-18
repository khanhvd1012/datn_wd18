import { useEffect, useState } from "react";
import { Box } from "@mui/material";

interface DealBannerItem {
  _id: string;
  image: string;
}

interface DealMallBannerProps {
  banners: DealBannerItem[];
}

const DealMallBanner = ({ banners }: DealMallBannerProps) => {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (hover || banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [hover, banners.length]);

  useEffect(() => {
    if (index >= banners.length) setIndex(0);
  }, [index, banners.length]);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: 2,
        position: "relative",
        background: "#000",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: `${(banners.length || 1) * 100}%`,
          transform: `translateX(-${index * 100}%)`,
          transition: "0.5s",
        }}
      >
        {banners.length > 0 ? (
          banners.map((item) => (
            <Box
              key={item._id}
              component="img"
              src={item.image}
              alt="mall banner"
              sx={{
                width: "100%",
                height: 300,
                objectFit: "cover",
              }}
            />
          ))
        ) : (
          <Box
            component="img"
            src="https://via.placeholder.com/400"
            alt="fallback banner"
            sx={{ width: "100%", height: 300 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default DealMallBanner;
