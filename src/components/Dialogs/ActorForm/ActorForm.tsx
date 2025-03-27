import { Button, Dialog, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ActorCard from "../../Actors/ActorCard";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import config from "../../../utils/config";
import { ActorData } from "../../../utils/customTypes";
import { useLocation, useNavigate } from "react-router-dom";
import ImgInput from "./ImgInput";
import FetchActorDataButton from "./FetchActorDataButton";

interface ActorFormProps {
  openEditDialog: boolean;
  setOpenEditDialog: (open: boolean) => void;
  refetch: () => void;
  setOpenSnack?: (open: boolean) => void;
  actorToEdit: { actor: ActorData; id: string } | null;
}

type EditData = Omit<ActorData, "sizes"> & {
  sizes: string;
};

interface Sizes {
  bust: number;
  waist: number;
  hips: number;
}

const ActorForm: React.FC<ActorFormProps> = ({
  openEditDialog,
  setOpenEditDialog,
  refetch,
  // setOpenSnack,
  actorToEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({} as EditData);
  const [cachedData, setCachedData] = useState({} as EditData);
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const handleClose = () => {
    // setFormFields({} as ActorData);
    setLoading(false);
    setOpenEditDialog(false);
    setCachedData({} as EditData);
  };

  useEffect(() => {
    if (actorToEdit?.actor?.name)
      setFormFields({
        ...actorToEdit.actor,
        sizes: actorToEdit.actor.sizes
          ? `${actorToEdit.actor.sizes.bust}-${actorToEdit.actor.sizes.waist}-${actorToEdit.actor.sizes.hips}`
          : "",
      });
    else setFormFields({} as EditData);
  }, [actorToEdit]);

  const verifyActor = async (actorName: string) => {
    const res = await axios.get(`${config.apiUrl}/actors/${actorName}`);
    if (res.data.message !== "notFound") {
      setFormFields({
        ...formFields,
        _id: res.data.id,
        name: actorName,
      });
    } else {
      console.log("notFound");
      setFormFields({
        ...formFields,
        _id: "",
        name: actorName,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formFields.name.length < 3) return;
    setLoading(true);

    try {
      if (!actorToEdit?.actor.name && !formFields._id) {
        await axios.post(`${config.apiUrl}/actors`, formFields);
      } else {
        const res = await axios.patch(
          `${config.apiUrl}/actors/${formFields._id}`,
          formFields,
        );
        if (path.includes("/actor/")) {
          navigate(`/actor/${res.data.name.replace(" ", "-")}?sort=release`);
        }
      }
      console.log("Success!");
      refetch();
      handleClose();
    } catch (err) {
      console.log("Error: ", err);
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={!openEditDialog ? false : true}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          m: 2,
          borderRadius: "1.3rem",
          maxWidth: "100vw",
          width: "clamp(330px, 95vw, 992px)",
        },
      }}
    >
      <div className="p-6">
        <h1 className="mb-3 w-full text-2xl font-semibold">
          {!formFields._id ? "Add" : "Edit"} Actor
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center gap-6 md:grid md:grid-cols-2">
            <div className="mx-auto grid w-[69%]">
              <ActorCard actor={{ ...formFields, sizes: {} as Sizes }} noLink />
            </div>
            <div className="grid w-full grid-cols-2 flex-col gap-4">
              <TextField
                type="text"
                name="name"
                autoFocus
                label="Name"
                required
                autoComplete="off"
                defaultValue={formFields.name}
                onBlur={(e) => {
                  !formFields._id && e.target.value.trim().length > 2
                    ? verifyActor(e.target.value.toLowerCase().trim())
                    : setFormFields({
                        ...formFields,
                        name: e.target.value.toLowerCase().trim(),
                      });
                }}
              />
              <TextField
                type="text"
                name="dob"
                label="Birthdate"
                autoComplete="off"
                value={formFields.dob || ""}
                onChange={(e) =>
                  setFormFields({
                    ...formFields,
                    dob: e.target.value.trim(),
                  })
                }
                onBlur={(e) =>
                  e.target.value.trim().length > 3 &&
                  setFormFields({
                    ...formFields,
                    dob: e.target.value.trim(),
                  })
                }
                InputProps={{
                  endAdornment: (
                    <FetchActorDataButton
                      type="dob"
                      formFields={formFields}
                      setFormFields={setFormFields}
                      cachedData={cachedData}
                      setCachedData={setCachedData}
                    />
                  ),
                }}
              />
              <ImgInput values={formFields} setValues={setFormFields} />
              <TextField
                type="text"
                name="cup"
                label="Cup"
                value={formFields.cup || ""}
                onChange={(e) =>
                  setFormFields({
                    ...formFields,
                    cup: e.target.value.toLowerCase().trim(),
                  })
                }
                InputProps={{
                  endAdornment: (
                    <FetchActorDataButton
                      type="cup"
                      formFields={formFields}
                      setFormFields={setFormFields}
                      cachedData={cachedData}
                      setCachedData={setCachedData}
                    />
                  ),
                }}
              />
              <TextField
                type="number"
                name="height"
                label="Height"
                placeholder="Height in CM"
                value={formFields.height}
                onChange={(e) =>
                  setFormFields({
                    ...formFields,
                    height: parseInt(e.target.value),
                  })
                }
                InputProps={{
                  endAdornment: (
                    <FetchActorDataButton
                      type="height"
                      formFields={formFields}
                      setFormFields={setFormFields}
                      cachedData={cachedData}
                      setCachedData={setCachedData}
                    />
                  ),
                }}
              />
              <TextField
                type="text"
                name="sizes"
                label="3 Sizes"
                placeholder="BB-WW-HH"
                autoComplete="off"
                value={formFields.sizes}
                onChange={(e) =>
                  setFormFields({
                    ...formFields,
                    sizes: e.target.value,
                  })
                }
                InputProps={{
                  endAdornment: (
                    <FetchActorDataButton
                      type="sizes"
                      formFields={formFields}
                      setFormFields={setFormFields}
                      cachedData={cachedData}
                      setCachedData={setCachedData}
                    />
                  ),
                }}
              />
            </div>
          </div>
          <div className="col-span-2 ml-auto mt-6 grid grid-cols-2 gap-2 justify-self-end md:mb-0 md:w-[calc(50%-0.75rem)]">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleClose}
              disableElevation
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="success"
              size="large"
              type="submit"
              disableElevation
            >
              Save
            </LoadingButton>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default ActorForm;
