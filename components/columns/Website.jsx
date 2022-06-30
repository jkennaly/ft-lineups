/* This example requires Tailwind CSS v2.0+ */
import Image from 'next/image'
/* This example requires Tailwind CSS v2.0+ */
import React, { useState } from 'react';


export default function Website({lineupUrl}) {
  console.log(lineupUrl)
  return (
    <div className="text-center">
      
        <iframe src={lineupUrl}/>
    </div>
  )
}
