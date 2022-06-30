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
import { SortAscendingIcon, UsersIcon } from '@heroicons/react/solid'
import { useState } from 'react'

const NEUTRAL_COLOR = 'white'
const ADDITION_COLOR = 'green-300'
const SUGGESTED_COLOR = 'blue-300'
const NEUTRAL_TEXT = 'Source'
const ADDITION_TEXT = 'New'
const SUGGESTED_TEXT = 'Suggested'

function toTitleCase(thisString) {
    var i, j, str, lowers, uppers;
    str = thisString.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless 
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
            function (txt) {
                return txt.toLowerCase();
            });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
            uppers[i].toUpperCase());

    return str;
}

export default function FinalAnswer({ artist, tiers, newPriorityId, setArtist, updateAnswer }) {
    const [bgColor, setBgColor] = useState(NEUTRAL_COLOR)
    const [label, setLabel] = useState(NEUTRAL_TEXT)
    if ((!artist || !artist.name)) {
        if (label !== NEUTRAL_TEXT) {

            setBgColor(NEUTRAL_COLOR)
            setLabel(NEUTRAL_TEXT)
        }
    } else if (!artist.id) {
        if (label !== ADDITION_TEXT) {

            setBgColor(ADDITION_COLOR)
            setLabel(ADDITION_TEXT)
        }
    } else if (label !== SUGGESTED_TEXT) {
        setBgColor(SUGGESTED_COLOR)
        setLabel(SUGGESTED_TEXT)
    }


    return (
        <div className=' h-2/3'>
            <div className="flex rounded-md shadow-sm">
                <div className={`border bg-${bgColor} border-gray-300 rounded-none px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600`}>
                    <label htmlFor="artist" className="block text-xs font-medium text-gray-900">
                        {label}
                    </label>
                    <input
                        type="text"
                        name="artist"
                        id="artist"
                        disabled
                        className="rounded-md focus:ring-indigo-500 opacity-100 bg-gray-300 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300"
                        value={artist && artist.name || ''}
                    />
                </div>
                <div>
                    <button
                        type="button"
                        disabled={!artist || !artist.name || label === SUGGESTED_TEXT}
                        onClick={e => { setArtist(toTitleCase(artist.name)); updateAnswer({ name: toTitleCase(artist.name) }) }}
                        className="w-full h-1/2 relative inline-flex items-center space-x-2 px-4 border border-gray-300 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <SortAscendingIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span>TitleCase</span>
                    </button>
                    <select
                        onChange={e => newPriorityId(parseInt(e.target.value, 10))}
                        className="block w-full h-1/2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {tiers && tiers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
            </div>
        </div>
    )
}
