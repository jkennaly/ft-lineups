/* This example requires Tailwind CSS v2.0+ */
import { PlusIcon } from '@heroicons/react/solid'
import { ModalPopper } from './Modal'
import React, { useState } from 'react';
import Current from './columns/Current'
import Poster from './columns/Poster'
import Processed from './columns/Processed'
import Targets from './columns/Targets'
import Website from './columns/Website'


export default function Example() {
  return (
    <div className="grid w-full grid-cols-5 gap-x-2">
	    <div className="" >
	    <h1>Current Lineup</h1>
	    	<Current />
	    </div>
	    <div className="" >
	    <h1>Band Tiers</h1>
	      	<Targets />
	    </div>
	    <div className="" >
	    <h1>Processed Lineup</h1>
	      	<Processed />
	    </div>
	    <div className="" >
	    <h1>Lineup Poster</h1>
	    	<Poster />
	    </div>
	    <div className="" >
	    <h1>Lineup Page</h1>
	      	<Website />
	    </div>
    </div>
  )
}
