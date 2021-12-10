import React, { useState } from 'react';
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

export default function FestivalYear({save, nameChange, baseObject}) {
	const [name, setName] = useState(new Date().getFullYear())
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Festival Year Selection</h3>
        <form className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="year" className="sr-only">
              Festival Year
            </label>
            <input
              type="number"
              name="year"
              id="year"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={new Date().getFullYear()}
              onChange={e => {
              	nameChange(e.target.value)
              	return setName(e.target.value)

              }}
            />
          </div>
          <button
          type="button"
            onClick={() => {
            	//console.log('current name', name)
            	return save(Object.assign(baseObject, {year: name}))
            }}
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}
