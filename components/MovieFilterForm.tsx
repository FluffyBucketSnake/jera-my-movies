import { Box, TextField } from "@mui/material";
import React, { FC, FormEvent, useState } from "react";

export type MovieFilterFormProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>, query: string) => void;
};

const MovieFilterForm: FC<MovieFilterFormProps> = ({ onSubmit }) => {
  const [query, setQuery] = useState<string>("");

  const submitFilter = (e: FormEvent<HTMLFormElement>) => {
    onSubmit(e, query);
  };

  return (
    <Box component="form" p={4} onSubmit={submitFilter}>
      <TextField
        name="query"
        type="search"
        label="Search for a movie..."
        variant="filled"
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
      />
    </Box>
  );
};

export default MovieFilterForm;
