import { MovieWatchlistEntry, Profile } from "@prisma/client";

export type ProfileDTO = {
  id: string;
  name: string;
};

export function convertProfileModelToDTO(model: Profile): ProfileDTO {
  return { id: model.id, name: model.name };
}
