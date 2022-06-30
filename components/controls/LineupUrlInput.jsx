/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import React, { useState } from 'react'
import { PencilAltIcon, PlusIcon } from '@heroicons/react/solid'

export default function LineupUrlInput({ lineupUrl, setLineupUrl, classes }) {
    const [currentUrl, setCurrentUrl] = useState(lineupUrl || "www.coachella.com")
    const [urlDisabled, setUrlDisabled] = useState(true)
    return (
        <div className={`${'w-1/3'} ${classes}`}>
            <div className="mt-1 py-5 relative rounded-md shadow-sm flex items-center">
                <label htmlFor="lineup-url" className="block mr-5 text-sm font-medium text-gray-700">
                    Lineup Url
                </label>
                <input
                    type="text"
                    name="lineup-url"
                    id="lineup-url"
                    className="focus:ring-indigo-500 focus:border-indigo-500 bg-gray-300 block w-3/5 sm:text-sm border-gray-300 rounded-md"
                    placeholder="www.coachella.com"
                    onChange={e => setCurrentUrl(e.target.value)}
                    disabled={urlDisabled}
                    value={currentUrl}
                />
                <span className="relative z-0 inline-flex shadow-sm rounded-md">
                    <button
                        type="button"
                        onClick={e => {
                            if (urlDisabled) {
                                setUrlDisabled(false)
                                return
                            }
                            setLineupUrl(currentUrl)
                            setUrlDisabled(false)
                        }}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <span className="sr-only">Previous</span>
                        <PencilAltIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={e => window.open(currentUrl)}
                        className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <span className="sr-only">Lineup Site</span>
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </span>
            </div>
        </div>
    )
}
