/* This example requires Tailwind CSS v2.0+ */
/* This example requires Tailwind CSS v2.0+ */
import React, { useState, useEffect } from 'react';
import {arachProcessed} from '../../models/lists/extracts'


export default function Example({lineupUrl}) {
	const line = lineupUrl ? lineupUrl : `https://www.coachella.com/`
	const [processed, setProcessed] = useState()
	useEffect(() => {
		const fetchProcessedArach = async () => {
			const response = await arachProcessed(line)

			//console.log('splash fetchProcessedArach', response)
			if(response) setProcessed(response)
		}
	  	fetchProcessedArach()
	}, []);

  return (
    <div className="text-center">
      <div className="mt-6">
      {processed}

      </div>
    </div>
  )
}
