/* This example requires Tailwind CSS v2.0+ */
import React, { useState } from 'react';


export default function Targets({ tiers }) {
  return (
    <div className="text-center">
      <ul>
        {tiers.sort((a, b) => a.level - b.level).map((t, i) => <li
          key={t.id}
          className={`cursor-pointer hover:bg-indigo-600 cvlc-${i} min-h-10vh col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200`}
        >{t.name}</li>)}
      </ul>
    </div>
  )
}
