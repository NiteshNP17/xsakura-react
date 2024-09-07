import { useEffect, useState } from "react";
import config from "../../utils/config";

// Function to fetch image source
const fetchDmmSrc = async (code: string) => {
  const [codeLabel, codeNum] = code.split("-");
  const prestigeLabels = ["ab", "chn", "bgn", "gni", "dlv"];
  const codeNumPadded = codeNum.padStart(5, "0");
  let dmmSrc;

  if (prestigeLabels.some((sub) => codeLabel.startsWith(sub))) {
    dmmSrc = `https://pics.dmm.co.jp/mono/movie/adult/118${codeLabel}${codeNum}/118${codeLabel}${codeNum}ps.jpg`;
  } else {
    // Fetch label data from the API
    const response = await fetch(
      `${config.apiUrl}/lookups/pre/${codeLabel}?codenum=${codeNum}`,
    );
    const labelData = await response.json();

    dmmSrc = `https://pics.dmm.co.jp/digital/video/${
      labelData.prePre || ""
    }${codeLabel}${codeNumPadded}/${
      labelData.prePre || ""
    }${codeLabel}${codeNumPadded}ps.jpg`;

    // Construct the correct image URL based on the codeLabel
    /*dmmSrc = `https://pics.dmm.co.jp/mono/movie/adult/${
      labelData.prePre || ""
    }${codeLabel}${codeNumPadded}/${
      labelData.prePre || ""
    }${codeLabel}${codeNumPadded}ps.jpg`;*/
  }

  return dmmSrc;
};

// New ImageComponent to handle async image source fetching
const SeriesImage = ({ code }: { code: string }) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    const fetchImageSrc = async () => {
      const imageSrc = await fetchDmmSrc(code);
      setSrc(imageSrc);
    };

    fetchImageSrc();
  }, [code]);

  return (
    <div className="flex aspect-[21/30]">
      <img src={src} alt={code} className="object-cover" />
    </div>
  );
};

export default SeriesImage;
