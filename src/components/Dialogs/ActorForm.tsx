import {
  Button,
  Dialog,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ActorCard from "../Actors/ActorCard";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { ActorNamesContext } from "../Actors/ActorNamesProvider";

interface ActorFormProps {
  openEditDialog: boolean;
  setOpenEditDialog: (open: boolean) => void;
  refetch: () => void;
  setOpenSnack?: (open: boolean) => void;
  actorToEdit: { name: string | null; id: string } | null;
}

const ActorForm: React.FC<ActorFormProps> = ({
  openEditDialog,
  setOpenEditDialog,
  refetch,
  // setOpenSnack,
  actorToEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingActorData, setLoadingActorData] = useState(false);
  const { refetchActors } = useContext(ActorNamesContext);
  const [formFields, setFormFields] = useState({
    name: "",
    dob: "",
    height: undefined as number | undefined,
    img500: "",
    isMale: false,
  });

  const handleClose = () => {
    setOpenEditDialog(false);
    setFormFields({
      name: "",
      dob: "",
      height: undefined,
      img500: "",
      isMale: false,
    });
    setLoading(false);
  };

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/actors/${actorToEdit && actorToEdit.name}`
        );
        setFormFields(res.data);
      } catch (err) {
        console.error("error fetching actor: ", err);
      }
    };

    if (actorToEdit) {
      setLoadingActorData(true);
      fetchActor();
      setLoadingActorData(false);
    }
  }, [actorToEdit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formFields.name.length < 4) return;
    setLoading(true);

    try {
      if (!actorToEdit?.name) {
        await axios.post("http://localhost:5000/actors", formFields);
        refetchActors();
      } else {
        await axios.put(
          `http://localhost:5000/actors/${actorToEdit && actorToEdit.name}`,
          formFields
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
      {loadingActorData ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6">
          <h1 className="w-full mb-3 text-2xl font-semibold">Add Actor</h1>
          <form onSubmit={handleSubmit}>
            <div className="md:grid-cols-2 md:grid flex flex-col items-center justify-center gap-6">
              <div className="grid w-[69%] mx-auto">
                <ActorCard actor={formFields} noLink />
              </div>
              <div className="flex flex-col w-full gap-4">
                <TextField
                  type="text"
                  name="name"
                  autoFocus
                  label="Name"
                  required
                  autoComplete="off"
                  defaultValue={formFields.name}
                  onBlur={(e) =>
                    setFormFields({
                      ...formFields,
                      name: e.target.value.toLowerCase().trim(),
                    })
                  }
                />
                <TextField
                  type="url"
                  name="img500"
                  label="Image URL"
                  defaultValue={formFields.img500}
                  onBlur={(e) =>
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
                    onBlur={(e) =>
                      setFormFields({
                        ...formFields,
                        height: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formFields.isMale}
                      onChange={() =>
                        setFormFields({
                          ...formFields,
                          isMale: !formFields.isMale,
                        })
                      }
                    />
                  }
                  label="Male?"
                />
              </div>
            </div>
            <div className="md:mb-0 justify-self-end grid grid-cols-2 col-span-2 gap-2 mt-6 md:w-[calc(50%-0.75rem)] ml-auto">
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
      )}
    </Dialog>
  );
};

export default ActorForm;
