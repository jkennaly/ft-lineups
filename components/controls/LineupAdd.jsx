import React, { useState } from 'react';
import _ from 'lodash'
import { ArrowCircleDownIcon, ArrowCircleRightIcon, MinusCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'
import Suggested from '../cards/SearchResultsCard'
import FinalAnswer from '../cards/FinalAnswer'


export default function LineupAdd({ addRow, artistName, setArtistName, activeYear, artists, tiers, addLineup }) {
    const [finalAnswer, setFinalAnswer] = useState({})
    const [priority, setPriority] = useState(_.get(tiers, '[0].id', 0))
    const addToLineup = e => {
        addRow(artistName)
        setArtistName('')
    }
    const acceptLineup = () => {
        setArtistName('')
        setFinalAnswer({ name: '' })
        addLineup({
            artist: finalAnswer,
            band: finalAnswer.id,
            priority,
            festival: activeYear && activeYear.id
        })
    }
    return (
        <div>
            <div className="text-center flex py-5" >
                <button
                    type="button"
                    onClick={addToLineup}
                    className="-ml-px relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <span className="sr-only">Copy To Raw Lineup</span>
                    <ArrowCircleDownIcon className="h-5 w-5" aria-hidden="true" />

                </button>
                <div className="relative w-96" >
                    <input
                        className="focus:ring-indigo-500 focus:border-indigo-500 w-96 h-full bg-green-300 block sm:text-sm border-gray-300 rounded-none"
                        value={artistName}
                        onChange={e => setArtistName(e.target.value)}
                    />
                    <div className="absolute top-1/2 right-0 h-10 w-24" >
                        <div className='relative -top-1/2 flex '>
                            <button
                                type="button"
                                onClick={e => setArtistName('')}
                                className=" h-10 w-10 border border-gray-300 bg-red-300 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <MinusCircleIcon className="h-5 w-5 mx-2.5" aria-hidden="true" />

                            </button>
                            <button
                                type="button"
                                onClick={e => setFinalAnswer({ name: artistName })}
                                className=" h-10 w-10 border border-gray-300 bg-green-100 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <ArrowCircleRightIcon className="h-5 w-5 mx-2.5" aria-hidden="true" />

                            </button>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <Suggested
                        artists={artists}
                        searchString={artistName}
                        newSelection={setFinalAnswer}
                    />
                    <FinalAnswer
                        artist={finalAnswer}
                        tiers={tiers}
                        newPriorityId={setPriority}
                        setArtist={setArtistName}
                        updateAnswer={setFinalAnswer}
                    />
                </div>
                <button
                    type="button"
                    onClick={acceptLineup}
                    className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <span className="sr-only">Add to Final Lineup</span>
                    <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />

                </button>
            </div>
        </div>
    )
}
