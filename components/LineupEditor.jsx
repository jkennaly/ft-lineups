/* This example requires Tailwind CSS v2.0+ */
import { PlusIcon } from '@heroicons/react/solid'
import { ModalPopper } from './Modal'
import React, { useState } from 'react';
import Current from './columns/Current'
import Poster from './columns/Poster'
import Processed from './columns/Processed'
import Targets from './columns/Targets'
import Website from './columns/Website'
import LineupUrlInput from './controls/LineupUrlInput';
import LineupAdd from './controls/LineupAdd';
import _ from 'lodash'


export default function LineupEditor({
	series,
	years,
	lineups,
	tiers,
	selectedSeries,
	selectedYear,
	artists,
	artistAliases
}) {
	const [lineupUrl, setLineupUrl] = useState('')
	const [rows, setRows] = useState([])
	const [artistName, setArtistName] = useState('')
	const [currentLineup, setCurrentLineup] = useState([])
	const addRow = row => setRows([row, ...rows])
	const removeRow = i => setRows(rows.filter((r, index) => i !== index))
	const modifyRow = (i, row) => {
		rows[i] = row;
		const newRows = [...rows];
		setRows(newRows)
	}
	const appendWord = word => setArtistName(artistName + ' ' + word)
	const appendLineupEntry = newLineup => setCurrentLineup([...currentLineup, newLineup])
	const activeSeries = typeof selectedSeries === 'string' ? { year: selectedSeries } : series.find(s => s.id === selectedSeries)
	const activeYear = typeof selectedYear === 'string' ? { year: selectedYear } : years.find(y => y.id === selectedYear)
	//console.log('lineups', lineups.find)
	const apiLineup = lineups
		.filter(y => y && y.year === selectedYear)
		.map(l => {
			l.artist = artists.find(a => a.id === l.band)
			return l
		})
	const newLineups = _.differenceBy(apiLineup, currentLineup, 'id')
	if (newLineups.length) setCurrentLineup([...currentLineup, ...newLineups])
	if (activeSeries && activeSeries.website && !lineupUrl) setLineupUrl(activeSeries.website)
	return (
		<div>
			<div className="flex flex-col items-center">
				<LineupUrlInput lineupUrl={lineupUrl} setLineupUrl={setLineupUrl} classes={''} />

				<LineupAdd
					addRow={addRow}
					artistName={artistName}
					setArtistName={setArtistName}
					artists={artists}
					artistAliases={artistAliases}
					tiers={tiers}
					addLineup={appendLineupEntry}
					activeYear={activeYear}

				/>
			</div>
			<div className="grid w-full grid-cols-3 gap-x-2">
				<div className="" >
					<h1>Processed Lineup</h1>
					<Processed
						lineupUrl={lineupUrl}
						topRows={rows}
						removeRow={removeRow}
						appendWord={appendWord}
						modifyRow={modifyRow}
					/>
				</div>
				<div className="" >
					<h1>Band Tiers</h1>
					<Targets tiers={tiers} lineup={currentLineup} />
				</div>
				<div className="" >
					<h1>Current Lineup</h1>
					<Current lineup={currentLineup} />
				</div>
			</div>
		</div>
	)
}
