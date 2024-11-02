import { useEffect, useState } from "react";
import config from "../../utils/config";
import { LabelData } from "../../utils/customTypes";

interface SerieImgProps {
  thumbs: string[];
}

const SerieImage: React.FC<SerieImgProps> = ({ thumbs }) => {
  const [labelData, setLabelData] = useState<LabelData>({} as LabelData);
  const prestigeLabels = ["chn", "bgn", "gni", "dlv"];

  useEffect(() => {
    const secondLabel = thumbs[1].split("-")[0];

    const getLabelData = async (label: string) => {
      // Fetch label data from the API
      const res = await fetch(`${config.apiUrl}/lookups/pre/${label}`);
      const data = await res.json();
      setLabelData(data);
    };

    getLabelData(secondLabel);
  }, [thumbs]);

  const getImgSrc = (fullCode: string): string => {
    const [codeLabel, codeNum] = fullCode.split("-");
    const codeNumPadded = codeNum.padStart(5, "0");

    if (codeLabel.startsWith("ab") || prestigeLabels.includes(codeLabel)) {
      // return `https://pics.dmm.co.jp/mono/movie/adult/118${codeLabel}${codeNum}/118${codeLabel}${codeNum}ps.jpg`;
      return `https://image.mgstage.com/images/prestige/${codeLabel}/${codeNum}/pf_o1_${codeLabel}-${codeNum}.jpg`;
    } else {
      return `https://pics.dmm.co.jp/digital/video/${
        labelData.prefix || ""
      }${codeLabel}${codeNumPadded}/${
        labelData.prefix || ""
      }${codeLabel}${codeNumPadded}ps.jpg`;
    }
  };

  return (
    <>
      {thumbs.map((code) => (
        <div className="flex aspect-[21/30]" key={code}>
          <img src={getImgSrc(code)} alt={code} className="object-cover" />
        </div>
      ))}
    </>
  );
};

export default SerieImage;
