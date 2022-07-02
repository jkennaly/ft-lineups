/* This example requires Tailwind CSS v2.0+ */
/* This example requires Tailwind CSS v2.0+ */
import React, { useState } from 'react';



export default function Current({ lineup }) {
  return (
    <div className="text-center">
      {
        lineup
          .map(l => l.artist && l.artist.name)
          .filter(x => x)
          .sort((a, b) => a.localeCompare(b))
          .map(n => <span className='mx-1' key={n}>{n}</span>)
      }
    </div>
  )
}
