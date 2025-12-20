import React from "react";

const Result = ({ message, wikiInfo }) => {
  console.log("RESULT RENDER:", { message, wikiInfo });

  return (
    <div className="mb-4 text-center">
      {message && <p className="text-lg text-gray-700">{message}</p>}

      {wikiInfo && (
        <div className="mt-4 p-4 bg-white rounded shadow max-w-md">
          <h2 className="text-xl font-bold">{wikiInfo.title}</h2>
          <p className="mt-2">{wikiInfo.description}</p>
          <a
            href={wikiInfo.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline mt-2 block"
          >
            Baca di Wiki
          </a>
        </div>
      )}
    </div>
  );
};

export default Result;
