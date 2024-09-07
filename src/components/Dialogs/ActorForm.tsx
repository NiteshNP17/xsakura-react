import { Button, Dialog, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ActorCard from "../Actors/ActorCard";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import config from "../../utils/config";
import { ActorData } from "../../utils/customTypes";

interface ActorFormProps {
  openEditDialog: boolean;
  setOpenEditDialog: (open: boolean) => void;
  refetch: () => void;
  setOpenSnack?: (open: boolean) => void;
  actorToEdit: { actor: ActorData; id: string } | null;
}

const ActorForm: React.FC<ActorFormProps> = ({
  openEditDialog,
  setOpenEditDialog,
  refetch,
  // setOpenSnack,
  actorToEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({} as ActorData);

  const handleClose = () => {
    // setFormFields({} as ActorData);
    setLoading(false);
    setOpenEditDialog(false);
  };

  useEffect(() => {
    if (actorToEdit?.actor.name) setFormFields(actorToEdit.actor);
    else setFormFields({} as ActorData);
  }, [actorToEdit]);

  const verifyActor = async (actorName: string) => {
    const res = await axios.get(`${config.apiUrl}/actors/${actorName}`);
    if (res.data.message !== "notFound") {
      setFormFields({
        ...formFields,
        slug: res.data.slug,
        name: actorName,
      });
    } else {
      console.log("notFound");
      setFormFields({
        ...formFields,
        slug: undefined,
        name: actorName,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formFields.name.length < 3) return;
    setLoading(true);

    try {
      if (!actorToEdit?.actor.name && !formFields.slug) {
        await axios.post(`${config.apiUrl}/actors`, formFields);
      } else {
        await axios.put(
          `${config.apiUrl}/actors/${formFields.slug}`,
          formFields,
        );
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
          {!formFields.slug ? "Add" : "Edit"} Actor {formFields.slug}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center gap-6 md:grid md:grid-cols-2">
            <div className="mx-auto grid w-[69%]">
              <ActorCard actor={formFields} noLink />
            </div>
            <div className="flex w-full flex-col gap-4">
              <TextField
                type="text"
                name="name"
                autoFocus
                label="Name"
                required
                autoComplete="off"
                defaultValue={formFields.name}
                onBlur={(e) => {
                  !formFields.slug && e.target.value.trim().length > 2
                    ? verifyActor(e.target.value.toLowerCase().trim())
                    : setFormFields({
                        ...formFields,
                        name: e.target.value.toLowerCase().trim(),
                      });
                }}
              />
              <TextField
                type="url"
                name="img500"
                label="Image URL"
                defaultValue={formFields.img500}
                onBlur={(e) =>
                  e.target.value.trim().length > 10 &&
                  setFormFields({
                    ...formFields,
                    img500: e.target.value.toLowerCase().trim(),
                  })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  type="text"
                  name="dob"
                  label="Birthdate"
                  autoComplete="off"
                  defaultValue={formFields.dob}
                  onBlur={(e) =>
                    e.target.value.trim().length > 3 &&
                    setFormFields({
                      ...formFields,
                      dob: e.target.value.trim(),
                    })
                  }
                />
                <TextField
                  type="number"
                  name="height"
                  label="Height"
                  placeholder="Height in CM"
                  defaultValue={formFields.height}
                  onChange={(e) =>
                    e.target.value.trim().length > 2 &&
                    setFormFields({
                      ...formFields,
                      height: parseInt(e.target.value),
                    })
                  }
                />
              </div>
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
