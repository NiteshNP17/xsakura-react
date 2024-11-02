import { AddCircleOutline } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import config from "../utils/config";
import { Link } from "react-router-dom";

interface Studios {
  slug: string;
  name: string;
  labels: string[];
  rank: number;
}

const Studio = () => {
  const [studList, setStudList] = useState<Studios[]>([]);

  useEffect(() => {
    const fetchAllStudios = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/studios`);
        const data = await res.json();
        setStudList(data);
      } catch (err) {
        console.error("Error fetching Studios list: ", err);
      }
    };

    fetchAllStudios();
  }, []);

  return (
    <div className="mx-auto max-w-[1660px] px-4">
      <div className="my-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase">Studios</h1>
        <IconButton color="primary" onClick={() => {}}>
          <AddCircleOutline />
        </IconButton>
      </div>
      <div className="grid gap-4">
        {studList.map((studio) => (
          <Link key={studio.slug} to={`/studio/${studio.slug}?sort=release`}>
            {studio.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Studio;
