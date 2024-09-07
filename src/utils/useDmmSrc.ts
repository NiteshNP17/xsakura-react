import { useState, useEffect } from "react";
import config from "./config";

const useDmmSrc = (code: string) => {
  const [dmmSrc, setDmmSrc] = useState<string | null>(null);
  const [label, codeNum] = code.split("-");
  const prestigeLabels = ["ab", "chn", "bgn", "gni", "dlv"];
  const noPreLabels = ["waaa", "mih"];

  useEffect(() => {
    const fetchDmmSrc = async (codeLabel: string) => {
      let newDmmSrc;

      if (prestigeLabels.some((sub) => codeLabel.startsWith(sub))) {
        newDmmSrc = `https://pics.dmm.co.jp/mono/movie/adult/118${codeLabel}${codeNum}/118${codeLabel}${codeNum}pl.jpg`;
      } else if (noPreLabels.includes(codeLabel)) {
        newDmmSrc = `https://pics.dmm.co.jp/mono/movie/adult/${codeLabel}${codeNum}/${codeLabel}${codeNum}pl.jpg`;
      } else {
        const codeNumPadded = codeNum.padStart(5, "0");

        // Fetch label data from the API
        const response = await fetch(
          `${config.apiUrl}/lookups/pre/${codeLabel}?codenum=${codeNum}`,
        );
        const labelData = await response.json();

        // Construct the correct image URL based on the codeLabel
        newDmmSrc = `https://pics.dmm.co.jp/digital/video/${
          labelData.prePre || ""
        }${codeLabel}${codeNumPadded}/${
          labelData.prePre || ""
        }${codeLabel}${codeNumPadded}pl.jpg`;
      }
      setDmmSrc(newDmmSrc);
    };

    fetchDmmSrc(label);
  }, [label]);

  return dmmSrc;
};

export default useDmmSrc;
