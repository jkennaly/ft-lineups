/* This example requires Tailwind CSS v2.0+ */
export default function Card({name, colorIndex, clicked}) {
  return (
    <div 
    	onClick={clicked ? clicked : () => {}}
    	className={`flex my-6 p-4 rounded-lg cvlc-${colorIndex} cursor-pointer hover:bg-indigo-600`}
    >
      <div className={`mr-4 flex-shrink-0 self-center`}>
        <svg
          className="h-16 w-16 border border-gray-300 bg-white text-gray-300"
          preserveAspectRatio="none"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <path vectorEffect="non-scaling-stroke" strokeWidth={1} d="M0 0l200 200M0 200L200 0" />
        </svg>
      </div>
      <div>
        <h4 className="text-lg font-bold">{name}</h4>
        <p className="mt-1">
          Repudiandae sint consequuntur vel. Amet ut nobis explicabo numquam expedita quia omnis voluptatem. Minus
          quidem ipsam quia iusto.
        </p>
      </div>
    </div>
  )
}