import { createContext, useState, useEffect } from "react";

interface ActorNames {
  _id: string;
  name: string;
  dob?: string | Date;
}

interface ActorsContextValue {
  actorsInDb: ActorNames[];
  refetchActors: () => void;
}

export const ActorNamesContext = createContext<ActorsContextValue>({
  actorsInDb: [],
  refetchActors: () => {},
});

export const ActorNamesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [actorsInDb, setActorsInDb] = useState<ActorNames[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllActors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/lookups/actor-names"
        );
        const data = await response.json();
        setActorsInDb(data);
      } catch (err) {
        console.error("Error fetching actor names list: ", err);
      }
    };

    fetchAllActors();
  }, [refetch]);

  const refetchActors = () => {
    setRefetch((prev) => !prev);
  };

  return (
    <ActorNamesContext.Provider value={{ actorsInDb, refetchActors }}>
      {children}
    </ActorNamesContext.Provider>
  );
};
