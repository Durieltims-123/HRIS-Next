import React from 'react'
import Image from 'next/image'

export default function Banner() {
    return (
        <div className='relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[700px]'>
            <Image src="https://links.papareact.com/0fm" layout="fill" objectFit="cover" alt="" />
            <div className='absolute top-1/2 w-full text-center'>
                <p className='text-sm sm:text-lg'>Not sure where to go? Perfect</p>
                <button className='text-purple-500 bg-white px-8 py-3 shadow-md rounded-full my-auto font-bold mt-3 hover:shadow-xl active:scale-90 transition duration-150 '> {"I'm Flexible"} </button>
            </div>
        </div>
    )
}
