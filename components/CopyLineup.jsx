import React, { useState, useEffect } from 'react';
import { fgLineups as linedEvents } from '../models/lists/lineups'
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

export default function CopyLineup() {
  const [source, setSource] = useState("unselected")
  const [fgEvents, setFgEvents] = useState([])
  const [fsgEvents, setSgEvents] = useState([])
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await linedEvents()
      //console.log('splash fetchSeries', response)
      if (response) {
        const sortedEvents = Object.keys(response)
          .sort((a, b) => a.localeCompare(b))
        setFgEvents(sortedEvents)
      }
    }
    fetchEvents()
  }, []);
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Base Festival Lineup</h3>
        <form className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="source">
              Lineup Source
            </label>
            <select
              id="source"
              name="source"
              defaultValue="unselected"
              onChange={e => setSource(e.target.value)}
            >
              <option value="unselected">Choose...</option>
              <option value="festigram">Verifed Festival</option>
              <option value="schedgame">Your Festivals</option>
            </select>
            {source === 'festigram' && (<div>
              <label htmlFor="actual-festivals">Actual Festivals</label>
              <select name="actual-festivals" id="actual-festivals">
                {fgEvents.map(e => <option key={e} value={e}>{e}</option>)}
              </select>

            </div>)}
            {source === 'schedgame' && (<div>Your Festivals</div>)}
          </div>
        </form>
      </div>
    </div>
  )
}
