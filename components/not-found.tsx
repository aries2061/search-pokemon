import Image from 'next/image';
import Link from 'next/link';

export default function PokemonNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="flex items-center mb-4">
        <span className="text-[120px] font-bold text-gray-800">4</span>
        <Image 
          src="/icon.svg" 
          alt="Pokeball" 
          width={110} 
          height={110} 
          className="mx-2"
        />
        <span className="text-[120px] font-bold text-gray-800">4</span>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-700 tracking-wider text-center">POKEMON NOT FOUND</h2>
      </div>
      
      <div className="relative">
        <div className="absolute -bottom-4 w-full h-4 bg-gray-200 rounded-full blur-md opacity-60"></div>
        <Link href="/">
          <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors cursor-pointer">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}