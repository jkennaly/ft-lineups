/* This example requires Tailwind CSS v2.0+ */
/* This example requires Tailwind CSS v2.0+ */
import React, { useState } from 'react';



export default function Current({ lineup }) {
  return (
    <div className="text-center">
      <ul>
        {
          lineup
            .map(l => l.artist && l.artist.name)
            .filter(x => x)
            .map(n => <li key={n}>{n}</li>)
        }
      </ul>
    </div>
  )
}
