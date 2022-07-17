/* This example requires Tailwind CSS v2.0+ */
import React, { useEffect, useState } from 'react';


export default function Targets({ tiers, lineup }) {
  const lineupByTier = lineup.reduce((pv, cv) => {
    if (pv[cv.priority]) pv[cv.priority] = [cv, ...pv[cv.priority]].sort((a, b) => a.artist.name.localeCompare(b.artist.name))
    else pv[cv.priority] = [cv]
    return pv
  }, {})
  return (
    <div className="text-center">
      <ul>
        {tiers && tiers.map && tiers.sort((a, b) => a.level - b.level).map((t, i) => <li
          key={t.id}
          className={`cursor-pointer hover:bg-indigo-600 cvlc-${i} min-h-10vh col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200`}
        ><h1>{t.name}</h1>
          <div>
            {lineupByTier[t.id] && lineupByTier[t.id].map(l => <span
              className='mx-1' key={l.artist.name}>{l.artist.name}</span>
            )}
          </div>
        </li>)}
      </ul>
    </div>
  )
}
