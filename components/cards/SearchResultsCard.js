import { useEffect, useState } from "react"
import _ from "lodash"
const { Index } = require("flexsearch");

let index;
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
export default function SearchResults({ artists, searchString, newSelection }) {
  useEffect(() => {
    if (!artists) return
    index = new Index({
      preset: 'match',
      tokenize: 'full'
    })
    artists && artists.forEach && artists.forEach(({ id, name }) => index.add(id, name));
  }, [artists])
  const findArtist = _.memoize(id => artists.find(a => a.id === id))
  return (
    <div className="h-1/3">
      <select
        id="suggestions"
        name="suggestions"
        className="block w-full pl-3 pr-10 text-base bg-blue-300 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {
          index && index.search(searchString, 10)
            .map(findArtist)
            .map(({ id, name }) => <option key={id} value={id}
              onClick={e => newSelection(findArtist(parseInt(e.target.value, 10)))}
            >{name}</option>)
        }
      </select>
    </div>
  )
}
