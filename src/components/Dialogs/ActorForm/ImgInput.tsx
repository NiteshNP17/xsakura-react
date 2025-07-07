import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { ActorData } from "../../../utils/customTypes";

type EditData = Omit<ActorData, "sizes"> & {
  sizes: string;
};

const ImgInput = ({
  values,
  setValues,
}: {
  values: EditData;
  setValues: (values: EditData) => void;
}) => {
  const [open, setOpen] = useState(false);
  const nameFormatted = values.name.replace(/ /g, "-");
  const nameFormatted2 = values.name.replace(/ /g, "_");
  const options = [
    `https://www.javdatabase.com/idolimages/full/${nameFormatted}.webp`,
    `https://javmodel.com/javdata/uploads/${nameFormatted2}150.jpg`,
    `https://cdn002.imggle.net/actor/${nameFormatted}.jpg`,
  ];

  return (
    <Autocomplete
      id="actor-img-input"
      open={open}
      options={options}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      freeSolo
      value={values.img500 || ""}
      onInputChange={(_e, val) => setValues({ ...values, img500: val })}
      onChange={(_e, newValue) =>
        newValue
          ? setValues({ ...values, img500: newValue })
          : setValues({ ...values, img500: "" })
      }
      renderInput={(params) => (
        <TextField {...params} type="url" name="img500" label="Image URL" />
      )}
    />
  );
};

export default ImgInput;
