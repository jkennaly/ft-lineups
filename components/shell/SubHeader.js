// components/shell/SubHeader.js
import { PlusIcon } from '@heroicons/react/solid'
import React, { useState } from 'react';
import { useRouter } from 'next/router'


export default function SubHeader({children}) {
	const [newName, setNewName] = useState('')
	const router = useRouter()
  return (
    <header className="bg-white shadow-sm">
		  <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
		    <h1 className="text-lg leading-6 font-semibold text-gray-900">{children ? children : 'Dashboard'}</h1>
		  </div>
		</header>
  )
}
