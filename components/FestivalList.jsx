/* This example requires Tailwind CSS v2.0+ */
import Card from './cards/Card'
/* This example requires Tailwind CSS v2.0+ */
import { PlusIcon } from '@heroicons/react/solid'
import { ModalPopper } from './Modal'
import { createFestival } from '../services/active'
import React, { useState } from 'react';
import FestivalName from './FestivalName'


export default function Example({festivals}) {
	const [hidden, hideModal] = useState(true)
	function closeModal(val) {
		console.log('creating festival', val)
		hideModal(true)
		return createFestival(val)
	}
	const [newName, setNewName] = useState('')
	//console.log('FestivalList festivals', festivals)
  return (
    <div className="text-center">
      {festivals.map(f => <Card key={f.id} name={f.name} />)}
      <div className="mt-6">

          <ModalPopper
          	title="Create New Festival"
          	withSubmit={false}
          	submission={[closeModal, {name: newName}]}
          	forceClose={hidden}
          	allowOpen={() => hideModal(false)}
          	content={<FestivalName nameChange={setNewName} save={closeModal} />}
          	buttonClasses="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          	buttonContent={<span><PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Festival</span>}
          />
      </div>
    </div>
  )
}
