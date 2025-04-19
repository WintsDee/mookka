
import React from "react";
import { InfoItem } from "./info-item";

export function CommonInfo({
  releaseDate,
  duration,
  language,
  metacritic,
  renderWebsite,
  website,
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {releaseDate && (
        <InfoItem label="Date de sortie" value={releaseDate} />
      )}
      {duration && (
        <InfoItem label="Durée" value={duration} />
      )}
      {language && (
        <InfoItem label="Langue" value={language} />
      )}
      {metacritic && (
        <InfoItem
          label="Metacritic"
          value={`${metacritic}/10`}
          valueClassName={
            metacritic >= 8 ? "text-green-500" :
            metacritic >= 6 ? "text-yellow-500" :
            "text-red-500"
          }
        />
      )}
      {website && renderWebsite && renderWebsite()}
    </div>
  );
}
